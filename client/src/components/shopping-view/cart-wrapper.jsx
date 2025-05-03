"use client"

import { useEffect, useRef, useState } from "react"
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { Button } from "../ui/button"
import UserCartItemsContent from "./cart-items-content"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ShoppingBag, CreditCard, ShieldCheck } from "lucide-react"
import { Separator } from "../ui/separator"

const UserCartWrapper = ({ cartItems, setOpenCartSheet, isMobile = false }) => {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  
  // Reset scroll position and set visibility when component mounts or cart items change
  useEffect(() => {
    // Short delay to ensure the component is fully rendered
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
        setIsVisible(true)
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [cartItems])

  // Calculate total cart amount
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, item) => {
          const price = Number(item?.salePrice > 0 ? item?.salePrice : item?.price) || 0
          return sum + price * (item?.quantity || 0)
        }, 0)
      : 0

  // Reset cart scroll when opened
  useEffect(() => {
    const resetCartScroll = () => {
      if (scrollContainerRef.current) {
        // Force scroll reset
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        }, 50);
      }
    };

    // Run once on mount
    resetCartScroll();
    
    // Add event listener for sheet open events (if available through your UI framework)
    document.addEventListener('sheetopen', resetCartScroll);
    
    return () => {
      document.removeEventListener('sheetopen', resetCartScroll);
    };
  }, []);

  return (
    <SheetContent
      side={isMobile ? "bottom" : "right"}
      className={`${isMobile ? "h-[85vh] rounded-t-2xl pt-2" : "sm:max-w-md"} flex flex-col bg-white`}
      onOpenAutoFocus={() => {
        // Force scroll container to reset when sheet opens
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }}
    >
      {isMobile && <div className="h-1 w-10 bg-gray-300 rounded-full mx-auto my-2"></div>}

      <div className="flex flex-col h-full">
        {/* Header section */}
        <SheetHeader className="px-4 py-3 border-b border-gray-100">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-sky-700">
            <ShoppingBag className="h-5 w-5 text-sky-600" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable content area - FIXED IMPLEMENTATION */}
        <div 
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto py-2 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: '-ms-autohiding-scrollbar',
            willChange: 'scroll-position' // Hint to browser that scrolling will change
          }}
        >
          {cartItems && cartItems.length > 0 ? (
            <div className="px-4">
              {cartItems.map((item) => (
                <div key={item.productId}>
                  <UserCartItemsContent cartItem={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">Your cart is empty</p>
              <Button
                variant="outline"
                className="mt-2 text-sky-600 border-sky-600 hover:bg-sky-50"
                onClick={() => {
                  setOpenCartSheet(false)
                  navigate("/shop/products")
                }}
              >
                Continue shopping
              </Button>
            </div>
          )}
        </div>

        {/* Footer section */}
        {cartItems && cartItems.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{totalCartAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>Included</span>
              </div>
            </div>

            <Separator className="my-3 bg-gray-200" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-sky-700">₹{totalCartAmount.toFixed(2)}</span>
            </div>

            <Button
              onClick={() => {
                if (cartItems?.length > 0) {
                  navigate("/shop/checkout")
                  setOpenCartSheet(false)
                } else {
                  toast.error("Your cart is empty!", {
                    description: "Add some items before proceeding to checkout.",
                  })
                }
              }}
              className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white transition-all duration-200 flex items-center justify-center gap-2"
              size={isMobile ? "lg" : "default"}
            >
              <CreditCard className="h-4 w-4" />
              Checkout
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 " />
              <span>Secure checkout with Razorpay</span>
            </div>
          </div>
        )}
      </div>
    </SheetContent>
  )
}

export default UserCartWrapper