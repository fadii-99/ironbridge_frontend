import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./../src/components/Navbar";



const ParentElement = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Navbar fixed at top */}
      <Navbar />
      {/* Nested children */}
      <Outlet />
    </div>
  );
};

export default ParentElement;
