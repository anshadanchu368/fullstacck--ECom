"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ShoppingCart } from 'lucide-react'

const tileVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

const labelVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 } },
}

const ShoppingProductTile = ({ product, handleProductDetails, handleAddToCart, isLoading }) => {
  const isOutOfStock = product?.totalStock === 0
  const isLowStock = product?.totalStock > 0 && product?.totalStock < 10
  const isOnSale = product?.salePrice > 0

  return (
    <motion.div variants={tileVariants} initial="hidden" animate="visible" whileHover={{ y: -8 }} className="w-full">
      <div className="group relative bg-white overflow-hidden">
        {/* Contemporary Cut Design Element - Top Right Diagonal Cut */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 z-0 transform rotate-45 translate-x-12 -translate-y-12"></div>

        {/* Product Image with Overlay */}
        <div
          onClick={() => handleProductDetails(product?._id)}
          className="relative cursor-pointer overflow-hidden aspect-[3/4]"
        >
          <div className="w-full h-full overflow-hidden">
            <motion.img
              src={product?.image}
              alt={product?.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

            {/* Quick View Button on Hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border-0 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  handleProductDetails(product?._id)
                }}
              >
                Quick View
              </Button>
            </div>
          </div>

          {/* Status Label */}
          {(isOutOfStock || isLowStock || isOnSale) && (
            <motion.div variants={labelVariants} initial="hidden" animate="visible" className="absolute top-4 left-0">
              <div
                className={`py-1 pl-3 pr-4 text-xs font-medium shadow-sm 
                  ${
                    isOutOfStock
                      ? "bg-gray-900 text-white"
                      : isLowStock
                        ? "bg-amber-500 text-white"
                        : "bg-teal-500 text-white"
                  }
                `}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 95% 100%, 0% 100%)"
                }}
              >
                {isOutOfStock ? "Out of Stock" : isLowStock ? `${product.totalStock} left` : "Sale"}
              </div>
            </motion.div>
          )}
        </div>

        {/* Product Info with Contemporary Cut Design */}
        <div className="relative z-10 p-4 pb-6">
          {/* Category Tag */}
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{product?.category}</span>
          </div>

          {/* Title */}
          <h2 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">{product?.title}</h2>

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-1 mb-3">{product?.description}</p>

          {/* Price Section with Contemporary Design */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {isOnSale && <span className="text-lg font-bold text-gray-900">₹{product?.salePrice}</span>}
              <span
                className={`${isOnSale ? "text-sm line-through text-gray-400" : "text-lg font-bold text-gray-900"}`}
              >
                ₹{product?.price}
              </span>
              {isOnSale && (
                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5">
                  {Math.round(((product?.price - product?.salePrice) / product?.price) * 100)}%
                </span>
              )}
            </div>

            {/* Add to Cart Button - Contemporary Style */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                onClick={() => handleAddToCart(product?._id, product?.totalStock)}
                disabled={isOutOfStock || isLoading}
                className={`rounded-none h-10 w-10 ${
                  isOutOfStock ? "bg-gray-100 text-gray-400" : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
                aria-label="Add to cart"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ShoppingProductTile
