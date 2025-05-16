// pages/index.js
import React from 'react';
import Hero from '../components/Layout/Hero';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals"; 
import ProductDetails from '@/components/Products/ProductDetails';

const Home = () => {
  return (
    <>
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero />

      <GenderCollectionSection />

      {/*New Arrivals Section */}
      <NewArrivals />

      {/* You May like */}
      <ProductDetails />
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
