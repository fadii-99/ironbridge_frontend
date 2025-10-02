import React from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="relative bg-black/90 border border-white/20 rounded-xl shadow-2xl p-8 text-center max-w-sm w-full">
        
        {/* Close Icon (top-right) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          aria-label="Close"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Success Icon */}
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-5 text-white">Success</h2>

        {/* Message */}
        <p className="text-gray-300 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;
