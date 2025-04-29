import { Button } from "@/components/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import React from "react";
import { motion } from "framer-motion";

const tileVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const labelVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 } },
};

const ShoppingProductTile = ({ product, handleProductDetails, handleAddToCart }) => {
  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;
  const isOnSale = product?.salePrice > 0;

  return (
    <motion.div
      variants={tileVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      className="w-full max-w-xs mx-auto"
    >
      <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition duration-300 bg-white">
        {/* Product Image */}
        <div
          onClick={() => handleProductDetails(product?._id)}
          className="cursor-pointer relative group"
        >
          <motion.img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[280px] object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Custom Status Label */}
          {(isOutOfStock || isLowStock || isOnSale) && (
            <motion.div
              variants={labelVariants}
              initial="hidden"
              animate="visible"
              className="absolute top-4 left-4"
            >
              <div
                className={`px-3 py-1 text-xs font-bold rounded-full shadow-md 
                  ${isOutOfStock
                    ? "bg-red-100 text-red-700"
                    : isLowStock
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                  }
                `}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                  ? `Only ${product.totalStock} left`
                  : "Sale"}
              </div>
            </motion.div>
          )}
        </div>

        {/* Product Details */}
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-bold line-clamp-2">{product?.title}</h2>

          {/* Category and Brand */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{categoryOptionsMap[product?.category]}</span>
            <span>{brandOptionsMap[product?.brand]}</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xl font-semibold ${
                isOnSale ? "line-through text-gray-400" : "text-primary"
              }`}
            >
              ₹{product?.price}
            </span>
            {isOnSale && (
              <span className="text-xl font-bold text-primary">
                ₹{product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>

        {/* Add to Cart Button */}
        <CardFooter>
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="w-full">
            <Button
              onClick={() => handleAddToCart(product?._id, product?.totalStock)}
              className="w-full text-base font-semibold"
              disabled={isOutOfStock}
              variant={isOutOfStock ? "secondary" : "default"}
            >
              {isOutOfStock ? "Unavailable" : "Add to Cart"}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ShoppingProductTile;
