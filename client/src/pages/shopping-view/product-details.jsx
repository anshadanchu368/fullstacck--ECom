import { Button } from "@/components/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { IndianRupee, StarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const fadeSlide = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function ProductsDetailsDialog({ open, setOpen, productDetails }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const dispatch = useDispatch();

  const isOutOfStock = productDetails?.totalStock === 0;

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} can be added for this item`, {
            description: "Please adjust your quantity.",
          });
          return;
        }
      }
    }
    if (isOutOfStock) return;
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Success", {
          description: "The product was added to your inventory.",
        });
      }
    });
  }

  function handleDialogCLose() {
    setOpen(false);
    dispatch(setProductDetails());
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogCLose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <AnimatePresence mode="wait">
          {productDetails && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeSlide}
                className="relative overflow-hidden rounded-lg"
              >
                <motion.img
                  src={productDetails?.image}
                  alt={productDetails?.title}
                  width={600}
                  height={600}
                  className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeSlide}
                className="space-y-4"
              >
                <DialogTitle className="text-3xl font-extrabold">
                  {productDetails?.title}
                  <p className="text-muted-foreground text-lg font-medium mt-1">
                    {productDetails?.description}
                  </p>
                </DialogTitle>

                <div className="flex items-center justify-between">
                  <p
                    className={`${
                      productDetails?.salePrice > 0
                        ? "line-through text-gray-400"
                        : "text-primary"
                    } text-3xl font-bold`}
                  >
                    ₹{productDetails?.price}
                  </p>
                  {productDetails?.salePrice > 0 && (
                    <p className="text-2xl font-bold text-black/60 flex items-center gap-1">
                      <IndianRupee className="mt-1 w-4 h-4" />
                      {productDetails?.salePrice}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, idx) => (
                    <StarIcon key={idx} className="w-5 h-5 fill-primary" />
                  ))}
                  <span className="text-muted-foreground text-sm">4.5</span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                    className="w-full mt-5"
                    disabled={isOutOfStock}
                    variant={isOutOfStock ? "secondary" : "default"}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </motion.div>

                <Separator className="mt-5 mb-5" />

                <h2 className="text-xl font-bold mb-3">Reviews</h2>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Hashim Anshad</h3>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 fill-primary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        This is an awesome product.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Input placeholder="Write a review" />
                  <Button>Submit</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export default ProductsDetailsDialog;
