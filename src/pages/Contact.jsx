// src/pages/Contact.jsx
import React, { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCog,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GradientButton from "./../components/GradientButton";
import SuccessModal from "./../components/SuccessModel";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const nameRegex = /^[A-Za-z\s]+$/; // alphabets + spaces
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    partNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (loading) return;

    const { name, email, partNumber, message } = formData;

    // ✅ Validations
    if (!name || !email || !partNumber || !message) {
      toast.error("All fields are required.");
      return;
    }
    if (!nameRegex.test(name)) {
      toast.error("Name should only contain letters and spaces.");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/auth/contact_us/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          part_number: partNumber,
          message,
        }),
      });

      const raw = await res.text();
      let json = null;
      try {
        json = raw ? JSON.parse(raw) : null;
      } catch {}

      if (!res.ok) {
        toast.error(json?.message || "Failed to send message.");
        return;
      }

      // ✅ Success
      setShowModal(true);
      setFormData({ name: "", email: "", partNumber: "", message: "" });
    } catch (err) {
      // console.error("[contact] network error:", err);
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="flex items-center justify-center min-h-screen px-4 text-white pt-20">
        <div className="w-full max-w-2xl bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg">
          <h1 className="md:text-5xl text-3xl font-extrabold sm:leading-tight leading-15 text-center mb-8">
            <span className="text-yellow-300">Contact</span> Us
          </h1>

          {/* Name */}
          <div className="flex items-center px-4 sm:mb-6 mb-4 rounded border border-white/20 bg-black/50">
            <HiOutlineUser className="text-gray-400 mr-3 text-lg" />
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="flex items-center px-4 sm:mb-6 mb-4 rounded border border-white/20 bg-black/50">
            <HiOutlineMail className="text-gray-400 mr-3 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
              disabled={loading}
            />
          </div>

          {/* Part Number */}
          <div className="flex items-center px-4 sm:mb-6 mb-4 rounded border border-white/20 bg-black/50">
            <HiOutlineCog className="text-gray-400 mr-3 text-lg" />
            <input
              type="text"
              name="partNumber"
              placeholder="Enter part number  ( e.g J7208H )"
              value={formData.partNumber}
              onChange={handleChange}
              className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
              disabled={loading}
            />
          </div>

          {/* Message */}
          <div className="flex items-start px-4 sm:mb-6 mb-4 rounded border border-white/20 bg-black/50">
            <HiOutlineChatAlt2 className="text-gray-400 mr-3 text-lg mt-4" />
            <textarea
              name="message"
              placeholder="Write your message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none resize-none"
              disabled={loading}
            />
          </div>

          {/* Submit Button with loader */}
          <GradientButton
            label={loading ? "SENDING..." : "SEND MESSAGE"}
            onClick={handleSubmit}
            fullWidth
            loading={loading}
            disabled={loading}
          />
        </div>
      </section>

      {/* Toasts */}
      <ToastContainer theme="dark" />

      {/* Success Modal */}
      {showModal && (
        <SuccessModal
          message="Your message has been sent successfully! We’ll get back to you soon."
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Contact;
