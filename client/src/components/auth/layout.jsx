import React from "react";
import { Outlet } from "react-router-dom";
import AuthBackground from "../ui/AuthBackground";

const Authlayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="relative hidden lg:flex w-1/2 bg-black justify-center items-center overflow-hidden">
        <div className="absolute inset-0">
          <AuthBackground />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
            ClapStudio
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Timeless. Elegant. You.
          </p>
        </div>
      </div>

      <div className="flex flex-1 justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Authlayout;
