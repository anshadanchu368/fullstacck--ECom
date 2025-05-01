"use client"

import CommonForm from "@/components/common/Form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addressFormControls } from "@/config";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddressCard from "./address-card";
import { toast } from "sonner";
import { MapPin, Plus } from 'lucide-react';

const initialAddressFormdata = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = ({ setCurrenSelectedAddress, selectedAddress }) => {
  const [formData, setFormData] = useState(initialAddressFormdata);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormdata);
      toast("You can add max 3 addresses", {
        variant: "destructive"
      });
      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormdata);
          toast("Address updated successfully");
        }
      });
    } else {
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          setFormData(initialAddressFormdata);
          toast("Address added successfully");
        }
      });
    }
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      pincode: getCurrentAddress?.pincode,
      phone: getCurrentAddress?.phone,
      notes: getCurrentAddress?.notes
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user?.id]);

  return (
    <div className="space-y-6">
      {/* Address List Section */}
      {addressList && addressList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your saved addresses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                handleEditAddress={handleEditAddress}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                setCurrenSelectedAddress={setCurrenSelectedAddress}
                currentSelectedAddres={selectedAddress}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Address Form */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-100 p-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            {currentEditedId !== null ? (
              <>
                <MapPin className="h-5 w-5 text-sky-600" />
                Edit Address
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-sky-600" />
                Add New Address
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId !== null ? "Update Address" : "Add Address"}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Address;
