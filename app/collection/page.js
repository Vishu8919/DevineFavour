'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '@/components/Products/FilterSidebar';
import SortOptions from '@/components/Products/SortOptions';
import ProductGrid from '@/components/Products/ProductGrid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '@/redux/slices/productsSlice';
import { useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation'; // Only works in client components

const CollectionPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const searchParams = useSearchParams();
  const params = useParams(); // gets dynamic route segments
  const collection = params?.collection || ''; // fallback to empty string if undefined

    const queryParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams.toString()]);

  const SidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, queryParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (SidebarRef.current && !SidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      {/* Sidebar */}
      <div
        ref={SidebarRef}
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 
        left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 
        lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collections</h2>
        <SortOptions />
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
