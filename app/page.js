'use client';

import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';

// Components
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturedSection from '../components/Products/FeaturedSection';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';

// Redux action (not implemented yet)
// import { fetchProductsByFilters } from '../state/slices/productsSlice';

export default function Home() {
  // const dispatch = useDispatch();
  // const { products, loading, error } = useSelector((state) => state.products);
  // const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // dispatch(
    //   fetchProductsByFilters({
    //     gender: 'Women',
    //     category: 'Bottom Wear',
    //     limit: 8,
    //   })
    // );

    // const fetchBestSeller = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/best-seller`
    //     );
    //     setBestSellerProduct(response.data);
    //   } catch (error) {
    //     console.error('Error fetching best seller:', error);
    //   }
    // };

    // fetchBestSeller();
  }, []); // empty dependency array for now

  return (
    <>
      <Header />
      <Hero />
      <GenderCollectionSection />

      <div id="new-arrivals">
        <NewArrivals />
      </div>

      {/* Best Seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {/* Replace with placeholder text or loading state */}
      <p className="text-center">Best seller product will appear here.</p>

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        {/* Replace ProductGrid with placeholder or empty */}
        <p className="text-center">Product grid will appear here.</p>
      </div>

      <FeaturedCollection />
      <FeaturedSection />
      <Footer />
    </>
  );
}
