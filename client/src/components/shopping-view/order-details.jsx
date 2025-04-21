import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/Form'

const initialFormDatta= {
    status: ""
}

const SHoppingOrderDetailsView = () => {

    const [formData,setFormData] =useState(initialFormDatta)

    function handleUpdateStatus(e){
        e.preventDefault(e)
    }
  return (
    <DialogContent className="sm:max-w-[600px] ">
         <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="flex  mt-6 items-center justify-between">
                    <p className="font-medium">Order ID</p>
                    <Label>123445</Label>
                </div>
                <div className="flex  mt-2 items-center justify-between">
                    <p className="font-medium">Order Date</p>
                    <Label>23/3/2012</Label>
                </div>
                <div className="flex  mt-2 items-center justify-between">
                    <p className="font-medium">Order Price</p>
                    <Label>500</Label>
                </div>
                <div className="flex  mt-2 items-center justify-between">
                    <p className="font-medium">Order Status</p>
                    <Label>In Progress</Label>
                </div>
            </div>
            <Separator/>
            <div className="grid gap-4">
                 <div className="grid gap-2">
                    <div className="font-medium">Order Details</div>
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                             <span>Product One</span>
                             <span>2345</span>
                        </li>
                    </ul>
                 </div>
            </div>
            <div className="grid gap-4">
            <div className="grid gap-2">
                    <div className="font-medium">Shipping Info</div>
                     <div className="grid gap-0.5 text-muted-foreground">
                         <span>Name</span>
                         <span>Address</span>
                         <span>City</span>
                         <span>Pincode</span>
                         <span>Phone</span>
                         <span>notes</span>
                     </div>
                 </div>
            </div>
           
         </div>
    </DialogContent>
  )
}

export default SHoppingOrderDetailsView
