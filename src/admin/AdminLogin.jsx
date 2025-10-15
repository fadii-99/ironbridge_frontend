import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GradientButton from "./../components/GradientButton";
import logo from "./../assets/logo.png";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) return toast.error("Email and password are required.");
    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Invalid credentials");
        return;
      }
        localStorage.setItem("AdminToken", data.tokens.access);
        navigate("/admin", { replace: true });

    } catch (err) {
      toast.error("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="flex items-center justify-center min-h-screen text-white pt-20">
        <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Admin Logo" className="h-auto w-[8rem]" />
          </div>
          <h2 className="text-xl font-semibold mb-8">Admin Panel Login</h2>

          <form className="text-left" onSubmit={handleLogin} noValidate>
            <div className="flex items-center px-4 mb-4 rounded border border-white/20 bg-black/50">
              <HiOutlineMail className="text-gray-400 mr-4 text-lg" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter admin email"
                className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                disabled={loading}
              />
            </div>

            <div className="flex items-center px-4 mb-6 rounded border border-white/20 bg-black/50 relative">
              <HiOutlineLockClosed className="text-gray-400 mr-4 text-lg" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 text-gray-400 hover:text-white"
                disabled={loading}
              >
                {showPassword ? <HiOutlineEyeOff className="text-lg" /> : <HiOutlineEye className="text-lg" />}
              </button>
            </div>

            <GradientButton
              label={loading ? "LOGGING IN..." : "LOGIN"}
              fullWidth
              onClick={handleLogin}
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

export default AdminLogin;
