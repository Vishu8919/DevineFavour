'use client';

import React, { useEffect, useState } from 'react';
// import ProductGrid from './ProductGrid';

const ProductDetails = ({ productId }) => {
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate fetching product and similar products
  useEffect(() => {
    setLoading(true);

    const dummyProduct = {
      _id: productId || 'default-id',
      name: 'Elegant Women Hat',
      price: 1200,
      originalPrice: 1500,
      description: 'A stylish elegant women’s hat, perfect for all seasons.',
      images: [
        { url: '/images/Woman elegant hat.webp', altText: 'Woman elegant hat' },
        { url: '/images/Jody G women vintage hat..webp', altText: 'Jody G hat' },
      ],
      colors: ['Black', 'Red', 'Beige'],
      sizes: ['S', 'M', 'L'],
      brand: 'HatMakers',
      material: 'Wool',
    };

    const dummySimilarProducts = [
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

    setTimeout(() => {
      setSelectedProduct(dummyProduct);
      setMainImage(dummyProduct.images[0].url);
      setSimilarProducts(dummySimilarProducts);
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1);
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color before adding to cart.');
      return;
    }

    setIsButtonDisabled(true);
    setTimeout(() => {
      alert('Product added to cart!');
      setIsButtonDisabled(false);
    }, 1000);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading product.</p>;

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? 'border-black' : 'border-gray-300'
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img src={mainImage} alt="Main Product" className="w-full h-auto object-cover rounded-lg" />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
              <p className="text-lg text-gray-600 mb-1 line-through">
                ₹{selectedProduct.originalPrice}
              </p>
              <p className="text-xl text-gray-700 mb-2">₹{selectedProduct.price}</p>
              <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

              {/* Colors */}
              <div className="mb-4">
                <p className="text-gray-700">Colors:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color ? 'border-4 border-black' : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: 'brightness(0.5)',
                      }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size ? 'bg-black text-white' : ''
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange('minus')}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('plus')}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-900'
                }`}
              >
                {isButtonDisabled ? 'Adding...' : 'ADD TO CART'}
              </button>

              {/* Characteristics */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
            {/* <ProductGrid products={similarProducts} loading={loading} error={error} /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
