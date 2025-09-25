import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import GradientButton from "./../components/GradientButton";
import logo from "./../assets/logo.png";
import { useNavigate } from "react-router-dom";



const ForgetPassword = () => {
    const navigate = useNavigate();
  
  const handleVerify = () => {
    navigate("/VerifyOTP");
};



  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-8">Recover Your Account</h2>

        {/* Email Input */}
        <div className="flex items-center px-4 mb-6 rounded border border-white/20 bg-black/50">
          <HiOutlineMail className="text-gray-400 mr-4 text-lg" />
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
          />
        </div>

        {/* Verify Button */}
        <GradientButton label="VERIFY EMAIL" onClick={handleVerify} fullWidth />
      </div>
    </div>
  );
};

export default ForgetPassword;
