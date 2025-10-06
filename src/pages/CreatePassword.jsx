// src/pages/CreatePassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { FaTimesCircle } from "react-icons/fa";
import GradientButton from "./../components/GradientButton";
import logo from "./../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const strongPassRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).{8,}$/;

const CreatePassword = () => {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false); 

  const handleReset = async (e) => {
    e?.preventDefault?.();
    if (loading) return;

    // validations
    if (!password || !confirm) {
      toast.error("Please fill both password fields.");
      return;
    }
    if (!strongPassRegex.test(password)) {
      toast.error("Password must be ≥8 chars with at least 1 uppercase & 1 special character.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/auth/reset-password/${uidb64}/${token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          new_password: password,
          confirm_password: confirm,
        }),
      });

      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {}

      if (!res.ok) {
        const msg =
          (data && (data.error || data.detail || data.message)) ||
          "Failed to reset password.";
        toast.error(msg);

        if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("expired")) {
          setInvalid(true);
        }
        return;
      }

      toast.success("Password reset successfully!");
      navigate("/"); // ✅ redirect to login
    } catch (err) {
      // console.error("[create_password] error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Invalid token → show error screen like EmailNotVerified
  if (invalid) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-6 text-white bg-black">
        <div className="bg-black/70 border border-white/10 rounded-2xl p-10 sm:p-14 max-w-md w-full shadow-lg flex flex-col items-center gap-3">
          <FaTimesCircle className="text-red-500 sm:text-6xl text-5xl mb-6" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-red-500 mb-3">
            Reset link invalid
          </h1>
          <p className="text-gray-300 sm:text-sm text-xs mb-8">
            Kindly go back to verify your email again.
          </p>
          <GradientButton label="Go to Login" onClick={() => navigate("/")} />
        </div>
      </section>
    );
  }

  // ✅ Valid token (default) → show reset form
  return (
    <>
      <div className="flex items-center justify-center min-h-screen text-white pt-20">
        <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
          </div>

          {/* Heading */}
          <h2 className="text-xl font-semibold mb-8">Create New Password</h2>

          <form onSubmit={handleReset} noValidate>
            {/* Password */}
            <div className="flex items-center px-4 mb-4 rounded border border-white/20 bg-black/50 relative">
              <HiOutlineLockClosed className="text-gray-400 mr-4 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 text-gray-400 hover:text-white"
                disabled={loading}
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
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 text-gray-400 hover:text-white"
                disabled={loading}
              >
                {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>

            {/* Submit */}
            <GradientButton
              label={loading ? "SAVING..." : "RESET PASSWORD"}
              onClick={handleReset}
              fullWidth
              loading={loading}
              disabled={loading}
              type="submit"
            />
          </form>
        </div>
      </div>

      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

export default CreatePassword;
