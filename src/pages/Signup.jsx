import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineBriefcase,
  HiOutlineChevronDown,
} from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GradientButton from "./../components/GradientButton";
import SuccessModal from "./../components/SuccessModel";
import logo from "./../assets/logo.png";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const nameRegex = /^[A-Za-z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const strongPassRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).{8,}$/;

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ modal state

  // Industry dropdown (commented for now)
  const [industryOpen, setIndustryOpen] = useState(false);
  const [industry, setIndustry] = useState("");
  const dropdownRef = useRef(null);

  const sanitizeName = (v) => v.replace(/[^A-Za-z]/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName" || name === "lastName") {
      const clean = sanitizeName(value);
      setForm((prev) => ({ ...prev, [name]: clean }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e?.preventDefault?.();
    if (loading) return;

    const first = form.firstName.trim();
    const last = form.lastName.trim();
    const email = form.email.trim();
    const pass = form.password;
    const cpass = form.confirmPassword;

    // Client-side validation
    if (!first || !last || !email || !pass || !cpass) {
      toast.error("Please fill all fields");
      return;
    }
    if (!nameRegex.test(first)) {
      toast.error("First name should contain only letters without spaces.");
      return;
    }
    if (!nameRegex.test(last)) {
      toast.error("Last name should contain only letters without spaces.");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (!strongPassRegex.test(pass)) {
      toast.error("Password must be ≥8 chars with at least 1 uppercase & 1 special character.");
      return;
    }
    if (pass !== cpass) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${first} ${last}`,
          email,
          password: pass,
        }),
      });

      const raw = await res.text();
      let json = null;
      try {
        json = raw ? JSON.parse(raw) : null;
      } catch {}

      if (!res.ok) {
        toast.error(json?.message || "Signup failed");
        return;
      }

      setShowModal(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      // console.error("[signup] network error:", err);
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="w-full max-w-xl bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
          </div>

          {/* Heading */}
          <h2 className="text-xl font-semibold mb-8">Create Your Account</h2>

          <form onSubmit={handleSignup} autoComplete="off" noValidate>
            {/* First & Last Name */}
            <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 sm:mb-6 mb-4">
              {/* First Name */}
              <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50">
                <HiOutlineUser className="text-gray-400 mr-3 text-lg" />
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                  disabled={loading}
                />
              </div>

              {/* Last Name */}
              <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50">
                <HiOutlineUser className="text-gray-400 mr-3 text-lg" />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center px-4 sm:mb-6 mb-4 rounded border border-white/20 bg-black/50">
              <HiOutlineMail className="text-gray-400 mr-3 text-lg" />
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                disabled={loading}
              />
            </div>

            {/* Password + Confirm Password */}
            <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 sm:mb-6 mb-4">
              {/* Password */}
              <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50 relative">
                <HiOutlineLockClosed className="text-gray-400 mr-3 text-lg" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
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
              <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50 relative">
                <HiOutlineLockClosed className="text-gray-400 mr-3 text-lg" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-3 text-gray-400 hover:text-white"
                  disabled={loading}
                >
                  {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <GradientButton
              label="SIGN UP"
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            />
          </form>

          {/* Login link */}
          <p className="mt-6 text-xs text-gray-400">
            Already have an account?{" "}
            <a href="/" className="text-yellow-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer theme="dark" />

      {/* Success Modal */}
      {showModal && (
        <SuccessModal
          message="Email sent successfully! Please check your inbox to verify your account."
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Signup;
