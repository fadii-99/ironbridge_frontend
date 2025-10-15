import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineCube,
  HiOutlineChartBar,
} from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

const AdminSidebar = ({ open, onLinkClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('AdminToken');
    navigate("/AdminLogin");
  };

  return (
    <aside
      className={`md:bg-black/80 bg-black border-r border-white/20 w-64 fixed inset-y-0 left-0 transform
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 z-40 
        flex flex-col justify-between h-dvh`}
    >
      {/* Top Section */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Brand */}
        <h2 className="text-xl font-bold mb-12 w-full text-center">
          Admin Panel
        </h2>

        {/* Nav Links */}
        <nav className="space-y-4">
          <NavLink
            to="/admin"
            end
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded 
               ${
                 isActive
                   ? "bg-yellow-400/20 text-yellow-300"
                   : "hover:bg-white/10"
               }`
            }
          >
            <HiOutlineHome className="text-lg" />
            Dashboard
          </NavLink>

          {/* <NavLink
            to="/admin/analytics"
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded 
               ${
                 isActive
                   ? "bg-yellow-400/20 text-yellow-300"
                   : "hover:bg-white/10"
               }`
            }
          >
            <HiOutlineChartBar className="text-lg" />
            Analytics
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded 
               ${
                 isActive
                   ? "bg-yellow-400/20 text-yellow-300"
                   : "hover:bg-white/10"
               }`
            }
          >
            <HiOutlineUserGroup className="text-lg" />
            Users
          </NavLink> */}

          <NavLink
            to="/admin/parts"
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded 
               ${
                 isActive
                   ? "bg-yellow-400/20 text-yellow-300"
                   : "hover:bg-white/10"
               }`
            }
          >
            <HiOutlineCube className="text-lg" />
            Parts
          </NavLink>
        </nav>
      </div>

      {/* Bottom Logout - only lg screens */}
      <div className="p-6 border-t border-white/10 hidden lg:block">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 w-full rounded text-red-400 hover:bg-white/10 transition"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
