

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom"; // Add useLocation
import { toast } from "sonner";
import { loginUser } from "@/store/auth-slice";
import { loginFormControls } from "@/config";
import CommonForm from "@/components/common/Form";
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import  logoo  from "../../assets/accounts/clapstudio.png"
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

const initialState = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function LoginForm() {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation(); // Get location to check for query params

  // Check if coming from password reset with email
  useEffect(() => {
    // Check for email in URL params (you could add this when redirecting from reset)
    const storedEmail = localStorage.getItem("rememberEmail");
    if (storedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: storedEmail,
        rememberMe: true, // Ensure the "Remember Me" box is checked if we find email in localStorage
      }));
    }
    const params = new URLSearchParams(location.search);
    const resetEmail = params.get("email");

    if (resetEmail) {
      setFormData((prev) => ({ ...prev, email: resetEmail }));
      toast.info(`Please login with your new password`);
    }

    // Check for resetEmail in localStorage (alternative approach)
    const storedResetEmail = localStorage.getItem("resetEmail");
    if (storedResetEmail) {
      setFormData((prev) => ({ ...prev, email: storedResetEmail }));
      localStorage.removeItem("resetEmail"); // Clear after use
      toast.info(`Please login with your new password`);
    }
  }, [location]);

  // Enhanced form controls with password visibility toggle
  const enhancedFormControls = loginFormControls.map((control) => {
    if (control.name === "password") {
      return {
        ...control,
        type: showPassword ? "text" : "password",
        componentType: "input",
        rightIcon: (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        ),
      };
    }
    return control;
  });

  function onSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    console.log("Attempting login with:", formData.email);

    if (formData.rememberMe) {
      localStorage.setItem("rememberEmail", formData.email);
    } else {
      localStorage.removeItem("rememberEmail"); 
    }

    dispatch(loginUser(formData))
      .then((data) => {
        console.log("Login response:", data);
        if (data?.payload?.success) {
          toast.success(data?.payload?.message || "Login successful");
        } else {
          console.error("Login failed:", data?.payload);
          toast.error(data?.payload?.message || "Login failed");
        }
      })
      .catch((error) => {
        console.error("Login exception:", error);
        toast.error("An error occurred during login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="flex min-h-[500px] items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md space-y-6 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center">
          <div className="">
            <img src={logoo} alt="clapstudio" className="h-6 w-6 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4 " />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?
            <Link
              className="hover:underline font-medium ml-1 text-primary"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
        </div>

        <CommonForm
          formControls={enhancedFormControls}
          buttonText={isLoading ? "Signing In..." : "Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isBtnDisabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rememberMe: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember" className="text-sm text-gray-600 pr-2">
              Remember me
            </label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
     <GoogleLoginButton/>
        </div>
      </motion.div>
    </div>
  );
}
