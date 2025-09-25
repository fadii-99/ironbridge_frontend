import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GradientButton from "./../components/GradientButton";
import logo from "./../assets/logo.png";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  // helper: only digits
  const digitsOnly = (s) => s.replace(/\D/g, "");

  const handleChange = (value, idx) => {
    const val = digitsOnly(value);
    if (!val) {
      const next = [...otp];
      next[idx] = "";
      setOtp(next);
      return;
    }

    const chars = val.split("");
    const next = [...otp];

    let writeIndex = idx;
    for (let i = 0; i < chars.length && writeIndex < 6; i++, writeIndex++) {
      next[writeIndex] = chars[i];
    }
    setOtp(next);

    const firstEmpty = next.findIndex((c) => c === "");
    const targetIndex =
      firstEmpty === -1
        ? Math.min(writeIndex - 1, 5)
        : Math.max(idx + 1, Math.min(firstEmpty, 5));

    inputsRef.current[targetIndex]?.focus();
    inputsRef.current[targetIndex]?.select();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        inputsRef.current[idx - 1]?.select();
      }
      return;
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
      inputsRef.current[idx - 1]?.select();
    }
    if (e.key === "ArrowRight" && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
      inputsRef.current[idx + 1]?.select();
    }
  };

  const handlePaste = (e, idx) => {
    e.preventDefault();
    const text = digitsOnly(e.clipboardData.getData("text")).slice(0, 6 - idx);
    if (!text) return;

    const next = [...otp];
    for (let i = 0; i < text.length && idx + i < 6; i++) {
      next[idx + i] = text[i];
    }
    setOtp(next);

    const lastIndex = Math.min(idx + text.length - 1, 5);
    inputsRef.current[lastIndex]?.focus();
    inputsRef.current[lastIndex]?.select();
  };

  const handleVerify = () => {
    // abhi sirf UI -> navigate karega
    navigate("/CreatePassword");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md bg-black/80 border border-white/20 p-8 rounded-xl shadow-lg text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="website-logo" className="h-auto w-[8rem]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-8">Enter Verification Code</h2>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3 mb-12">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              className="w-12 h-12 text-center text-lg font-semibold 
                         rounded-lg bg-black/50 border border-white/20 outline-none 
                         focus:border-yellow-400"
            />
          ))}
        </div>

        {/* Verify Button */}
        <GradientButton label="VERIFY OTP" onClick={handleVerify} fullWidth />
      </div>
    </div>
  );
};

export default VerifyOTP;
