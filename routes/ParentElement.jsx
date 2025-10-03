import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./../src/components/Navbar";
import { useUser } from "../src/context/UserProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollTopFab from "./../src/components/ScrollTopFab";

const ParentElement = () => {
  const { user, reloadUser } = useUser();

  const handleResend = async () => {
    try {
      const token = localStorage.getItem("Access-Token");
      if (!token) return;

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/resend-verification/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      // console.log("Resend data", data);

      if (res.ok) {
        toast.success(
          data?.message || "Verification email sent successfully.",
          { theme: "dark" }
        );
        await reloadUser();
      } else {
        toast.error(data?.error || "Failed to resend verification link.", {
          theme: "dark",
        });
      }
    } catch (err) {
      console.error("Resend verification error:", err);
      toast.error("Network error. Try again later.", { theme: "dark" });
    }
  };

  return (
    <div className="w-full min-h-screen">
      <Navbar />

      {user && user.user.is_verified === false && (
        <div className="fixed top-[5rem] left-0 w-full z-40 bg-orange-500 text-white px-6 py-3 flex items-center justify-around text-sm shadow-md">
          <span className="flex items-center gap-2">
            ⚠️ Email verification required. Check inbox or resend link.
          </span>
          <button
            onClick={handleResend}
            className="bg-white text-orange-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition cursor-pointer"
          >
            Resend
          </button>
        </div>
      )}

      <div>
        <Outlet />
      </div>

      {/* 👇 Always available; shows only after small scroll */}
      <ScrollTopFab threshold={200} />
    </div>
  );
};

export default ParentElement;
