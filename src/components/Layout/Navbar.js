'use client';

import Link from 'next/link';
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from 'react-icons/hi2';
import SearchBar from '../Common/SearchBar';
// import CartDrawer from './CartDrawer';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
// import { useSelector } from 'react-redux'; // Uncomment when Redux is ready

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  // TEMP: Simulate cart and user data
  const cartItemCount = 3; // Replace with Redux: cart?.products?.reduce(...)
  const user = { role: 'admin' }; // Replace with Redux: useSelector(...)

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <nav className="container mx-auto flex items-center py-4 px-6">
        {/* Left - Logo */}
        <Link href="/" className="text-2xl font-medium">
          Divine Favor Boutique
        </Link>

        {/* Center - Navigation Links */}
        <div className="flex-grow hidden md:flex justify-center space-x-6">
          <Link href="/collections/all?gender=Men" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
            Men
          </Link>
          <Link href="/collections/all?gender=Women" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
            Women
          </Link>
          <Link href="/collections/all?category=Top%20Wear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
            Top Wear
          </Link>
          <Link href="/collections/all?category=Bottom%20Wear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
            Bottom Wear
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center space-x-4 ml-auto">
          {user && user.role === 'admin' && (
            <Link href="/admin" className="block bg-gray-700 px-2 rounded text-sm text-white">
              Admin
            </Link>
          )}

          <Link href="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button onClick={toggleCartDrawer} className="relative hover:text-black">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          <div className="overflow-hidden">
            <SearchBar />
          </div>

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      {/* <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} /> */}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link href="/collections/all?gender=Men" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
              Men
            </Link>
            <Link href="/collections/all?gender=Women" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
              Women
            </Link>
            <Link href="/collections/all?category=Top%20Wear" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
              Top Wear
            </Link>
            <Link href="/collections/all?category=Bottom%20Wear" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
