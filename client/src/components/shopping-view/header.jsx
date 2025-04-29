import {
  HomeIcon as House,
  LogOut,
  MenuIcon,
  ShoppingCart,
  UserCog2,
  ChevronDown,
  Search,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { shoppingVIewHeaderMenuItems } from "@/config";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

function MenuItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    // Set active item based on current path
    const currentPath = location.pathname.split("/").pop();
    setActiveItem(currentPath);
  }, [location.pathname]);

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFIlter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFIlter));

    location.pathname.includes("list") && currentFIlter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center justify-start lg:justify-center gap-4 lg:gap-6">
      {shoppingVIewHeaderMenuItems.map((menuItem, index) => (
        <motion.div
          key={menuItem.id}
          className="relative group"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Label
            onClick={() => handleNavigate(menuItem)}
            className={`text-sm font-medium cursor-pointer transition-all duration-300 hover:text-primary py-1.5 lg:py-1 block ${
              activeItem === menuItem.id
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }`}
          >
            {menuItem.label}
          </Label>
          <div
            className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full ${
              activeItem === menuItem.id ? "w-full" : ""
            }`}
          ></div>
        </motion.div>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartCount, setCartCount] = useState(0);

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (cartItems?.items?.length > 0) {
      setCartCount(cartItems.items.length);
    } else {
      setCartCount(0);
    }
  }, [cartItems]);

  return (
    <div className="flex items-center gap-2 lg:gap-4">
      {/* Search button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-9 w-9 hover:bg-primary/10 transition-all duration-300"
          onClick={() => navigate("/shop/search")}
        >
          <Search className="w-5 h-5" />
          <span className="sr-only">Search</span>
        </Button>
      </motion.div>

      {/* Wishlist button */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-9 w-9 hover:bg-primary/10 transition-all duration-300"
          onClick={() => navigate("/shop/wishlist")}
        >
          <Heart className="w-5 h-5" />
          <span className="sr-only">Wishlist</span>
        </Button>
      </motion.div> */}

      {/* Cart button */}
      <motion.div
        className="hidden lg:block"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Sheet
          open={openCartSheet}
          onOpenChange={() => setOpenCartSheet(false)}
        >
          <div className="relative">
            <Button
              onClick={() => {
                setOpenCartSheet(true);
              }}
              variant="ghost"
              size="icon"
              className="relative rounded-full h-9 w-9 hover:bg-primary/10 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="sr-only">User cart</span>
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={
              cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items
                : []
            }
          />
        </Sheet>
      </motion.div>

      {/* User dropdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-primary/10 transition-all duration-300 h-9 px-2 lg:px-3"
            >
              <Avatar className="h-7 w-7 lg:h-8 lg:w-8 bg-gradient-to-br from-primary to-primary/70 text-white">
                <AvatarFallback className="text-white font-extrabold text-xs">
                  {(user?.userName || "U").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {user?.userName ? user.userName.split(" ")[0] : "Account"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-56 mt-1 p-2 border border-border/50 shadow-lg"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.userName || "Guest"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "Sign in to access your account"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/shop/Account")}
              className="cursor-pointer hover:bg-primary/10 transition-all duration-200"
            >
              <UserCog2 className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </div>
  );
}

const ShoppinHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky z-40 top-0 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex h-16 sm:h-18 items-center justify-between px-3 sm:px-4 md:px-6">
          <Link
            to="/shop/home"
            className="flex items-center gap-1.5 sm:gap-2 group relative py-2"
          >
            <div className="absolute -inset-2 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <House className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-primary/80 transition-colors duration-300" />
            </motion.div>
            <motion.span
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Clap
              </span>
              <span className="text-muted-foreground">Studio</span>
            </motion.span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 ml-auto mr-1"
              >
                <MenuIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-[280px] sm:max-w-xs p-0"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-6 p-4 sm:p-6">
                  <Link
                    to="/shop/home"
                    className="flex items-center gap-2 group py-2"
                  >
                    <House className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors duration-300" />
                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        Clap
                      </span>
                      <span className="text-muted-foreground">Studio</span>
                    </span>
                  </Link>
                  <div className="space-y-1.5 pt-4">
                    <MenuItems />
                  </div>
                </div>
                <div className="border-t p-4 sm:p-6">
                  <HeaderRightContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block mx-auto">
            <MenuItems />
          </div>

          <div className="flex items-center">
            <div className="hidden lg:block">
              <HeaderRightContent />
            </div>

            {/* Mobile cart button - separate from HeaderRightContent for better mobile layout */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full h-9 w-9 hover:bg-primary/10 transition-all duration-300 mr-1"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="sr-only">User cart</span>
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                      0
                    </Badge>
                  </Button>
                </SheetTrigger>
                {/* Cart content would go here */}
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShoppinHeader;
