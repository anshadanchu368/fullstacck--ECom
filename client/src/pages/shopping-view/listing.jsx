"use client"

import { Button } from "@/components/ui/button"
import ProductFilter from "@/components/shopping-view/filter"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { sortOptions } from "@/config"
import {
  ArrowUpDownIcon,
  ChevronLeft,
  ChevronRight,
  FilterIcon,
  GridIcon,
  LayoutIcon,
  ListIcon,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice"
import ShoppingProductTile from "./product-tile"
import { useSearchParams } from "react-router-dom"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { toast } from "sonner"
import {  AnimatePresence } from "framer-motion"
import ProductsDetailsDialog from "./product-Details"

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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalProductPages, setTotalProductPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [addingProductId, setAddingProductId] = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list") // 'grid', 'list', or 'masonry'
  const [activeCategory, setActiveCategory] = useState("All")

  const categorySearchParams = searchParams.get("category")
  const pageParam = searchParams.get("page")

  // Pagination calculations
  // const totalItems = productList?.length || 0
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = productList ? productList.slice(indexOfFirstItem, indexOfLastItem) : []

  // Mock categories for the horizontal category navigation
  const categories = ["All", "T-Shirts", "Shirts", "Jeans", "Trousers", "Jackets", "Accessories", "Footwear"]

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
    if (pageNumber < 1 || pageNumber > totalProductPages) return
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
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }))
    }
  }, [dispatch, filters, sort])

  useEffect(() => {
    if (productList) {
      const totalItems = productList.length
      const totalPages = Math.ceil(totalItems / itemsPerPage)
      setTotalProductPages(Math.ceil(totalItems / itemsPerPage))
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
        className={`${currentPage === 1 ? "bg-gray-900 text-white hover:bg-gray-800" : ""}`}
      >
        1
      </Button>,
    )

    // Calculate range of visible page buttons
    let startPage = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2))
    const endPage = Math.min(totalProductPages - 1, startPage + maxVisibleButtons - 3)

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
          className={`${currentPage === i ? "bg-gray-900 text-white hover:bg-gray-800" : ""}`}
        >
          {i}
        </Button>,
      )
    }

    // Add ellipsis before last page if needed
    if (endPage < totalProductPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>,
      )
    }

    // Always show last page if there's more than one page
    if (totalProductPages > 1) {
      buttons.push(
        <Button
          key="last"
          variant={currentPage === totalProductPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalProductPages)}
          className={`${currentPage === totalProductPages ? "bg-gray-900 text-white hover:bg-gray-800" : ""}`}
        >
          {totalProductPages}
        </Button>,
      )
    }

    return buttons
  }

  const quotes = [
    "Where fabric meets form.",
    "Elevate your everyday.",
    "Tailored for the modern you.",
    "Less but better.",
    
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Contemporary Header with Diagonal Cut */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gray-800 clip-path-diagonal"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold">Shop Collection</h1>
          <p className="mt-2 text-gray-300 max-w-2xl">
            Discover our curated selection of contemporary fashion pieces designed for the modern lifestyle.
          </p>
        </div>
      </div>

      {/* Animated Quotes Banner */}
      <div className="sticky top-0 z-30 bg-gray-900 text-white border-b border-gray-800 shadow-sm overflow-hidden">
        <div className="relative h-12 flex items-center">
        <motion.div
  className="whitespace-nowrap flex items-center absolute"
  initial={{ x: "100%", opacity: 0 }}
  animate={{ x: "-100%", opacity: 1 }}
  transition={{
    x: {
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
      duration: 20,
      ease: "linear",
      delay: 0.5, // optional: delay before scrolling starts
    },
    opacity: {
      duration: 1.5, // fade-in duration
      ease: "easeOut",
    },
  }}
>
  {[...quotes, ...quotes, ...quotes].map((quote, index) => (
    <span key={index} className="mx-8 text-sm font-medium tracking-wider uppercase">
      {quote}
    </span>
  ))}
</motion.div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Left side - Filter button and results count */}
          <div className="flex items-center gap-4 lg:hidden ">
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 border-gray-300"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Category/Apparel
            </Button>
            <span className="text-gray-500 text-sm hidden sm:inline-block">{productList?.length || 0} products</span>
          </div>

      
          {/* Right side - View mode and sort */}
          <div className="flex items-center gap-3  ">
            <div className="flex border border-gray-200 rounded-md overflow-hidden  ">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`rounded-none h-9 w-9 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              >
                <GridIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={`rounded-none h-9 w-9 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("masonry")}
                className={`rounded-none h-9 w-9 ${viewMode === "masonry" ? "bg-gray-100" : ""}`}
              >
                <LayoutIcon className="h-4 w-4" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Mobile filters drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="fixed inset-0 z-40 lg:hidden"
              >
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setMobileFiltersOpen(false)}
                ></div>
                <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <ProductFilter filters={filters} handleFilter={handleFilter} />
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop sidebar */}
          <div className="hidden lg:block sticky top-[73px] self-start h-[calc(100vh-150px)] overflow-y-auto">
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <FilterIcon className="h-5 w-5 mr-2" />
                Filters
              </h3>
              <ProductFilter filters={filters} handleFilter={handleFilter} />
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            {/* Product grid with different layout options */}
            {productList && productList.length > 0 ? (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {currentItems.map((productItem) => (
                      <ShoppingProductTile
                        key={productItem._id}
                        product={productItem}
                        handleProductDetails={handleProductDetails}
                        handleAddToCart={handleAddToCart}
                        isLoading={addingProductId === productItem._id}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6">
                    {currentItems.map((productItem) => (
                      <motion.div
                        key={productItem._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 flex flex-col sm:flex-row overflow-hidden"
                      >
                        {/* Image */}
                        <div
                          className="sm:w-1/3 md:w-1/4 relative cursor-pointer"
                          onClick={() => handleProductDetails(productItem._id)}
                        >
                          <img
                            src={productItem.image || "/placeholder.svg"}
                            alt={productItem.title}
                            className="w-full h-full object-cover aspect-[4/3] sm:aspect-auto"
                          />
                          {/* Status Label */}
                          {(productItem.totalStock === 0 ||
                            (productItem.totalStock > 0 && productItem.totalStock < 10) ||
                            productItem.salePrice > 0) && (
                            <div className="absolute top-4 left-0">
                              <div
                                className={`py-1 pl-3 pr-4 text-xs font-medium shadow-sm clip-path-status
                                  ${
                                    productItem.totalStock === 0
                                      ? "bg-gray-900 text-white"
                                      : productItem.totalStock > 0 && productItem.totalStock < 10
                                        ? "bg-amber-500 text-white"
                                        : "bg-teal-500 text-white"
                                  }
                                `}
                              >
                                {productItem.totalStock === 0
                                  ? "Out of Stock"
                                  : productItem.totalStock > 0 && productItem.totalStock < 10
                                    ? `${productItem.totalStock} left`
                                    : "Sale"}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 flex flex-col">
                          <div className="mb-2">
                            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                              {productItem.category} • {productItem.apparel}
                            </span>
                          </div>

                          <h2 className="font-bold text-xl text-gray-900 mb-2">{productItem.title}</h2>
                          <p className="text-sm text-gray-600 mb-4">{productItem.description}</p>

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-baseline gap-2">
                              {productItem.salePrice > 0 && (
                                <span className="text-xl font-bold text-gray-900">₹{productItem.salePrice}</span>
                              )}
                              <span
                                className={`${
                                  productItem.salePrice > 0
                                    ? "text-base line-through text-gray-400"
                                    : "text-xl font-bold text-gray-900"
                                }`}
                              >
                                ₹{productItem.price}
                              </span>
                              {productItem.salePrice > 0 && (
                                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1">
                                  {Math.round(((productItem.price - productItem.salePrice) / productItem.price) * 100)}%
                                  off
                                </span>
                              )}
                            </div>

                            <Button
                              onClick={() => handleAddToCart(productItem._id, productItem.totalStock)}
                              disabled={productItem.totalStock === 0 || addingProductId === productItem._id}
                              className={`${
                                productItem.totalStock === 0
                                  ? "bg-gray-100 text-gray-400"
                                  : "bg-gray-900 hover:bg-gray-800 text-white"
                              }`}
                            >
                              {addingProductId === productItem._id ? (
                                <span className="flex items-center justify-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                  Adding...
                                </span>
                              ) : productItem.totalStock === 0 ? (
                                "Unavailable"
                              ) : (
                                "Add to Cart"
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Masonry View */}
                {viewMode === "masonry" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
                    {currentItems.map((productItem) => (
                      <div
                        key={productItem._id}
                        className="break-inside-avoid"
                        style={{
                          marginBottom: "1rem",
                          height: "fit-content",
                        }}
                      >
                        <ShoppingProductTile
                          product={productItem}
                          handleProductDetails={handleProductDetails}
                          handleAddToCart={handleAddToCart}
                          isLoading={addingProductId === productItem._id}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200">
                <div className="text-center max-w-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any products matching your current filters. Try adjusting your selection or browse
                    our entire collection.
                  </p>
                  <Button
                    variant="default"
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => {
                      setFilters({})
                      sessionStorage.removeItem("filters")
                      setCurrentPage(1)
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}

            {/* Contemporary Pagination */}
            {productList && productList.length > 0 && (
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center border border-gray-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 w-10 rounded-none border-r border-gray-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>

                  <div className="flex items-center border-r border-gray-200">{renderPaginationButtons()}</div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalProductPages}
                    className="h-10 w-10 rounded-none"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
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
