import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import GradientButton from "./GradientButton";
import { useNavigate } from "react-router-dom";

const UnauthorizedAdminModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-black/90 border border-white/20 rounded-xl shadow-2xl p-8 text-center max-w-sm w-full">
        {/* Error Icon */}
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-3 text-white">
          Unauthorized Access
        </h2>

        {/* Message */}
        <p className="text-gray-300 text-sm mb-6 leading-6">
          Only <span className="text-yellow-400 font-semibold">Admin Users </span> 
          can access this section. <br /> Please log in with your admin credentials.
        </p>

        {/* Action Button */}
        <GradientButton
          label="Go to Admin Login"
          onClick={() => navigate("/AdminLogin")}
          fullWidth
        />
      </div>
    </div>
  );
};

export default UnauthorizedAdminModal;
