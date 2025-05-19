import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import logoo from "../../assets/accounts/clapstudio.png";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Shirt,
  ShirtIcon,
  WatchIcon,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronFirst,
  ChevronLast,
  Footprints,
} from "lucide-react";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ShoppingProductTile from "./product-tile";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getFeatureImage } from "@/store/common-slice";
import ImageCarousel from "./imageCarousel";
import NewsletterForm from "@/components/shopping-view/NewsLetter";
import AboutSection from "@/components/AboutUS";
import ProductsDetailsDialog from "./ProductsDetailsDialog";

const categories = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: Footprints },
];

const apparelItems = [
  { id: "full-sleeve", label: "Full Sleeve T-shirts", icon: Shirt },
  { id: "five-sleeve", label: "Five Sleeve T-shirts", icon: ShirtIcon },
  { id: "hoodies", label: "Hoodies", icon: CloudLightning },
  { id: "jogger", label: "Jogger Jeans", icon: Footprints },
  { id: "jersey", label: "Jersey", icon: ShirtIcon },
  { id: "casual", label: "Casual Wear", icon: Shirt },
];

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  const { productList, productDetails } = useSelector(
    (state) => state.shoppingProducts
  );
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);

  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [addingProductId, setAddingProductId] = useState(null);

  // const slides = [imageOne, imageTwo, imageThree]

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pagination logic
  useEffect(() => {
    if (productList && productList.length > 0) {
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      setPaginatedProducts(
        productList.slice(indexOfFirstProduct, indexOfLastProduct)
      );
    }
  }, [productList, currentPage, productsPerPage]);

  const totalPages = productList
    ? Math.ceil(productList.length / productsPerPage)
    : 0;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to the top of the featured products section
    if (featuredRef.current) {
      featuredRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis1");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis2");
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  function handleNaviagteToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFIlter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFIlter));
    navigate(`/shop/list`);
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  function handleProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (addingProductId) return;

    setAddingProductId(getCurrentProductId);

    const getCartItems = cartItems.items || [];

    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId
    );

    if (indexOfCurrentItem > -1) {
      const currentQuantity = getCartItems[indexOfCurrentItem].quantity;

      if (currentQuantity + 1 > getTotalStock) {
        toast.error(`Only ${getTotalStock} items are available in stock`, {
          description: "You cannot add more than available stock.",
        });
        setAddingProductId(null);
        return;
      }
    } else {
      if (getTotalStock < 1) {
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
        productId: getCurrentProductId,
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
  }

  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner with Animation */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>

        <ImageCarousel featureImageList={featureImageList} />

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex items-center left-10">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-lg"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Wholesale Apparel. Made to Supply.
              </h1>
              <p className="text-white/90 text-sm sm:text-base mb-6">
                Quality garments. Factory-direct. Bulk-ready.
              </p>
              <Button onClick={() => navigate("/shop/list")} className="group">
                View Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>



        {/* <Button
          onClick={() => {
            const newIndex =
              (currentSlide - 1 + (featureImageList?.length || slides.length)) %
              (featureImageList?.length || slides.length)
            setCurrentSlide(newIndex)
          }}
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 z-20 h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-md"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => {
            const newIndex = (currentSlide + 1) % (featureImageList?.length || slides.length)
            setCurrentSlide(newIndex)
          }}
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 z-20 h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-md"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button> */}
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Find exactly what you're looking for in our diverse collection of
              categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {categories.map((categoryItem, index) => (
              <motion.div
                key={categoryItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  onClick={() =>
                    handleNaviagteToListingPage(categoryItem, "category")
                  }
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group border-muted/50 h-full"
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 h-full">
                    <div className="bg-primary/10 p-3 rounded-full mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <categoryItem.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <span className="font-medium text-sm sm:text-base">
                      {categoryItem.label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Discover our handpicked selection of trending items
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 min-h-[500px] bg-gradient-to-br ">
            {paginatedProducts && paginatedProducts.length > 0
              ? paginatedProducts.map((productItem, index) => (
                  <motion.div
                    key={productItem._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.1, 0.8),
                    }}
                  >
                    <ShoppingProductTile
                      handleProductDetails={handleProductDetails}
                      product={productItem}
                      handleAddToCart={() =>
                        handleAddToCart(productItem._id, productItem.totalStock)
                      }
                    />
                  </motion.div>
                ))
              : Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-slate-800/40 backdrop-blur-sm rounded-lg h-[300px] animate-pulse border border-indigo-400/20 shadow-inner shadow-indigo-500/10"
                    />
                  ))}
          </div>
          {/* Pagination */}
          {productList && productList.length > productsPerPage && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  {/* First page button */}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => paginate(1)}
                      disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    >
                      <ChevronFirst className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>

                  {/* Previous button */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && paginate(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {getPageNumbers().map((number, index) => (
                    <PaginationItem key={index}>
                      {number === "ellipsis1" || number === "ellipsis2" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => paginate(number)}
                          isActive={currentPage === number}
                          className="cursor-pointer"
                        >
                          {number}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  {/* Next button */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages && paginate(currentPage + 1)
                      }
                      disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Last page button */}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => paginate(totalPages)}
                      disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    >
                      <ChevronLast className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => navigate("/shop/list")}
              variant="outline"
              className="group"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Apparels Section */}
      <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Apparels</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Explore your comfort fit with our premium selection
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {apparelItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  onClick={() => handleNaviagteToListingPage(item, "brand")}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group border-muted/50 h-full"
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors duration-300">
                      {item.label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section>
        <AboutSection />

        <NewsletterForm />
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 pt-12 pb-6 border-t">
  <div className="container mx-auto px-4 md:px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <img src={logoo} className="h-6 w-6 text-primary" />
          <span className="text-xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Clap
            </span>
            <span className="text-muted-foreground">Studio</span>
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Elevate your style with our curated collection of fashion
          essentials. Quality meets affordability.
        </p>
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Facebook className="h-4 w-4" />
            <span className="sr-only">Facebook</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Instagram className="h-4 w-4" />
            <span className="sr-only">Instagram</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Youtube className="h-4 w-4" />
            <span className="sr-only">YouTube</span>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="font-semibold text-lg mb-4">Shop</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Button
                variant="link"
                className="p-0 h-auto text-muted-foreground hover:text-primary"
                onClick={() =>
                  handleNaviagteToListingPage(category, "category")
                }
              >
                {category.label}
              </Button>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="font-semibold text-lg mb-4">Contact</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground text-sm">
              SMS Center, Nayaks road, Kasaragod, 671121, Kerala, India
            </span>
          </li>
          <li className="flex items-center">
            <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
            <span className="text-muted-foreground text-sm">
              +91 9020302015
            </span>
          </li>
          <li className="flex items-center">
            <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
            <span className="text-muted-foreground text-sm">
              clapstudio53@gmail.com
            </span>
          </li>
        </ul>
      </motion.div>
    </div>

    <Separator className="mb-6" />

    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-muted-foreground text-center md:text-left">
        © {new Date().getFullYear()} ClapStudio. All rights reserved.
      </p>
      <div className="flex gap-4">
        <Link to="/privacy-policy">
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
          >
            Privacy Policy
          </Button>
        </Link>

        <Link to="/terms-and-conditions">
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
          >
            Terms of Service
          </Button>
        </Link>
      </div>
    </div>
  </div>
</footer>


      <ProductsDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingHome;
