'use client';

import React from 'react';
import Image from 'next/image';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { updateCartItemQuantity, removeFromCart } from '@/redux/slices/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div className="p-4">
      {cart.products.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="flex items-center justify-between py-4 border-b"
        >
          {/* Product Image */}
          <div className="relative w-20 h-24">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded"
              unoptimized // remove this if you configure next.config.js for remote images
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 px-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-500 text-sm">
              Size: {product.size} | Color: {product.color}
            </p>
            <div className="flex items-center mt-2">
              <button
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    -1,
                    product.quantity,
                    product.size,
                    product.color
                  )
                }
                className="border rounded px-2 py-1 text-xl font-medium"
              >
                -
              </button>
              <span className="mx-4">{product.quantity}</span>
              <button
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    1,
                    product.quantity,
                    product.size,
                    product.color
                  )
                }
                className="border rounded px-2 py-1 text-xl font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Price & Delete */}
          <div className="flex flex-col items-end">
            <p className="font-medium text-lg">₹{product.price.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
            >
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
