'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Components
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturedSection from '../components/Products/FeaturedSection';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';

export default function Home() {
  useEffect(() => {
    // Fetch logic if needed
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <GenderCollectionSection />

      <div id="new-arrivals">
        <NewArrivals />
      </div>

      {/* Navigation Section */}
      <section className="my-8 px-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Explore Pages</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <Link href="/login" className="underline text-blue-600">Login</Link>
          <Link href="/register" className="underline text-blue-600">Register</Link>
          <Link href="/profile" className="underline text-blue-600">Profile</Link>
          <Link href="/collections/men" className="underline text-blue-600">Men's Collection</Link>
          <Link href="/collections/women" className="underline text-blue-600">Women's Collection</Link>
          <Link href="/product/1" className="underline text-blue-600">Product Details</Link>
          <Link href="/checkout" className="underline text-blue-600">Checkout</Link>
          <Link href="/order-confirmation" className="underline text-blue-600">Order Confirmation</Link>
          <Link href="/order/123" className="underline text-blue-600">Order Details</Link>
          <Link href="/my-orders" className="underline text-blue-600">My Orders</Link>
          <Link href="/admin" className="underline text-blue-600">Admin Home</Link>
          <Link href="/admin/users" className="underline text-blue-600">User Management</Link>
          <Link href="/admin/products" className="underline text-blue-600">Product Management</Link>
          <Link href="/admin/products/1/edit" className="underline text-blue-600">Edit Product</Link>
          <Link href="/admin/orders" className="underline text-blue-600">Order Management</Link>
        </div>
      </section>

      {/* Best Seller Placeholder */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      <p className="text-center">Best seller product will appear here.</p>

      {/* Top Wears Placeholder */}
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <p className="text-center">Product grid will appear here.</p>
      </div>

      <FeaturedCollection />
      <FeaturedSection />
      <Footer />
    </>
  );
}
