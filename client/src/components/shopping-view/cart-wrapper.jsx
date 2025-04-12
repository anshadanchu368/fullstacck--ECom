import React from 'react';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../button';
import UserCartItemsCOntent from './cart-items-content';
import { useNavigate } from 'react-router-dom';

const UserCartWrapper = ({ cartItems }) => {

  const navigate=useNavigate();
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, currentItem) => {
          const price =
            Number(currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) || 0;
          return sum + price * (currentItem?.quantity || 0);
        }, 0)
      : 0;

  return (
    <SheetContent className="sm:max-w-md p-4">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => <UserCartItemsCOntent key={item.productId} cartItem={item} />)
        ) : (
          <p className="text-muted-foreground">Your cart is empty</p>
        )}

        <div className="mt-4 space-y-4">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">{totalCartAmount.toFixed(2)}</span>
          </div>
          <Button onClick={()=>navigate('/shop/checkout')}className="w-full mt-6">Checkout</Button>
        </div>
      </div>
    </SheetContent>
  );
};

export default UserCartWrapper;
