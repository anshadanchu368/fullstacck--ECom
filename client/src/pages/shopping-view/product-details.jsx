import { Button } from "@/components/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { IndianRupee } from "lucide-react";

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
          <div className="mt-5">
            <Button className="w-full">Add to Cart</Button>
          </div>
          <Separator className=" mt-5 mb-5"/>
        <div className="max-h-[300px] overflow-auto">
         <h2 className="text-xl font-bold">Reviews</h2>
         
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductsDetailsDialog;
