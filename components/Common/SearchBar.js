'use client';

import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { fetchProductsByFilters, setFilters } from '@/redux/slices/productsSlice';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // const dispatch = useDispatch();
  const router = useRouter();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchTermLower = searchTerm.toLowerCase();
    const filters = {};

    if (['men', 'women'].includes(searchTermLower)) {
      filters.gender = searchTermLower.charAt(0).toUpperCase() + searchTermLower.slice(1);
    } else if (['top', 'bottom'].includes(searchTermLower)) {
      filters.category = `${searchTermLower} Wear`;
    } else {
      filters.search = searchTermLower;
    }

    // TODO: Uncomment these lines when Redux + backend logic is in place
    // dispatch(setFilters(filters));
    // dispatch(fetchProductsByFilters(filters));

    router.push(`/collections/all?${new URLSearchParams(filters).toString()}`);
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? 'absolute top-0 left-0 w-full bg-white h-24 z-50' : 'w-auto'
      }`}
    >
      {isOpen ? (
        <form onSubmit={handleSearch} className="relative flex items-center justify-center w-full">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
