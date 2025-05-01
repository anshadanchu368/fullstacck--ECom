"use client"

import { Minus, Plus, Trash } from 'lucide-react'
import React from "react"
import { Button } from "../button"
import { useDispatch, useSelector } from "react-redux"
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice"
import { toast } from "sonner"

const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shoppingCart)
  const { productList } = useSelector((state) => state.shoppingProducts)

  const dispatch = useDispatch()

  function handleCartItemDelete(getCartItem) {
    dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Success", {
          description: "Product deleted.",
        })
      }
    })
  }

  function handleQuantityUpdate(getCartItem, typeOfAction) {
    const getCartItems = cartItems.items || []

    if (typeOfAction === "plus") {
      const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCartItem?.productId)
      const getCurrentProductIndex = productList.findIndex((product) => product?._id === getCartItem?.productId)

      if (getCurrentProductIndex === -1) {
        toast.error("Error", {
          description: "Product not found in product list.",
        })
        return
      }

      const getTotalStock = productList[getCurrentProductIndex].totalStock

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity
        if (getQuantity + 1 > getTotalStock) {
          toast.error("warning", {
            description: `Only ${getTotalStock} quantity available for this item`,
          })
          return
        }
      }
    }

    if (typeOfAction === "minus" && getCartItem?.quantity <= 1) {
      return
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity: typeOfAction === "plus" ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1,
      }),
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 w-full">
      {/* Product Image */}
      <div className="relative w-full lg:w-40  sm:w-20 h-40 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        <img
          src={cartItem?.image || "/placeholder.svg?height=80&width=80"}
          alt={cartItem?.title || "Product"}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Product Details and Controls */}
      <div className="flex-1 min-w-0 w-full">
        <h3 className="font-extrabold text-gray-900 line-clamp-2 sm:line-clamp-1">
          {typeof cartItem?.title === "string" ? cartItem?.title : "No Title"}
        </h3>
        
        <div className="flex items-center justify-between mt-2 sm:mt-1">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-10 sm:w-14 rounded-full"
              size="icon"
              disabled={cartItem?.quantity <= 1}
              onClick={() => handleQuantityUpdate(cartItem, "minus")}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="font-semibold w-6 sm:w-8 text-center">{cartItem?.quantity}</span>
            <Button
              variant="outline"
              className="h-8 w-10 sm:w-14 rounded-full"
              size="icon"
              onClick={() => handleQuantityUpdate(cartItem, "plus")}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>

          {/* Price and Delete - Shown inline on mobile, right-aligned on desktop */}
          <div className="flex items-center gap-3">
            <p className="font-semibold text-gray-900">
              ₹
              {(
                (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
                cartItem?.quantity
              ).toFixed(2)}
            </p>
            <button
              onClick={() => handleCartItemDelete(cartItem)}
              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
              aria-label="Delete item"
            >
              <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCartItemsContent
