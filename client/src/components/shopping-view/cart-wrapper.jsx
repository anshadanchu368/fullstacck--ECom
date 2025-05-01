"use client"
import { SheetContent, SheetHeader, SheetTitle, SheetClose } from "../ui/sheet"
import { Button } from "../button"
import UserCartItemsCOntent from "./cart-items-content"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ShoppingCart, X, ShoppingBag } from "lucide-react"

const UserCartWrapper = ({ cartItems, setOpenCartSheet, isMobile = false }) => {
  const navigate = useNavigate()

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, currentItem) => {
          const price = Number(currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) || 0
          return sum + price * (currentItem?.quantity || 0)
        }, 0)
      : 0

  return (
    <SheetContent
      side={isMobile ? "bottom" : "right"}
      className={`${isMobile ? "h-[85vh] rounded-t-3xl p-0" : "sm:max-w-md p-4"}`}
    >
      {/* Pull indicator for mobile */}
      {isMobile && <div className="h-1.5 w-12 bg-muted rounded-full mx-auto my-3"></div>}

      {/* Restructuring layout for better mobile scrolling */}
      <div className={`${isMobile ? "px-6 flex  flex-col h-[calc(100%-24px)]" : ""}`}>
        <SheetHeader className={`${isMobile ? "flex-row items-center justify-between mb-4 " : ""}`}>
          <SheetTitle className="flex items-center gap-2">
            {isMobile && <ShoppingCart className="h-5 w-5" />}
            Your Cart
          </SheetTitle>
      
        </SheetHeader>

        {/* Flex container with auto height for scrollable content */}
        <div className={`flex flex-col ${isMobile ? "flex-1 overflow-y-auto " : ""}`}>
          {/* Scrollable items container */}
          <div
            className={`
              flex flex-col space-y-4 
              ${isMobile ? "mt-2 flex-1 overflow-y-auto" : "mt-8 max-h-[60vh] overflow-y-auto"} 
              pr-2 custom-scrollbar
            `}
          >
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item) => <UserCartItemsCOntent key={item.productId} cartItem={item} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <p className="text-muted-foreground mb-2">Your cart is empty</p>
                <Button
                  variant="link"
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

          {/* Fixed footer area with total and checkout button */}
          <div className={`${isMobile ? "mt-auto pt-4" : ""}`}>
            {cartItems && cartItems.length > 0 && (
              <div className="mt-4 space-y-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">₹{totalCartAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

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
              className="w-full mt-6 mb-8"
              size={isMobile ? "lg" : "default"}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  )
}

export default UserCartWrapper