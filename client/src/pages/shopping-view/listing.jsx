
import { Button } from "@/components/button"
import ProductFilter from "@/components/shopping-view/filter"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { sortOptions } from "@/config"
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { ArrowUpDownIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice"
import ShoppingProductTile from "./product-tile"
import { useSearchParams } from "react-router-dom"
import ProductsDetailsDialog from "./product-Details"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { toast } from "sonner"

function createSearchParamsHelper(filterParams) {
  const queryParams = []
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",")

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
    }
  }
  return queryParams.join("&")
}

const ShoppingList = () => {
  const dispatch = useDispatch()

  const { productList, productDetails } = useSelector((state) => state.shoppingProducts)

  const { cartItems } = useSelector((state) => state.shoppingCart)

  const { user } = useSelector((state) => state.auth)

  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalPages, setTotalPages] = useState(1)

  const [searchParams, setSearchParams] = useSearchParams()
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)

  const [addingProductId, setAddingProductId] = useState(null)

  const categorySearchParams = searchParams.get("category")
  const pageParam = searchParams.get("page")

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = productList ? productList.slice(indexOfFirstItem, indexOfLastItem) : []

  function handleSort(value) {
    setSort(value)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let copyFilters = { ...filters }
    const indexofCurrentSection = Object.keys(copyFilters).indexOf(getSectionId)

    if (indexofCurrentSection === -1) {
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption],
      }
    } else {
      const indexofCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOption)

      if (indexofCurrentOption === -1) {
        copyFilters[getSectionId].push(getCurrentOption)
      } else {
        copyFilters[getSectionId].splice(indexofCurrentOption, 1)
      }
    }

    setFilters(copyFilters)
    sessionStorage.setItem("filters", JSON.stringify(copyFilters))
    setCurrentPage(1) // Reset to first page when filters change
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (addingProductId) return // Prevent multiple clicks

    setAddingProductId(getCurrentProductId) // Start loading

    const getCartItems = cartItems.items || []

    const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductId)

    if (indexOfCurrentItem > -1) {
      const currentQuantity = getCartItems[indexOfCurrentItem].quantity

      // Check if adding one more exceeds available stock
      if (currentQuantity + 1 > getTotalStock) {
        toast.error(`Only ${getTotalStock} items are available in stock`, {
          description: "You cannot add more than available stock.",
        })
        setAddingProductId(null)
        return
      }
    } else {
      // If item not in cart yet, check if totalStock is even 1 or 0
      if (getTotalStock < 1) {
        toast.error("This product is out of stock.", {
          description: "Cannot add this product to cart.",
        })
        setAddingProductId(null)
        return
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    )
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id))
          toast.success("Success", {
            description: "The product was added to your inventory.",
          })
        }
      })
      .finally(() => {
        setAddingProductId(null)
      })
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    setCurrentPage(pageNumber)

    // Update URL with page number
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    setSearchParams(params)
  }

  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {}
    setFilters(savedFilters)
    setSort("price-lowtohigh")

    // Set page from URL or default to 1
    if (pageParam) {
      setCurrentPage(Number.parseInt(pageParam, 10))
    } else {
      setCurrentPage(1)
    }
  }, [categorySearchParams, pageParam])

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters)
      const params = new URLSearchParams(createQueryString)
      params.set("page", currentPage.toString())
      setSearchParams(params)
    } else {
      const params = new URLSearchParams()
      params.set("page", currentPage.toString())
      setSearchParams(params)
    }
  }, [filters, currentPage])

  useEffect(() => {
    if (filters !== null && sort !== null) {
 
      console.log("Dispatching filters:", filters)
      console.log("Dispatching sort:", sort)
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }))

     
    }
  }, [dispatch, filters, sort])

  useEffect(() => {
    if (productList) {
      setTotalPages(Math.ceil(productList.length / itemsPerPage))
    }
  }, [productList, itemsPerPage])

  function handleProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true)
  }, [productDetails])

  // Adjust items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(6)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8)
      } else {
        setItemsPerPage(12)
      }
    }

    handleResize() // Set initial value
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisibleButtons = 5

    // Always show first page
    buttons.push(
      <Button
        key="first"
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(1)}
        className={currentPage === 1 ? "bg-primary text-primary-foreground" : ""}
      >
        1
      </Button>,
    )

    // Calculate range of visible page buttons
    let startPage = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisibleButtons - 3)

    if (endPage - startPage < maxVisibleButtons - 3) {
      startPage = Math.max(2, endPage - (maxVisibleButtons - 3) + 1)
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis1" className="px-2">
          ...
        </span>,
      )
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "bg-primary text-primary-foreground" : ""}
        >
          {i}
        </Button>,
      )
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key="last"
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? "bg-primary text-primary-foreground" : ""}
        >
          {totalPages}
        </Button>,
      )
    }

    return buttons
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 md:p-6">
      <div className="md:sticky md:top-20 md:self-start">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </div>
      <div className="bg-background w-full rounded-lg shadow-sm border border-border/40">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <span className="text-muted-foreground text-sm">{productList?.length || 0} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product grid with loading state */}
        <div className="p-4">
          {productList && productList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentItems.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  product={productItem}
                  handleProductDetails={handleProductDetails}
                  handleAddToCart={() => handleAddToCart(productItem._id, productItem.totalStock)}
                  isLoading={addingProductId === productItem._id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No products found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilters({})
                  sessionStorage.removeItem("filters")
                  setCurrentPage(1)
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {productList && productList.length > 0 && (
          <div className="flex items-center justify-center gap-1 p-4 border-t">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            <div className="flex items-center">{renderPaginationButtons()}</div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
      </div>

      <ProductsDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
      />
    </div>
  )
}

export default ShoppingList
