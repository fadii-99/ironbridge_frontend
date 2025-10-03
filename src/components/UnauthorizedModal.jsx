// src/components/UnauthorizedModal.jsx
import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import GradientButton from "./GradientButton";

const UnauthorizedModal = ({ onLogin, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-black/90 border border-white/20 rounded-xl shadow-2xl p-8 text-center max-w-sm w-full">
        {/* Icon */}
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-3 text-white">Unauthorized</h2>
        {/* Message */}
        <p className="text-gray-300 text-sm mb-6">
          You’re not authorized to view this page. Please log in to continue.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <GradientButton label="Go to Login" onClick={onLogin} fullWidth />
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedModal;
