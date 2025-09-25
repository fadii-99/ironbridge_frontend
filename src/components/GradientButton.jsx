import React from "react";

const GradientButton = ({ label = "Click Me", onClick, fullWidth = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${fullWidth ? "w-full" : "sm:px-8 px-4"} 
        py-3 rounded font-bold text-black
        bg-gradient-to-r from-yellow-400 to-yellow-600
        hover:from-yellow-300 hover:to-yellow-500
        transition-all shadow-lg sm:text-sm text-xs 
      `}
    >
      {label}
    </button>
  );
};

export default GradientButton;
