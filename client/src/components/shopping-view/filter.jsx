import { filterOptions } from "@/config";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const ProductFilter = ({filters,handleFilter}) => {
  
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filter</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <div key={keyItem}>
            <h3 className="text-base font-bold capitalize">{keyItem}</h3>
            <div className="grid gap-2 mt-2">
              {filterOptions[keyItem].map((option) => (
                <Label key={option.id} className="flex items-center gap-2 font-medium">
                  <Checkbox  checked={filters[keyItem]?.includes(option.id) || false}
                   onCheckedChange={()=>handleFilter(keyItem,option.id)} />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
