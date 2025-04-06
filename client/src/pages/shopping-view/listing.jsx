import { Button } from "@/components/button";
import ProductFilter from "@/components/shopping-view/filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "./product-tile";

const ShoppingList = () => {
  const dispatch = useDispatch();

  const { productList } = useSelector((state) => state.shoppingProducts);
  console.log(productList)

  const  [filters, setFilters] =useState({})
  const  [sort,setSort] =useState(null)

  function handleSort(value){
      console.log(value)
      setSort(value)
  }

 function handleFilter(getSectionId,getCurrentOption)
 { 
   console.log(getSectionId,getCurrentOption)
  let copyFilters = {...filters};
  const indexofCurrentSection = Object.keys(copyFilters).indexOf(getSectionId);

  if(indexofCurrentSection === -1){
    copyFilters ={
      ...copyFilters,
      [getSectionId]:[getCurrentOption]
    }
  }else{
     const indexofCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOption)

     if(indexofCurrentOption === -1){
      copyFilters[getSectionId].push(getCurrentOption)
     }  else{
      copyFilters[getSectionId].splice(indexofCurrentOption,1)
     } 
  }
   
  setFilters(copyFilters)
  console.log(copyFilters);
  sessionStorage.setItem('filters',JSON.stringify(copyFilters))

 }


 useEffect(()=>{
  const savedFilters = JSON.parse(sessionStorage.getItem('filters')) || {};
  setFilters(savedFilters);
  setSort("price-lowtohigh");
 },[])

 useEffect(() => {
  if (sort !== null) {
    dispatch(fetchAllFilteredProducts({ filters, sort }));
  }
}, [dispatch, filters, sort]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 md:p-6">
      <ProductFilter filters={filters}  handleFilter={handleFilter}/>
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b  flex items-center justify-between">
          <h2 className="text-lg font-extrabold ">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
            No of Products :  {productList?.length}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 "
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] list-disc list-inside"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                      className="list-disc list-inside"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  product={productItem}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
