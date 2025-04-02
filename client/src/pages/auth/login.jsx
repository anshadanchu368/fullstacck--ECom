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
  const dispatch =useDispatch()

  function onSubmit(e) {
     e.preventDefault()
      dispatch(loginUser(formData)).then((data)=>{
         if(data?.payload.user){
          toast.success(data?.payload.message)
         }else{
            toast.error(data?.payload?.message)
         }
      })


  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6 ">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Login
        </h1>
        <p className="mt-2">
          Create an Account?
          <Link className="hover:underline font-medium ml-2 text-primary" to="/auth/register">
            Sign Up
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
    </div>
  );
};

export default Login;
