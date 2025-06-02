// app/api/cart/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

// Utility to get cart
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// ✅ GET /api/cart - Fetch cart
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const guestId = searchParams.get('guestId');

  try {
    const cart = await getCart(userId, guestId);
    if (cart) return NextResponse.json(cart);
    return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ✅ POST /api/cart - Add product to cart
export async function POST(req) {
  await connectDB();
  const { productId, quantity, size, color, guestId, userId } = await req.json();

  try {
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    let cart = await getCart(userId, guestId);

    if (cart) {
      const index = cart.products.findIndex(
        p =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0]?.url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await cart.save();
      return NextResponse.json(cart);
    } else {
      const newCart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || `guest_${Date.now()}`,
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0]?.url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return NextResponse.json(newCart, { status: 201 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ✅ PUT /api/cart - Update quantity
export async function PUT(req) {
  await connectDB();
  const { productId, quantity, size, color, guestId, userId } = await req.json();

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return NextResponse.json({ message: 'Cart not found' }, { status: 404 });

    const index = cart.products.findIndex(
      p => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if (index > -1) {
      if (quantity > 0) {
        cart.products[index].quantity = quantity;
      } else {
        cart.products.splice(index, 1);
      }

      cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await cart.save();
      return NextResponse.json(cart);
    } else {
      return NextResponse.json({ message: 'Product not found in cart' }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// ✅ DELETE /api/cart - Remove product from cart
export async function DELETE(req) {
  await connectDB();
  const { productId, size, color, guestId, userId } = await req.json();

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return NextResponse.json({ message: 'Cart not found' }, { status: 404 });

    const index = cart.products.findIndex(
      p => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if (index > -1) {
      cart.products.splice(index, 1);
      cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await cart.save();
      return NextResponse.json(cart);
    } else {
      return NextResponse.json({ message: 'Product not found in cart' }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
