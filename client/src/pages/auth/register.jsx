

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "@/store/auth-slice";
import { registerFormControls } from "@/config";
import CommonForm from "@/components/common/Form";
import { CheckCircle2, XCircle, UserPlus, Lock, Mail, User } from 'lucide-react';
import { Eye, EyeOff } from "lucide-react";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const passwordRequirements = [
  { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
  { id: "lowercase", label: "One lowercase letter", regex: /[a-z]/ },
  { id: "uppercase", label: "One uppercase letter", regex: /[A-Z]/ },
  { id: "number", label: "One number", regex: /[0-9]/ },
  { id: "special", label: "One special character", regex: /[^A-Za-z0-9]/ },
];

export default function RegisterForm() {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Enhanced form controls with focus events for password
  const enhancedFormControls = registerFormControls.map(control => {
    if (control.name === "password") {
      return {
        ...control,
        type: showPassword ? "text" : "password",
        onFocus: () => setPasswordFocused(true),
        onBlur: () => setPasswordFocused(false),
        rightIcon: (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        ),
      };
    }
    return control;
  });

  // Check password requirements whenever password changes
  useEffect(() => {
    const password = formData.password;
    const newRequirementsMet = {
      length: passwordRequirements[0].regex.test(password),
      lowercase: passwordRequirements[1].regex.test(password),
      uppercase: passwordRequirements[2].regex.test(password),
      number: passwordRequirements[3].regex.test(password),
      special: passwordRequirements[4].regex.test(password),
    };
    
    setPasswordRequirementsMet(newRequirementsMet);
    
    // Check if all form fields are valid
    const allRequirementsMet = Object.values(newRequirementsMet).every(Boolean);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const usernameValid = formData.userName.length >= 3;
    
    setIsFormValid(allRequirementsMet && emailValid && usernameValid);
  }, [formData]);

  function onSubmit(e) {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }
    
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload.success) {
        toast.success("Registration successful");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      } else {
        toast.error(data?.payload?.message || "Registration failed!");
      }
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?
            <Link
              className="hover:underline font-medium ml-1 text-primary"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
        </div>
        
        <CommonForm
          formControls={enhancedFormControls}
          buttonText={"Create Account"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isBtnDisabled={!isFormValid}
        />
        
        {/* Password requirements */}
        {(passwordFocused || formData.password) && (
          <motion.div 
            className="mt-4 space-y-2 text-sm rounded-lg bg-gray-50 p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="font-medium text-gray-700 mb-2">Password requirements:</h3>
            <ul className="space-y-1">
              {passwordRequirements.map((req) => (
                <li key={req.id} className="flex items-center gap-2">
                  {passwordRequirementsMet[req.id] ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span className={passwordRequirementsMet[req.id] ? "text-gray-700" : "text-gray-400"}>
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 ">
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
