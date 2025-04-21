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

const initialAddressFormdata = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = ({setCurrenSelectedAddress}) => {
  const [formData, setFormData] = useState(initialAddressFormdata);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {

    event.preventDefault();

    if(addressList.length >= 3 && currentEditedID === null ){
      setFormData(initialAddressFormdata)
      toast("Success",{
        title: "You can add max 3 addresses",
        variant: "destructive"
      })
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
          toast("Success", {
           title:" Address updated successfully",
          });
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
          toast("Success", {
            title:" Address added successfully",
           });
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

  function handleEditAddress(getCurrentAddress){
    setCurrentEditedId(getCurrentAddress?._id)
    setFormData({
      ...formData,
      address:getCurrentAddress?.address,
      city:getCurrentAddress?.city,
      pincode: getCurrentAddress?.pincode,
      phone: getCurrentAddress?.phone,
      notes: getCurrentAddress?.notes
    })
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  console.log(addressList, "addresslist");
  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
              handleEditAddress={handleEditAddress}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                setCurrenSelectedAddress={setCurrenSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>{currentEditedId !== null ? "Edit Address":"Add New Address"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit ":"Add "}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
