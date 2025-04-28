import { motion } from "framer-motion";
import CommonForm from "@/components/common/Form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload.success) {
        toast.success("Registration successful! Please login.");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      } else {
        toast.error(data?.payload?.message || "Registration failed!");
      }
    });
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-md space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-center">
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
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </motion.div>
  );
};

export default Register;
