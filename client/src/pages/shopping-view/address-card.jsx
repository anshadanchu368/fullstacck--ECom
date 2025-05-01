import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, MapPin, Trash2 } from 'lucide-react';
import React from "react";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrenSelectedAddress,
  currentSelectedAddres,
}) => {
  const isSelected = currentSelectedAddres?._id === addressInfo?._id;

  return (
    <Card
      onClick={() =>
        setCurrenSelectedAddress ? setCurrenSelectedAddress(addressInfo) : null
      }
      className={`
        cursor-pointer transition-all duration-300 ease-in-out 
        border ${isSelected ? "border-sky-500 ring-2 ring-sky-200" : "border-gray-200"} 
        shadow-sm hover:shadow-md rounded-lg overflow-hidden
      `}
    >
      <div className={`h-1 w-full ${isSelected ? "bg-sky-500" : "bg-gray-100"}`}></div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <MapPin className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isSelected ? "text-sky-600" : "text-gray-400"}`} />
          <div className="space-y-2 flex-1 min-w-0">
            <p className="font-medium text-gray-900 line-clamp-1">{addressInfo?.address}</p>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
              <div className="text-gray-700">
                <span className="text-gray-500">City:</span> {addressInfo?.city}
              </div>
              <div className="text-gray-700">
                <span className="text-gray-500">PIN:</span> {addressInfo?.pincode}
              </div>
              <div className="text-gray-700 col-span-2">
                <span className="text-gray-500">Phone:</span> {addressInfo?.phone}
              </div>
              {addressInfo?.notes && (
                <div className="text-gray-600 col-span-2 italic text-xs mt-1">
                  Note: {addressInfo?.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-3 bg-gray-50 border-t border-gray-100">
        <Button 
          variant="outline" 
          size="sm"
          className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
