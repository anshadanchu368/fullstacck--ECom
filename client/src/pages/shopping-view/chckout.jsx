import React, { useState } from "react";
import Address from "./address";
import img from "../../assets/banner/banner3.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsCOntent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../assets/accounts/clapstudio.png"
import { clearCart } from "@/store/shop/cart-slice"; 

function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddres, setCurrenSelectedAddress] = useState(null);
  const dispatch = useDispatch();

  console.log(currentSelectedAddres, "selected address");

  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, currentItem) => {
          const price =
            Number(
              currentItem?.salePrice > 0
                ? currentItem?.salePrice
                : currentItem?.price
            ) || 0;
          return sum + price * (currentItem?.quantity || 0);
        }, 0)
      : 0;

  async function handleInitiateRazorpayPayment() {
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddres?._id,
        address: currentSelectedAddres?.address,
        city: currentSelectedAddres?.city,
        pincode: currentSelectedAddres?.pincode,
        phone: currentSelectedAddres?.phone,
        notes: currentSelectedAddres?.notes,
      },
      totalAmount: totalCartAmount,
    };

    try {
      const res = await dispatch(createNewOrder(orderData)).unwrap();

      const isLoaded = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/shop/order/getkey"
      );
      const key = response.data.key;

      const options = {
        key,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "CLAP STUDIO",
        description: "Payment",
        image: logo,
        order_id: res.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/shop/order/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: res.orderId,
            }
          );

          if (verifyRes.data.success) {
            toast.success("success",{
              description:"Payment successful!"
            });

            // 1. Clear cart (dispatch action to empty the cart from Redux)
            dispatch(clearCart()); 

            // 2. Redirect to return
            navigate("/payment-return");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: currentSelectedAddres?.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during Razorpay checkout:", error);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="Banner"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Checkout Layout */}
      <div className="w-full px-5 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left: Address */}
        <div className="w-full lg:w-1/2">
          <Address setCurrenSelectedAddress={setCurrenSelectedAddress} />
        </div>

        {/* Right: Cart items and summary */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {cartItems?.items?.length > 0 &&
            cartItems.items.map((cartItem, index) => (
              <UserCartItemsCOntent key={index} cartItem={cartItem} />
            ))}

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>&#8377;{totalCartAmount}</span>
            </div>
            <Button
              onClick={handleInitiateRazorpayPayment}
              className="w-full mt-4"
            >
              Checkout with RazorPay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
