import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import GradientButton from "./../components/GradientButton";
import logo from "./../assets/logo.png";

const CreatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    // abhi sirf UI -> navigate karega success screen par
    navigate("/Success");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-8">Create New Password</h2>

        {/* Password */}
        <div className="flex items-center px-4 mb-4 rounded border border-white/20 bg-black/50 relative">
          <HiOutlineLockClosed className="text-gray-400 mr-4 text-lg" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 hover:text-white"
          >
            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex items-center px-4 mb-6 rounded border border-white/20 bg-black/50 relative">
          <HiOutlineLockClosed className="text-gray-400 mr-4 text-lg" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 text-gray-400 hover:text-white"
          >
            {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          </button>
        </div>

        {/* Button */}
        <GradientButton label="RESET PASSWORD" onClick={handleReset} fullWidth />
      </div>
    </div>
  );
};

export default CreatePassword;
