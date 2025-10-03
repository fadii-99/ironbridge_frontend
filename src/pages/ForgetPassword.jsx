// src/pages/ForgetPassword.jsx
import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import GradientButton from "./../components/GradientButton";
import SuccessModal from "./../components/SuccessModel";
import logo from "./../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ modal state

  const handleVerify = async (e) => {
    e?.preventDefault?.();
    if (loading) return;

    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/auth/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: trimmed }),
      });

      const ct = res.headers.get("content-type") || "";
      let data = null;
      if (ct.includes("application/json")) {
        try {
          data = await res.json();
        } catch {}
      } else {
        try {
          data = await res.text();
        } catch {}
      }

      if (!res.ok) {
        const msg =
          (data && (data.error || data.detail || data.message)) ||
          (res.status === 404
            ? "No account found with this email"
            : "Failed to send reset link");
        toast.error(msg);
        return;
      }

      // ✅ Success → show modal instead of navigate
      setShowModal(true);

      // ✅ reset input
      setEmail("");
    } catch (err) {
      // console.error("[forgot] network error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
          </div>

          {/* Heading */}
          <h2 className="text-xl font-semibold mb-8">Recover Your Account</h2>

          {/* Email Input */}
          <form onSubmit={handleVerify} noValidate>
            <div className="flex items-center px-4 mb-6 rounded border border-white/20 bg-black/50">
              <HiOutlineMail className="text-gray-400 mr-4 text-lg" />
              <input
                name="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                disabled={loading}
                autoComplete="email"
              />
            </div>


            <GradientButton
              label="SEND RESET LINK"
              onClick={handleVerify}
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

      {showModal && (
        <SuccessModal
          message="Password reset link sent successfully! Please check your inbox."
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ForgetPassword;
