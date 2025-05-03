
import { useState, useEffect } from "react"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { useDispatch } from "react-redux"
import CommonForm from "../common/Form"
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "@/store/admin/order-slice/inex" // Fixed import path
import { toast } from "sonner"
import { Copy } from "lucide-react"
import { Button } from "../ui/button"

const initialFormData = {
  status: "",
}

const AdminOrderDetailsView = ({ orderData }) => {
  const [formData, setFormData] = useState(initialFormData)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log("Received orderData:", orderData)
  }, [orderData])

  function handleUpdateStatus(e) {
    e.preventDefault()
    const { status } = formData

    console.log("Updating order with status:", status)
    if (!status) {
      toast.error("Please select a valid status")
      return
    }

    dispatch(updateOrderStatus({ id: orderData?._id, orderStatus: status }))
      .then((result) => {
        if (result.payload && !result.error) {
          dispatch(getOrderDetailsForAdmin(orderData?._id))
          dispatch(getAllOrdersForAdmin())
          setFormData(initialFormData)
          toast.success("Order status updated successfully")
        } else {
          toast.error("Failed to update order status")
        }
      })
      .catch((err) => {
        console.error("Error updating status:", err)
        toast.error("An error occurred while updating the order")
      })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderData?._id)
    toast.success("Order ID copied to clipboard")
  }

  if (!orderData) {
    return (
      <div className="p-4 text-center">
        <p>No order details available</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[70vh]">
      {/* Order Info */}
      <div className="space-y-3 mt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="font-semibold text-sm text-gray-700">Order ID</p>
          <div className="flex items-center gap-2">
            <Label className="break-all text-sm">{orderData?._id}</Label>
            <Button size="icon" variant="outline" className="h-6 w-6" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="font-semibold text-sm text-gray-700">Order Date</p>
          <Label>{new Date(orderData?.orderDate).toLocaleDateString()}</Label>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="font-semibold text-sm text-gray-700">Total Price</p>
          <Label>₹{orderData?.totalAmount?.toFixed(2)}</Label>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="font-semibold text-sm text-gray-700">Status</p>
          <Badge
            className={`py-1 px-3 text-xs capitalize ${
              orderData?.orderStatus === "confirmed"
                ? "bg-green-100 text-green-800 border-green-300"
                : orderData?.orderStatus === "rejected"
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
            }`}
          >
            {orderData?.orderStatus}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <p className="font-semibold text-lg text-gray-800">Order Items</p>
        <div className="border border-gray-200 rounded-lg p-2 max-h-[30vh] overflow-y-auto">
          <ul className="space-y-3">
            {orderData?.cartItems?.map((item, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-50 p-4 rounded-lg shadow-sm"
              >
                <span className="block text-sm text-gray-700">
                  <strong>Title:</strong> {item.title}
                </span>
                <span className="block text-sm text-gray-700">
                  <strong>Qty:</strong> {item.quantity}
                </span>
                <span className="block text-sm text-gray-700">
                  <strong>Price:</strong> ₹{item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-800">Shipping Info</p>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="grid gap-3 text-sm text-gray-700">
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-medium min-w-[80px]">Address:</span>
              <span>{orderData?.addressInfo?.address}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-medium min-w-[80px]">City:</span>
              <span>{orderData?.addressInfo?.city}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-medium min-w-[80px]">Pincode:</span>
              <span>{orderData?.addressInfo?.pincode}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="font-medium min-w-[80px]">Phone:</span>
              <span>{orderData?.addressInfo?.phone}</span>
            </div>
            {orderData?.addressInfo?.notes && (
              <div className="flex flex-col sm:flex-row gap-2">
                <span className="font-medium min-w-[80px]">Notes:</span>
                <span>{orderData.addressInfo.notes}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Status Form */}
      <div>
        <CommonForm
          formControls={[
            {
              label: "Order status",
              name: "status",
              componentType: "select",
              options: [
                { id: "pending", label: "Pending" },
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "delivered", label: "Delivered" },
                { id: "rejected", label: "Rejected" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText="Update Order Status"
          onSubmit={handleUpdateStatus}
        />
      </div>
    </div>
  )
}

export default AdminOrderDetailsView