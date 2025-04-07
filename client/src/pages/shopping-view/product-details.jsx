import { Button } from "@/components/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IndianRupee, StarIcon, StarsIcon } from "lucide-react";

function ProductsDetailsDialog({ open, setOpen, productDetails }) {
    
      
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div className="text-3xl font-extrabold">
            {productDetails?.title}
            <p className="text-muted-foreground text-lg">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`${
                productDetails?.salePrice > 0 ? "line-through" : ""
              } text-3xl font-bold text-primary`}
            >
              {productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-black/60 w-40 flex items-center justify-end">
                <IndianRupee className="mt-1" />{productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center hap-2 mt-2">
          <div className="flex items-center gap-0 5">
                        <StarIcon className="w-5 h-5 fill-primary"/>
                        <StarIcon className="w-5 h-5 fill-primary"/>
                        <StarIcon className="w-5 h-5 fill-primary"/>
                        <StarIcon className="w-5 h-5 fill-primary"/>
                        <StarIcon className="w-5 h-5 fill-primary"/>
                    </div>
                    <span className="text-muted-foreground"> 4.5</span>
          </div>
          <div className="mt-5 mb-5">
            <Button className="w-full">Add to Cart</Button>
          </div>
          <Separator className=" mt-5 mb-5"/>
        <div className="max-h-[300px] overflow-auto">
         <h2 className="text-xl font-bold">Reviews</h2>
         <div className="grid gap-6">
              <div className="flex gap-4">
                   <Avatar className ="w-10 h-10 border">
                         <AvatarFallback>SM</AvatarFallback>
                   </Avatar>
                   <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold">Sangam Mukherjee</h3>
                    </div>
                    <div className="flex items-center gap-0 5">
                        <StarIcon className="w-5 h-5 fill-primary"/>
                        <StarIcon className="w-5 h-5 fill-primary"/>
                        <StarIcon className="w-5 h-5 fill-primary"/>
                        <StarIcon className="w-5 h-5 fill-primary"/>
                        <StarIcon className="w-5 h-5 fill-primary"/>
                    </div>
                    <p className="text-muted-foreground">This is an awesome product</p>
                   </div>
              </div>
         </div>
          <div className="mt-6 flex gap-2">
            <Input placeholder="Write a review"/>
            <Button>Submit</Button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductsDetailsDialog;
