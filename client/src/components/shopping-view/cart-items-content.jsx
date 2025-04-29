import { Minus, Plus, Trash } from "lucide-react";
import React from "react";
import { Button } from "../button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner"


const UserCartItemsContent = ({ cartItem }) => {
  const {user} = useSelector(state => state.auth);
  const {cartItems} = useSelector(state => state.shoppingCart);
  const {productList} = useSelector(state => state.shoppingProducts);

  const dispatch = useDispatch();

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Success", {
          description: "Product deleted.",
        });
      }
    });
  }

  function handleQuantityUpdate(getCartItem, typeOfAction) {
    const getCartItems = cartItems.items || [];
  
    if (typeOfAction === 'plus') {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCartItem?.productId
      );
      const getCurrentProductIndex = productList.findIndex(
        (product) => product?._id === getCartItem?.productId
      );
      
      if (getCurrentProductIndex === -1) {
        toast.error("Error", {
          description: "Product not found in product list."
        });
        return;
      }
  
      const getTotalStock = productList[getCurrentProductIndex].totalStock;
  
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error("warning", {
            description: `Only ${getTotalStock} quantity available for this item`
          });
          return;
        }
      }
    }
  
    if (typeOfAction === 'minus' && getCartItem?.quantity <= 1) {
      return;
    }
  
    dispatch(updateCartQuantity({
      userId: user?.id,
      productId: getCartItem?.productId,
      quantity:
        typeOfAction === 'plus'
          ? getCartItem?.quantity + 1
          : getCartItem?.quantity - 1
    }));
  }

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
            disabled={cartItem?.quantity <= 1}
            onClick={() => handleQuantityUpdate(cartItem, 'minus')}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold w-8 text-center">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-14 rounded-full"
            size="icon"
            onClick={() => handleQuantityUpdate(cartItem, 'plus')}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ₹
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

export default UserCartItemsContent;