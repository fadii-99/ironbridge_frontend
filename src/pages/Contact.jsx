import React, { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCog,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import GradientButton from "./../components/GradientButton";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    partNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Just UI – no backend
    console.log("Form Submitted: ", formData);
  };

  return (
    <section className="flex items-center justify-center min-h-screen px-4 text-white pt-20">
      {/* Form Container centered */}
      <div className="w-full max-w-2xl bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg">
        {/* Heading inside form */}
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
          />
        </div>

        {/* Part Number */}
        <div className="flex items-center px-4 sm:mb-6 mb-4 rounded border border-white/20 bg-black/50">
          <HiOutlineCog className="text-gray-400 mr-3 text-lg" />
          <input
            type="text"
            name="partNumber"
            placeholder="Enter part number"
            value={formData.partNumber}
            onChange={handleChange}
            className="w-full py-4 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
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
          />
        </div>

        {/* Submit Button */}
        <GradientButton label="SEND MESSAGE" onClick={handleSubmit} fullWidth />
      </div>
    </section>
  );
};

export default Contact;
