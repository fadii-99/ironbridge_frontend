// src/pages/Login.jsx
import React, { useState , useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GradientButton from "./../components/GradientButton";
import logo from "./../assets/logo.png";
import { useUser } from "../context/UserProvider"; 

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Login = () => {
  const navigate = useNavigate();
  const { reloadUser } = useUser(); 

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



  useEffect(() => {
    localStorage.removeItem("Access-Token");
  }, []);


  const extractErrorMessage = (raw, json, fallback = "Invalid credentials") => {
    if (!json) return raw || fallback;
    if (typeof json === "string") return json;
    if (json.error) return Array.isArray(json.error) ? json.error.join(", ") : String(json.error);
    if (json.detail) return String(json.detail);
    if (json.message) return String(json.message);
    if (json.errors) {
      if (Array.isArray(json.errors)) return json.errors.join(", ");
      if (typeof json.errors === "object") {
        const msgs = Object.entries(json.errors).flatMap(([k, v]) =>
          Array.isArray(v) ? v.map((m) => `${k}: ${m}`) : [`${k}: ${v}`]
        );
        if (msgs.length) return msgs.join(" | ");
      }
    }
    const fieldMsgs = ["email", "password", "non_field_errors"]
      .flatMap((k) => (json[k] ? (Array.isArray(json[k]) ? json[k] : [json[k]]) : []));
    if (fieldMsgs.length) return fieldMsgs.join(" | ");
    return raw || fallback;
  };

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    if (loading) return;

    const email = form.email.trim();
    const password = form.password;
    const role = 'user';

    if (!email && !password) return toast.error("Email and password are required.");
    if (!email) return toast.error("Email is required.");
    if (!password) return toast.error("Password is required.");

    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const raw = await res.text();
      let json = null;
      try { json = raw ? JSON.parse(raw) : null; } catch {}

      if (!res.ok) {
        const msg = extractErrorMessage(raw, json);
        toast.error(msg);
        return;
      }

      if (json?.tokens?.access) {
          localStorage.setItem("Access-Token", json.tokens.access);

          navigate("/Home", { replace: true });
          reloadUser()
        }
    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen text-white pt-20">
        <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
          </div>
          <h2 className="text-xl font-semibold mb-8">Enter Your Credentials</h2>

          <form className="text-left" onSubmit={handleLogin} autoComplete="off" noValidate>
            <div className="flex items-center px-4 mb-4 rounded border border-white/20 bg-black/50 "
            >
              <HiOutlineMail className="text-gray-400 mr-4 text-lg" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                disabled={loading}
                aria-invalid={!form.email ? "true" : "false"}
              />
            </div>

            <div className="flex items-center px-4 mb-2 rounded border border-white/20 bg-black/50 relative">
              <HiOutlineLockClosed className="text-gray-400 mr-4 text-lg" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                disabled={loading}
                aria-invalid={!form.password ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 text-gray-400 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <HiOutlineEyeOff className="text-lg" /> : <HiOutlineEye className="text-lg" />}
              </button>
            </div>

            <div className="w-full text-right mb-6">
              <Link to="/ForgetPassword" className="text-xs text-gray-400 hover:text-yellow-400">
                Forget your password?
              </Link>
            </div>

            <GradientButton
              label="LOGIN"
              onClick={handleLogin}
              fullWidth
              loading={loading}
              disabled={loading}
              type="submit"
            />
          </form>

          <p className="mt-6 text-xs text-gray-400">
            Don’t have an account?{" "}
            <Link to="/Signup" className="text-yellow-400 hover:underline">
              Sign Up
            </Link>
          </p>
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

export default Login;
