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
import { addNewProduct, fetchAllProducts } from "@/store/admin/product-slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openCreateProuctsDialog, setOpenCreateProductsDialog] = useState();

  const [formData, setFormData] = useState(initialFormData);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const [currentEditedId, setCurrentEditedId] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    dispatch(
      addNewProduct({
        ...formData,
        image: uploadedImageUrl,
      })
    ).then((data) => {
      if(data?.payload?.success){
        dispatch(fetchAllProducts())
        setImageFile(null);
        setFormData(initialFormData)
        setOpenCreateProductsDialog(false)
        toast.success('Success', {
          description: 'The product was added to your inventory.',
        });
      }
    });
  }
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(productList, "productList");
  return (
    <>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add new Products
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
       {
        productList && productList.length > 0  ? productList.map((productItem) => <AdminProductTile key={productItem._id} setFormData={setFormData} setCurrentEditedId={setCurrentEditedId} setOpenCreateProductsDialog={setOpenCreateProductsDialog} product={productItem}/>) : null
       }

      </div>
        <Sheet
          open={openCreateProuctsDialog}
          onOpenChange={() => {
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null)
            setFormData(initialFormData);
          }}
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>Add New Product</SheetTitle>
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
                buttonText="Add"
              />
            </div>
          </SheetContent>
        </Sheet>
    </>
  );
};

export default AdminProducts;
