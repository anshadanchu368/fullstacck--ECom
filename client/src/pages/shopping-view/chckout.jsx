
import { useState } from "react"
import Address from "./address"
import img from "../../assets/banner/banner3.jpg"
import { useDispatch, useSelector } from "react-redux"
import UserCartItemsContent from "@/components/shopping-view/cart-items-content"
import { Button } from "@/components/ui/button"
import { createNewOrder } from "@/store/shop/order-slice"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import logo from "../../assets/accounts/clapstudio.png"
import { clearCart } from "@/store/shop/cart-slice"
import { ArrowRight, CheckCircle, CreditCard, MapPin, ShieldCheck, ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"

function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shoppingCart)
  const { user } = useSelector((state) => state.auth)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, currentItem) => {
          const price = Number(currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) || 0
          return sum + price * (currentItem?.quantity || 0)
        }, 0)
      : 0

  async function handleInitiateRazorpayPayment() {
    if (!currentSelectedAddress) {
      toast.error("Please select a delivery address", {
        description: "A delivery address is required to proceed with checkout",
      })
      return
    }

    setIsProcessing(true)

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
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      totalAmount: totalCartAmount,
    }

    try {
      const res = await dispatch(createNewOrder(orderData)).unwrap()

      const isLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js")

      if (!isLoaded) {
        toast.error("Payment gateway failed to load", {
          description: "Please try again or contact support",
        })
        setIsProcessing(false)
        return
      }

      const response = await axios.get("http://localhost:5000/api/shop/order/getkey")
      const key = response.data.key

      const options = {
        key,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "CLAP STUDIO",
        description: "Payment",
        image: logo,
        order_id: res.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post("http://localhost:5000/api/shop/order/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: res.orderId,
          })

          if (verifyRes.data.success) {
            toast.success("Payment successful!", {
              description: "Your order has been placed",
            })

            // 1. Clear cart (dispatch action to empty the cart from Redux)
            dispatch(clearCart())

            // 2. Redirect to return
            navigate("/shop/account")
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: currentSelectedAddress?.phone,
        },
        theme: {
          color: "#0ea5e9", // Sky blue color
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Error during Razorpay checkout:", error)
      toast.error("Checkout failed", {
        description: "There was an error processing your payment",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col bg-gray-50 text-gray-900 min-h-screen">
      {/* Banner */}
      <div className="relative h-[180px] md:h-[220px] lg:h-[260px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-sky-900/40 z-10 flex items-center justify-center flex-col">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Checkout</h1>
          <div className="flex items-center gap-2 text-white/90 text-sm md:text-base">
            <ShoppingBag className="h-4 w-4" />
            <span>Cart</span>
            <ArrowRight className="h-3 w-3" />
            <span className="text-white font-medium">Checkout</span>
          </div>
        </div>
        <img src={img || "/placeholder.svg"} alt="Banner" className="h-full w-full object-cover object-center" />
      </div>

      {/* Checkout Steps */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center mb-1">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-gray-600">Cart</span>
            </div>
            <div className="h-0.5 flex-1 bg-gray-200 mx-2 relative">
              <div className="h-0.5 bg-sky-600 absolute left-0 top-0 w-full"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center mb-1">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-gray-600">Address</span>
            </div>
            <div className="h-0.5 flex-1 bg-gray-200 mx-2 relative">
              <div className="h-0.5 bg-sky-600 absolute left-0 top-0 w-1/2"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                <CreditCard className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-xs text-gray-600">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Layout */}
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Address */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-600" />
                <h2 className="text-lg font-bold text-sky-700">Select Delivery Address</h2>
              </div>
              <div className="p-4 md:p-6">
                {currentSelectedAddress && (
                  <div className="mb-6 bg-sky-50 p-4 rounded-lg border border-sky-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-gray-900">Selected Address</h3>
                          <p className="text-gray-700 mt-1">{currentSelectedAddress.address}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                            <span>{currentSelectedAddress.city}</span>
                            <span>PIN: {currentSelectedAddress.pincode}</span>
                            <span>Phone: {currentSelectedAddress.phone}</span>
                          </div>
                          {currentSelectedAddress.notes && (
                            <p className="mt-2 text-sm text-gray-500 italic">Note: {currentSelectedAddress.notes}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentSelectedAddress(null)}
                        className="text-xs text-sky-600 hover:text-sky-800"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
                <Address
                  setCurrenSelectedAddress={setCurrentSelectedAddress}
                  selectedAddress={currentSelectedAddress}
                />
              </div>
            </div>
          </div>

          {/* Right: Cart items and summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-4">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-sky-600" />
                <h2 className="text-lg font-bold text-sky-700">Order Summary</h2>
              </div>

              {/* Cart Items - Improved for mobile responsiveness */}
              <div className="px-4 py-2 max-h-[400px] overflow-y-auto">
                {cartItems?.items?.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {cartItems.items.map((cartItem, index) => (
                      <div key={index}>
                        <UserCartItemsContent cartItem={cartItem} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Your cart is empty</div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
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
                  onClick={handleInitiateRazorpayPayment}
                  disabled={!currentSelectedAddress || isProcessing || cartItems?.items?.length === 0}
                  className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay with Razorpay
                    </>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure payment powered by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckout
