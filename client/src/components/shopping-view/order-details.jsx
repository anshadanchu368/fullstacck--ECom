import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Calendar, MapPin, Phone, User, Package, AlertCircle, ShoppingBag, FileText } from "lucide-react"

const SHoppingOrderDetailsView = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth)

  if (!orderDetails) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p>No order details available.</p>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <Package className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <ShoppingBag className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-6"
      >
        {/* Order Status Banner */}
        <div className={`rounded-lg p-4 flex items-center gap-3 ${getStatusColor(orderDetails.orderStatus)}`}>
          {getStatusIcon(orderDetails.orderStatus)}
          <div>
            <p className="font-medium capitalize">{orderDetails.orderStatus}</p>
            <p className="text-xs">
              {orderDetails.orderStatus === "confirmed"
                ? "Your order has been confirmed and is being processed."
                : orderDetails.orderStatus === "rejected"
                ? "Your order has been rejected. Please contact support for assistance."
                : "Your order is pending confirmation."}
            </p>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium flex items-center gap-2 text-gray-700">
            <FileText className="h-4 w-4 text-primary" />
            Order Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono">{orderDetails._id?.substring(0, 8)}...</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Date:</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {formatDate(orderDetails.orderDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">₹{orderDetails.totalAmount?.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant="outline"
                className={`py-0.5 px-2 text-xs capitalize ${getStatusColor(orderDetails.orderStatus)}`}
              >
                {orderDetails.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Cart Items */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Order Items
          </h3>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {orderDetails.cartItems?.length > 0 ? (
              orderDetails.cartItems.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No items found in this order.</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Shipping Info */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Shipping Information
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p>{user.userName}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p>{orderDetails.addressInfo?.address || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p>{orderDetails.addressInfo?.city || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Pincode</p>
                  <p>{orderDetails.addressInfo?.pincode || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p>{orderDetails.addressInfo?.phone || "N/A"}</p>
                </div>
              </div>

              {orderDetails.addressInfo?.notes && (
                <div className="flex items-start gap-2 sm:col-span-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p>{orderDetails.addressInfo.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SHoppingOrderDetailsView
