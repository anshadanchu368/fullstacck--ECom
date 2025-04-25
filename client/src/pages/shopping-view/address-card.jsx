import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React from "react";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrenSelectedAddress,
  currentSelectedAddres, // 👈 Accept selected address as a prop
}) => {
  const isSelected = currentSelectedAddres?._id === addressInfo?._id;

  return (
    <Card
      onClick={() =>
        setCurrenSelectedAddress ? setCurrenSelectedAddress(addressInfo) : null
      }
      className={`
        cursor-pointer transition-all duration-300 ease-in-out 
        transform hover:scale-105 hover:-translate-y-1 
        ${isSelected ? "bg-black text-white" : "bg-white text-black"} 
        hover:bg-black hover:text-white
        rounded-xl border border-gray-300 shadow-sm
      `}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Button variant="secondary" onClick={(e) => {
          e.stopPropagation();
          handleEditAddress(addressInfo);
        }}>
          Edit
        </Button>
        <Button variant="destructive" onClick={(e) => {
          e.stopPropagation();
          handleDeleteAddress(addressInfo);
        }}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
