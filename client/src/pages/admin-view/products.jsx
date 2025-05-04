import { Button } from "@/components/button";
import CommonForm from "@/components/common/Form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import React, { useEffect, useState } from "react";
import ProductImageUpload from "./image-upload";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/product-slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";

const initialFormData = {
  image: "",
  title: "",
  description: "",
  category: "",
  apparel: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  // Sync uploadedImageUrl with formData.image
  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData(prev => ({
        ...prev,
        image: uploadedImageUrl
      }));
    }
  }, [uploadedImageUrl]);

  // Fetch all products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Reset form state
  function resetForm() {
    setFormData({...initialFormData});
    setImageFile(null);
    setUploadedImageUrl("");
    setCurrentEditedId(null);
  }

  // Handle form submission
  function onSubmit(e) {
    e.preventDefault();

    if (currentEditedId !== null) {
      // Edit existing product
      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          resetForm();
          toast.success("Success", {
            description: "The product was updated successfully.",
          });
        }
      });
    } else {
      // Add new product
      dispatch(
        addNewProduct({
          ...formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          resetForm();
          toast.success("Success", {
            description: "The product was added to your inventory.",
          });
        }
      });
    }
  }

  // Handle product deletion
  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success("Success", {
          description: "The product was deleted successfully.",
        });
      }
    });
  }

  return (
    <>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => {
          resetForm();
          setOpenCreateProductsDialog(true);
        }}>
          Add New Product
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0 ? (
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setFormData={setFormData}
              setCurrentEditedId={setCurrentEditedId}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              product={productItem}
              HandleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No products found. Add your first product!
          </div>
        )}
      </div>
      
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          setOpenCreateProductsDialog(open);
          if (!open) resetForm();
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText={currentEditedId !== null ? "Save Changes" : "Add Product"}
              isBtnDisabled={imageLoadingState}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminProducts;