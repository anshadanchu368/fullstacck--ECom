import { Button } from '@/components/button'
import CommonForm from '@/components/common/Form';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { addProductFormElements } from '@/config';
import React, { useState } from 'react'


const initialFormData={
  image: null,
  title: '',
  description: '',
  Category:'',
  brand:'',
  price:'',
  salePrice:'',
  totalStock:''
}

const AdminProducts = () => {



  const [openCreateProuctsDialog,setOpenCreateProductsDialog]= useState();

  const [formData,setFormData] = useState(initialFormData)

  function onSubmit(){

  }
  return (
    <>
    <div className="mb-5 w-full flex justify-end">
    <Button onClick={()=>setOpenCreateProductsDialog(true)}>Add new Products</Button>
    </div>
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
     <Sheet open={openCreateProuctsDialog} onOpenChange={()=>{
      setOpenCreateProductsDialog(false);
     }}>
       <SheetContent side="right" className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <CommonForm onSubmit={onSubmit}formData={formData} setFormData={setFormData} formControls={addProductFormElements} buttonText="Add"/>
        </div>
       </SheetContent>
     </Sheet>
    </div>
    </>
  )
}

export default AdminProducts
