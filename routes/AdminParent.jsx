import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import AdminSidebar from "../src/components/AdminSIdebar";

const AdminParent = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Future: auth clear
    navigate("/"); // abhi direct login page
  };

  return (
    <div className="flex min-h-screen text-white">
      {/* Sidebar */}
      <AdminSidebar open={open} onLinkClick={() => setOpen(false)} />

      {/* Topbar (mobile/md only) */}
      <div className="lg:hidden fixed top-0 left-0 w-full flex items-center justify-between bg-black/80 px-4 py-3 z-50">
        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="bg-black/70 p-2 rounded"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logout (right side) */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
        >
          <FiLogOut className="text-lg" />
        </button>
      </div>

      {/* Content Area */}
      <main
        className="
          flex-1 p-6 
          lg:ml-64   /* 👈 sidebar ke width ke barabar margin */
          transition-all duration-300
          md:mt-14  /* 👈 mobile topbar ke liye niche push */
      "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminParent;
