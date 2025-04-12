import { Minus, Plus, Trash } from "lucide-react";
import React from "react";
import { Button } from "../button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner"


const UserCartItemsCOntent = ({ cartItem }) => {
  const {user} = useSelector(state => state.auth);

  console.log(user, "user on cart")
  const dispatch = useDispatch();

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Success", {
          description: "product deleted.",
        });
      }
    });
  }


  function handleQuantityUpdate(getCartItem, newQuantity) {
    if (newQuantity <= 0) {
      handleCartItemDelete(getCartItem);
    } else {
      dispatch(updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity: newQuantity
      }));
    }
  }


  console.log("Cart item structure:", cartItem);

  console.log(typeof cartItem?.price, cartItem?.price,"price of cartitem");  // Check the type of price
console.log(typeof cartItem?.salePrice, cartItem?.salePrice,"saleprice of cartitem");


  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
      <h3 className="font-extrabold">
  {typeof cartItem?.title === 'string' ? cartItem?.title : 'No Title'}
</h3>
        <div className="flex items-center mt-1 space-x-2">
          <Button
            variant="outline"
            className="h-8 w-14 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleQuantityUpdate(cartItem, cartItem?.quantity - 1)}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold w-8 text-center">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-14 rounded-full"
            size="icon"
            onClick={() => handleQuantityUpdate(cartItem, cartItem?.quantity + 1)}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash 
          onClick={() => handleCartItemDelete(cartItem)} 
          className="cursor-pointer mt-1" 
          size={20}
        />
      </div>
    </div>
  );
};

export default UserCartItemsCOntent;
