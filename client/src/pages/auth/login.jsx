

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
            <img src={logoo} className="h-6 w-6 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4 " />
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
          <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}
