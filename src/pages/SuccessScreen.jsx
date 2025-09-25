import React from "react";
import { useNavigate } from "react-router-dom";
import GradientButton from "./../components/GradientButton";
import logo from "./../assets/logo.png";

const SuccessScreen = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    // Abhi sirf UI -> direct login page
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-4">Password Reset Successful 🎉</h2>
        <p className="text-gray-400 text-sm mb-12">
          Your account password has been updated successfully.
        </p>

        {/* Proceed Button */}
        <GradientButton
          label="PROCEED TO LOGIN"
          onClick={handleProceed}
          fullWidth
        />
      </div>
    </div>
  );
};

export default SuccessScreen;
