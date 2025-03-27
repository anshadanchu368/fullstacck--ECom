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

function App() {
  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
          <Route path="/auth" element={<Authlayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>
          <Route path="/shop" element={<ShoppingLayout />}>
            <Route path="account" element={<ShoppingAccount/>}/>
            <Route path="checkout" element={<ShoppingCheckout/>}/>
            <Route path="home" element={<ShoppingHome/>}/>
            <Route path="list" element={<ShoppingList/>}/>
          </Route>
            <Route path="*" element={<NotFound />} />
       
        </Routes>
      </div>
    </>
  );
}

export default App;
