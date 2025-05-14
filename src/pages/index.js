// pages/index.js
import React from 'react';
import Hero from '../components/Layout/Hero';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';

const Home = () => {
  return (
    <>
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
