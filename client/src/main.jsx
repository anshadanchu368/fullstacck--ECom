import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="763803715319-v9dser35ipels2fke9ugra84djfb69tl.apps.googleusercontent.com">
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster/>
    </Provider>
  </BrowserRouter>
    </GoogleOAuthProvider>
);
