import React, { useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useUser } from "./../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

// same regex as signup
const strongPassRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).{8,}$/;

const DeleteAccountModal = ({ onClose }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate(); // ✅ must be invoked

  const isValid = strongPassRegex.test(pwd);

  const handleDelete = async () => {
    if (!isValid) {
      toast.error("Please enter a valid password (≥8 chars, 1 uppercase, 1 special).");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("Access-Token");

      const res = await fetch(`${serverUrl}/auth/delete/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: pwd }),
      });

      if (!res.ok) {
        // If backend returns JSON with message, try to show it; otherwise generic
        let msg = "Kindly enter your correct password.";
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        toast.error(msg);
        setLoading(false);
        return;
      }

      // success → clear token & navigate to login
      localStorage.removeItem("Access-Token");
      navigate("/", { replace: true });
    } catch (err) {
      // console.error("Error deleting account", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      {/* Local toast container (dark) */}
      <ToastContainer position="top-right" theme="dark" autoClose={2500} />

      <div className="relative bg-black/90 border border-white/20 rounded-xl shadow-2xl p-8 text-center max-w-md w-full">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          aria-label="Close"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Warning Icon */}
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-red-500">Delete Account</h2>

        {/* Message */}
        <p className="text-gray-300 text-sm mb-10 leading-6">
          Are you sure you want to delete your account,
          <span className="text-white font-semibold">
            {" "}
            {user?.user?.full_name || "Guest User"}
          </span>
          ? <br /> This action cannot be undone.
        </p>

        {/* Password Field (signup-style) */}
        <div className="flex items-center px-4 mb-3 rounded border border-white/20 bg-black/50 relative">
          <HiOutlineLockClosed className="text-gray-400 mr-3 text-lg" />
          <input
            name="deletePassword"
            type={showPwd ? "text" : "password"}
            placeholder="Enter your password to confirm"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full py-3 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-3 text-gray-400 hover:text-white"
            disabled={loading}
          >
            {showPwd ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          </button>
        </div>

        {/* Tiny helper / validation hint */}
        <p className="text-[11px] text-yellow-300 mb-6">
          Password must be at least 8 chars, include an uppercase letter and a special character.
        </p>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={loading || !isValid}
          className={`w-full py-3 rounded font-bold text-white
            bg-gradient-to-r from-red-600 to-red-800
            hover:from-red-500 hover:to-red-700
            transition-all shadow-lg sm:text-sm text-xs
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2`}
        >
          {loading && (
            <span
              className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          )}
          <span>{loading ? "Deleting..." : "Delete Account"}</span>
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
