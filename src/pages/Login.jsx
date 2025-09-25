import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineMail,      // Email outline
  HiOutlineLockClosed, // Password outline
  HiOutlineEye,       // Eye outline
  HiOutlineEyeOff,    // Eye-off outline
} from "react-icons/hi";
import GradientButton from "./../components/GradientButton";
import logo from './../assets/logo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Abhi sirf UI -> direct Home
    navigate("/Home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-8">Enter Your Credentials</h2>

        {/* Email Input */}
        <div className="flex items-center px-4 mb-4 rounded border border-white/20 bg-black/50">
          <HiOutlineMail className="text-gray-400 mr-4 text-lg" />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center px-4 mb-2 rounded border border-white/20 bg-black/50 relative">
          <HiOutlineLockClosed className="text-gray-400 mr-4 text-lg" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 hover:text-white"
          >
            {showPassword ? (
              <HiOutlineEyeOff className="text-lg" />
            ) : (
              <HiOutlineEye className="text-lg" />
            )}
          </button>
        </div>

        {/* Forget Password */}
        <div className="w-full text-right mb-6">
          <a
            href="/ForgetPassword"
            className="text-xs text-gray-400 hover:text-yellow-400"
          >
            Forget your password?
          </a>
        </div>

        {/* Login Button */}
        <GradientButton label="LOGIN" onClick={handleLogin} fullWidth />

        {/* Sign Up link */}
        <p className="mt-6 text-xs text-gray-400">
          Don’t have an account?{" "}
          <a href="/Signup" className="text-yellow-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
