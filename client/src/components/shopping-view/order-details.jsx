import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const initialFormDatta = {
  status: "",
};

const SHoppingOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormDatta);
  const { user } = useSelector((state) => state.auth);

  function handleUpdateStatus(e) {
    e.preventDefault();
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
                  : "bg-gray-700"
              }`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Cart Items */}
        <div className="space-y-2">
          <p className="font-semibold text-lg">Order Items</p>
          <ul className="space-y-3 border border-gray-200 rounded-lg p-4">
            {orderDetails?.cartItems?.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center bg-slate-100 p-3 rounded-md transition hover:shadow-md hover:scale-[1.01]"
              >
                <span>
                  <strong>Title:</strong> {item.title}
                </span>
                <span>
                  <strong>Qty:</strong> {item.quantity}
                </span>
                <span>
                  <strong>Price:</strong> ₹{item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shipping Info */}
        <div className="space-y-3">
  <p className="font-semibold text-lg text-gray-800">Shipping Info</p>

  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="grid gap-3 text-sm text-gray-700">
      <div className="flex items-start gap-2">
        <span className="font-medium min-w-[80px]">Name:</span>
        <span>{user.userName}</span>
      </div>
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

      </motion.div>
    </DialogContent>
  );
};

export default SHoppingOrderDetailsView;
