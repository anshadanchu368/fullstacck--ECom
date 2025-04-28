import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import CommonForm from "../common/Form";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice/inex";
import { toast } from "sonner";

const initialFormDatta = {
  status: "",
};

const AdminOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormDatta);

  const dispatch = useDispatch();
  function handleUpdateStatus(e) {
    e.preventDefault();
    const { status } = formData;
    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormDatta);
        toast.success("Succcess","Order status Updated successfully")
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="p-6 space-y-6"
      >
        {/* Order Info */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-gray-700">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-gray-700">Order Date</p>
            <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-gray-700">Total Price</p>
            <Label>₹{orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-gray-700">Status</p>
            <Badge
              className={`py-1 px-3 text-xs capitalize ${
                orderDetails?.orderStatus === "confirmed"
                  ? "bg-green-500"
                  : orderDetails?.orderStatus === "rejected"
                  ? "bg-red-500"
                  : "bg-gray-700"
              }`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="font-semibold text-lg text-gray-800">Order Items</p>
          <div className="border border-gray-200 rounded-lg max-h-18 overflow-y-auto p-2">
            <ul className="space-y-3">
              {orderDetails?.cartItems?.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-transform hover:scale-[1.01]"
                >
                  <div className="flex-1 mb-2 sm:mb-0">
                    <span className="block text-sm text-gray-700">
                      <strong>Title:</strong> {item.title}
                    </span>
                  </div>
                  <div className="flex-1 mb-2 sm:mb-0">
                    <span className="block text-sm text-gray-700">
                      <strong>Qty:</strong> {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="block text-sm text-gray-700">
                      <strong>Price:</strong> ₹{item.price}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="space-y-3">
          <p className="font-semibold text-lg text-gray-800">Shipping Info</p>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="grid gap-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-[80px]">Address:</span>
                <span>{orderDetails?.addressInfo?.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-[80px]">City:</span>
                <span>{orderDetails?.addressInfo?.city}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-[80px]">Pincode:</span>
                <span>{orderDetails?.addressInfo?.pincode}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-[80px]">Phone:</span>
                <span>{orderDetails?.addressInfo?.phone}</span>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[80px]">Notes:</span>
                  <span>{orderDetails.addressInfo.notes}</span>
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
            buttonText={`Update Order Status`}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </motion.div>
    </DialogContent>
  );
};

export default AdminOrderDetailsView;
