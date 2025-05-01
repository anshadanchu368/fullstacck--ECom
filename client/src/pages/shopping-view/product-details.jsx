import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { IndianRupee, StarIcon } from "lucide-react";

import { Button } from "@/components/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import StarRatingComponent from "@/components/common/star-rating";

import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";

const fadeSlide = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function ProductsDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const dispatch = useDispatch();
  const isOutOfStock = productDetails?.totalStock === 0;

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(productId, totalStock) {
    const getCartItems = cartItems.items || [];
    const existingItem = getCartItems.find(
      (item) => item.productId === productId
    );
    const currentQty = existingItem?.quantity || 0;

    if (currentQty + 1 > totalStock) {
      toast.error(`Only ${totalStock} in stock`, {
        description: "Please adjust your quantity.",
      });
      return;
    }

    if (isOutOfStock) return;

    dispatch(
      addToCart({
        userId: user?.id,
        productId,
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload?.success) {
        dispatch(getReviews(productDetails?._id));
        toast.success("Review added successfully");
        setReviewMsg("");
        setRating(0);
      } else {
        toast.error("Cannot submit review again", {
          description: data.payload?.message || "You have already reviewed this product.",
        });
      }
    });
  }
  

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [dispatch, productDetails]);

  const averageReview = reviews && reviews.length > 0 ?
  reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
  reviews.length : 0



  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="w-full max-w-[98vw] lg:max-w-[95vw] xl:max-w-[90vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          {productDetails && (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Image */}
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeSlide}
                className="flex-1 w-full max-w-md mx-auto md:mx-0"
              >
                <motion.img
                  src={productDetails?.image}
                  alt={productDetails?.title}
                  width={600}
                  height={600}
                  className="w-full h-auto rounded-lg object-cover aspect-square max-h-[400px] sm:max-h-[500px]"
                />
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeSlide}
                className="flex-1 space-y-4"
              >
                <DialogTitle className="text-2xl sm:text-3xl font-extrabold">
                  {productDetails?.title}
                  <p className="text-muted-foreground text-base sm:text-lg mt-1">
                    {productDetails?.description}
                  </p>
                </DialogTitle>

                <div className="flex items-center justify-between">
                  <p
                    className={`text-xl sm:text-3xl font-bold ${
                      productDetails?.salePrice > 0
                        ? "line-through text-gray-400"
                        : "text-primary"
                    }`}
                  >
                    ₹{productDetails?.price}
                  </p>
                  {productDetails?.salePrice > 0 && (
                    <p className="text-xl sm:text-2xl font-bold text-black/60 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {productDetails?.salePrice}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                    <StarRatingComponent rating={averageReview}/>
                  <span className="text-sm text-muted-foreground">{averageReview.toFixed(1)}</span>
                </div>

                <Button
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                  className="w-full mt-4"
                  disabled={isOutOfStock}
                  variant={isOutOfStock ? "secondary" : "default"}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>

                <Separator className="my-6" />

                {/* Reviews */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-4">Reviews</h2>

                  <div className="grid gap-4">
                    {reviews && reviews.length > 0 ? (
                      reviews.map((reviewItem, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <Avatar className="w-10 h-10 border">
                            <AvatarFallback>
                              {reviewItem?.userName?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <h3 className="font-bold text-sm sm:text-base">
                              {reviewItem?.userName}
                            </h3>
                            <div className="flex gap-1">
                              <StarRatingComponent
                                rating={reviewItem?.reviewValue}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {reviewItem?.reviewMessage}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No Reviews</p>
                    )}
                  </div>
                </div>

                {/* Review Form */}
                <div className="mt-6 flex flex-col gap-3">
                  <Input
                    placeholder="Write a review"
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                  />
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === "" || rating === 0}
                  >
                    Submit
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export default ProductsDetailsDialog;
