import { motion } from "framer-motion";
import CommonForm from "@/components/common/Form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload.user) {
        toast.success(data?.payload.message);
      } else {
        toast.error(data?.payload?.message);
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
          Sign In
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Don’t have an account?
          <Link
            className="hover:underline font-medium ml-1 text-primary"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </motion.div>
  );
};

export default Login;
