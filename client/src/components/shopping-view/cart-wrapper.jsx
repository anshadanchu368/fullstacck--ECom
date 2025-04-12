import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../button'
import UserCartItemsCOntent from './cart-items-content'

const  UserCartWrapper= ({cartItems}) => {
  return (
<SheetContent className="sm:max-w-md p-4">
  <SheetHeader>
    <SheetTitle>Your Cart</SheetTitle>
  </SheetHeader>

  <div className="mt-8 space-y-4">
    {cartItems && cartItems.length > 0
      ? cartItems.map((item) => (
          <UserCartItemsCOntent key={item.productId} cartItem={item} />
        ))
      : <p className="text-muted-foreground">Your cart is empty</p>}
    
    <div className="mt-4 space-y-4">
      <div className="flex justify-between ">
        <span className="font-bold">Total</span>
        <span className="font-bold">1000</span>
      </div>
      <Button className="w-full mt-6 ">Checkout</Button>
    </div>
  </div>
</SheetContent>

  )
}

export default UserCartWrapper
