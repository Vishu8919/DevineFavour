// app/api/cart/merge/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Cart from '@/models/Cart';
import { getAuthUser } from '@/utils/getAuthUser';

export async function POST(req) {
  await connectDB();

  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { guestId } = await req.json();
    const userId = user._id;

    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: userId });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return NextResponse.json({ message: 'Guest cart is empty' }, { status: 400 });
      }

      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const index = userCart.products.findIndex(
            item =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (index > -1) {
            userCart.products[index].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();
        await Cart.findOneAndDelete({ guestId });
        return NextResponse.json(userCart);
      } else {
        guestCart.user = userId;
        guestCart.guestId = undefined;
        await guestCart.save();
        return NextResponse.json(guestCart);
      }
    } else {
      if (userCart) return NextResponse.json(userCart);
      return NextResponse.json({ message: 'Guest cart not found' }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
