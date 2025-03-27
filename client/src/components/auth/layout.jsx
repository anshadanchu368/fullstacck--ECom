import React from "react";
import { Outlet } from "react-router-dom";

const Authlayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-white-00">
      <div className="hidden lg:flex w-1/2 bg-orange-400 justify-center items-center">
        <div className="max-w-md space-y-6 text-center text-primary">
          <h1 className="tracking-tight font-extrabold text-4xl">Welcome to <span>&#128079;
          </span>ClapStudio</h1>
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center px-4 py-12 sm:px-12 sm:px-6 lg:px-8">
        <Outlet/>
      </div>
    </div>
  );
};

export default Authlayout;
