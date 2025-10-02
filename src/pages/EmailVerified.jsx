import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import GradientButton from "../components/GradientButton"; 
import { useNavigate, useParams } from "react-router-dom";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const EmailVerified = () => {
  const navigate = useNavigate();
  const { uidb64, token } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uidb64 || !token) {
        console.warn("⚠️ Missing uidb64 or token in URL");
        return;
      }

      console.log("🚀 Verifying email with:", uidb64, token);

      try {
        const url = `${serverUrl}/auth/verify-email/${uidb64}/${token}/`;
        console.log("📡 Calling API:", url);

        const res = await fetch(url, { method: "POST" });

        console.log("📥 API Response Status:", res.status);

        if (res.ok) {
          console.log("✅ Email verified successfully from API");
          setVerified(true);
        } else {
          console.error("❌ Verification failed with status:", res.status);
          setVerified(false);
        }
      } catch (err) {
        console.error("🔥 Error during API call:", err);
        setVerified(false);
      } finally {
        console.log("🔄 Finished verification attempt");
        setLoading(false);
      }
    };

    verifyEmail();
  }, [uidb64, token]);

  const handleSignIn = () => navigate("/");
  const handleSignUp = () => navigate("/Signup");

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-gray-300">Verifying your email...</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-6 text-white bg-black">
      <div className="bg-black/70 border border-white/10 rounded-2xl p-10 sm:p-14 max-w-md w-full shadow-lg flex flex-col items-center gap-3">
        {verified ? (
          <>
            {/* ✅ Success */}
            <FaCheckCircle className="text-green-500 sm:text-6xl text-5xl mb-6" />
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Email verified successfully!
            </h1>
            <p className="text-gray-300 sm:text-sm text-xs mb-8">
              Thank you for verifying your email address. <br />
              Your account is now fully activated.
            </p>
            <GradientButton label="Sign in to your account" onClick={handleSignIn} />
          </>
        ) : (
          <>
            {/* ❌ Failure */}
            <FaTimesCircle className="text-red-500 sm:text-6xl text-5xl mb-6" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-red-500 mb-3">
              Email not verified
            </h1>
            <p className="text-gray-300 sm:text-sm text-xs mb-8">
              The verification link is invalid or expired. <br />
              Please sign up again to continue.
            </p>
            <GradientButton label="Go to Sign Up" onClick={handleSignUp} />
          </>
        )}
      </div>
    </section>
  );
};

export default EmailVerified;
