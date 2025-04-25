import { Button } from "@/components/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import React from "react";
import { motion } from "framer-motion";

const tileVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const badgeVariant = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.3 },
  },
};

const ShoppingProductTile = ({ product, handleProductDetails, handleAddToCart }) => {
  return (
    <motion.div
      variants={tileVariant}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.015 }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="overflow-hidden shadow-md hover:shadow-xl transition duration-300">
        <div onClick={() => handleProductDetails(product?._id)} className="cursor-pointer">
          <div className="relative overflow-hidden group">
            <motion.img
              src={product?.image}
              alt={product?.title}
              className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product?.salePrice > 0 && (
              <motion.div
                variants={badgeVariant}
                initial="hidden"
                animate="visible"
                className="absolute top-2 left-2"
              >
                <Badge className="bg-red-500 hover:bg-red-700">Sale</Badge>
              </motion.div>
            )}
          </div>

          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-bold line-clamp-2">{product?.title}</h2>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{categoryOptionsMap[product?.category]}</span>
              <span>{brandOptionsMap[product?.brand]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-lg font-semibold ${
                  product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
                }`}
              >
                ₹{product?.price}
              </span>
              {product?.salePrice > 0 && (
                <span className="text-lg font-bold text-primary">
                  ₹{product?.salePrice}
                </span>
              )}
            </div>
          </CardContent>
        </div>

        <CardFooter>
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="w-full">
            <Button
              onClick={() => handleAddToCart(product?._id)}
              className="w-full transition-all"
            >
              Add to Cart
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ShoppingProductTile;
