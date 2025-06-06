// import './App.css'
import { Route, Routes } from "react-router-dom";
import { Button } from "./components/button";
import "./index.css";
import Authlayout from "./components/auth/layout";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import AdminLayout from "./components/admin-view/Layout";
import AdminFeatures from "./pages/admin-view/features";
import AdminOrders from "./pages/admin-view/orders";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import NotFound from "./pages/NotFound";
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/chckout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingList from "./pages/shopping-view/listing";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { useEffect } from "react";
import { Skeleton } from "./components/ui/skeleton";
import SearchProducts from "./pages/shopping-view/search";
import ForgotPasswordForm from "./pages/auth/ForgotPassword";
import ResetPasswordForm from "./pages/auth/ResetPassword";
import PolicyPage from "./components/Privacyandolicy";
import TermsAndConditionsPage from "./components/Termsandonditions";


function App() {


  const {user, isAuthenticated ,isLoading} = useSelector((state)=>state.auth)
 
  const dispatch =useDispatch();

  useEffect(()=>{
    const token = JSON.parse(sessionStorage.getItem('token'))
    dispatch(checkAuth(token))
  },[dispatch])

  if(isLoading) return <Skeleton className="w-full min-h-screen " />

  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
          <Route
           path="/"
           element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Authlayout />
            </CheckAuth>
          }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <Authlayout />
                 
              </CheckAuth>
            }
          >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPasswordForm />} />
            <Route path="reset-password/:token" element={<ResetPasswordForm />} />
            
          </Route>
          <Route path="/admin" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>
          <Route path="/shop" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }>
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="home" element={<ShoppingHome />} />
            <Route path="list" element={<ShoppingList />} />
            <Route path="search" element={<SearchProducts />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="/privacy-policy" element={<PolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />

        </Routes>
      </div>
    </>
  );
}

export default App;
