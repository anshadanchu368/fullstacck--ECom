import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import ShoppingProductTile from "./product-tile";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductsDetailsDialog from "./ProductsDetailsDialog";

const SearchProducts = () => {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shoppingProducts);
  const { cartItems } = useSelector((state) => state.shoppingCart);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    if (keyword && keyword.trim().length > 3) {
      const timeout = setTimeout(() => {
        setSearchParams({ keyword });
        dispatch(getSearchResults(keyword));
      }, 800);

      return () => clearTimeout(timeout);
    } else {
      setSearchParams({ keyword });
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  const handleAddToCart = (productId, totalStock) => {
    if (addingProductId) return;

    setAddingProductId(productId);

    const currentCartItems = cartItems.items || [];
    const existingItem = currentCartItems.find((item) => item.productId === productId);

    if (existingItem) {
      if (existingItem.quantity + 1 > totalStock) {
        toast.error(`Only ${totalStock} items are available in stock`, {
          description: "You cannot add more than available stock.",
        });
        setAddingProductId(null);
        return;
      }
    } else {
      if (totalStock < 1) {
        toast.error("This product is out of stock.", {
          description: "Cannot add this product to cart.",
        });
        setAddingProductId(null);
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    )
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success("Success", {
            description: "The product was added to your inventory.",
          });
        }
      })
      .finally(() => {
        setAddingProductId(null);
      });
  };

  const handleProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-10">
        <div className="w-full max-w-2xl">
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="py-4 px-6 rounded-xl border border-gray-300 dark:border-zinc-700 shadow-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
            placeholder="🔍 Search for products..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-xl"
            />
          ))}
        </div>
      ) : searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item._id}
              product={item}
              handleAddToCart={() => handleAddToCart(item._id, item.totalStock)}
              handleProductDetails={() => handleProductDetails(item._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-16 text-zinc-600 dark:text-zinc-400">
          <h2 className="text-2xl font-semibold mb-2">No results found</h2>
          <p className="text-sm">Try searching for something else.</p>
        </div>
      )}

      <ProductsDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
        handleProductDetails={handleProductDetails}
      />
    </div>
  );
};

export default SearchProducts;
