'use client'; // Required for useState, useEffect, and event handlers in Next.js (App Router) or can be skipped in Pages Router

import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const router = useRouter();

  const [newArrivals, setNewArrivals] = useState([]);

  // Dummy data for now
  useEffect(() => {
    const dummyProducts = [
      {
        _id: '1',
        name: 'Woman elegant hat',
        price: 25,
        images: [{ url: '/images/Woman elegant hat.webp', altText: 'Woman elegant hat' }],
      },
      {
        _id: '2',
        name: 'Jody G women vintage hat.',
        price: 35,
        images: [{ url: '/images/Jody G women vintage hat..webp', altText: 'Jody G women vintage hat.' }],
      },
      {
        _id: '3',
        name: 'Sonni womens elegant hat',
        price: 35,
        images: [{ url: '/images/Sonni womens elegant hat.webp', altText: 'Sonni womens elegant hat' }],
      },
      {
        _id: '4',
        name: 'Elegant Womens Hat',
        price: 25,
        images: [{ url: '/images/Elegant Womens Hat.webp', altText: 'Elegant Womens Hat' }],
      },
      {
        _id: '5',
        name: 'Stacy Adams Mens Shoe',
        price: 25,
        images: [{ url: '/images/Stacy Adams Mens Shoe.webp', altText: 'Stacy Adams Mens Shoe' }],
      },
    ];
    setNewArrivals(dummyProducts);
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [newArrivals]);

  const handleDoubleClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scroll Buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
       {newArrivals.map((product) => (
  <div
    key={product._id}
    className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
    onDoubleClick={() => handleDoubleClick(product._id)}
  >
    <Image
      src={product.images[0]?.url}
      alt={product.images[0]?.altText || product.name}
      width={500}      // fixed width or adjust as needed
      height={500}     // fixed height or adjust as needed
      className="w-full h-[500px] object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    />
    <div className="text-center mt-4">
      <h4 className="text-lg font-medium">{product.name}</h4>
      <p className="text-gray-600">${product.price}</p>
    </div>
  </div>
))}
      </div>
    </section>
  );
};

export default NewArrivals;
