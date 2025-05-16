'use client';

import Link from 'next/link';
import Image from 'next/image';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} href={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full h-96 mb-4 overflow-hidden rounded-lg">
              <Image
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                priority={index < 4} // Load top few images eagerly
              />
            </div>
            <h3 className="text-sm mb-2 font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter">
              ₹ {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
