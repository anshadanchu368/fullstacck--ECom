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
    const dispatch =useDispatch()
    const navigate = useNavigate();

  function onSubmit(e) {
      e.preventDefault()
      dispatch(registerUser(formData)).then((data)=>{
        console.log(data)
        if(data?.payload.success) {
          toast.success("Registration successful! Please login with your new account.");
          setTimeout(() => {
            navigate('/auth/login');
          }, 1000);
        } else{
          toast.error(data?.payload?.message || "Registration failed!");
          console.log("unsuccesful register")
        }
      })
  }
  
  return (
    <div className="mx-auto w-full max-w-md space-y-6 ">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="mt-2">
          Already Have an Account?
          <Link className="hover:underline font-medium ml-2 text-primary" to="/auth/login">
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
    </div>
  );
};

export default Register;
