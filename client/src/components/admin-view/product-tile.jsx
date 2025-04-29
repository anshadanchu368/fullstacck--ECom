import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../button";

const AdminProductTile = ({
  product,
  setCurrentEditedId,
  setOpenCreateProductsDialog,
  setFormData,
  HandleDelete,
}) => {
  return (
    <Card className="w-full max-w-sm mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-64 object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h2 className="text-2xl font-semibold mb-2 truncate">{product?.title}</h2>
        <div className="flex justify-between items-center">
          <span
            className={`text-lg font-semibold ${
              product.salePrice > 0 ? "line-through text-gray-500" : "text-primary"
            }`}
          >
            ₹{product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-lg font-bold text-black">₹{product?.salePrice}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 border-t">
        <Button
          variant="outline"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => HandleDelete(product._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminProductTile;
