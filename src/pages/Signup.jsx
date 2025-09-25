import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineBriefcase,
} from "react-icons/hi";
import GradientButton from "./../components/GradientButton";
import logo from "./../assets/logo.png";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = () => {
    // Abhi sirf UI -> direct Home
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-xl bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-8">Create Your Account</h2>

        {/* First & Last Name */}
        <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 sm:mb-6 mb-4">
          <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50">
            <HiOutlineUser className="text-gray-400 mr-3 text-lg" />
            <input
              type="text"
              placeholder="First Name"
              className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50">
            <HiOutlineUser className="text-gray-400 mr-3 text-lg" />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center px-4 sm:mb-6 mb-4 rounded border border-white/20 bg-black/50">
          <HiOutlineMail className="text-gray-400 mr-3 text-lg" />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
          />
        </div>

        {/* Password + Confirm Password */}
        <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 sm:mb-6 mb-4">
          {/* Password */}
          <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50 relative">
            <HiOutlineLockClosed className="text-gray-400 mr-3 text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
          <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50 relative">
            <HiOutlineLockClosed className="text-gray-400 mr-3 text-lg" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Industry */}
        <div className="flex items-center px-4 mb-6 rounded border border-white/20 bg-black/50">
          <HiOutlineBriefcase className="text-gray-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Enter your industry (i.e Mechanic)"
            className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
          />
        </div>

        {/* Signup Button */}
        <GradientButton label="SIGN UP" onClick={handleSignup} fullWidth />

        {/* Login link */}
        <p className="mt-6 text-xs text-gray-400">
          Already have an account?{" "}
          <a href="/" className="text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
