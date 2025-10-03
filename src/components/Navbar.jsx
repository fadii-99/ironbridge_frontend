// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle, FaTrashAlt, FaIdBadge } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import logo from "./../assets/logo.png";
import { useUser } from "./../context/UserProvider";
import DeleteAccountModal from "./DeleteAccount";
import ViewProfileModal from "./ViewProfileModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // 👈 NEW
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("Access-Token");
    navigate("/");
  };

  const linkClasses = ({ isActive }) =>
    `transition text-sm font-light ${isActive ? "text-yellow-300" : "opacity-80 hover:text-yellow-300"}`;

  return (
    <>
      <nav
        className={`fixed flex items-center justify-between px-6 py-4 w-full z-50 
        transition-colors duration-500 ease-in-out
        ${scrolled ? "bg-black/90 shadow-lg" : "bg-transparent shadow-none"} text-white`}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="website-logo" className="h-auto w-[5.5rem]" />
        </div>

        {/* Mid: Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          <li>
            <NavLink to="/Home" end className={linkClasses}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/Home/Subscription" className={linkClasses}>Subscription</NavLink>
          </li>
          <li>
            <NavLink to="/Home/Contact" className={linkClasses}>Contact us</NavLink>
          </li>
        </ul>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded hover:bg-white/10 transition"
          >
            {menuOpen ? <HiX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-300/10 transition"
            >
              <FaUserCircle className="text-white text-2xl" />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-64 bg-black/80 text-gray-200 shadow-2xl rounded-xl p-3 z-50 border border-white/20">
                {/* Name + Email */}
                <div className="px-3 py-2">
                  <div className="text-md font-medium">{user?.user?.full_name || "Guest User"}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{user?.user?.email || "guest@example.com"}</div>
                </div>

                <div className="h-px bg-white/10 my-2" />

                {/* View Profile (modal) */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-3 px-4 py-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition cursor-pointer w-full"
                >
                  <FaIdBadge className="text-[14px]" />
                  <span className="text-sm">View Profile</span>
                </button>

                {/* Delete Account */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-600/20 rounded-lg transition cursor-pointer w-full"
                >
                  <FaTrashAlt className="text-[14px]" />
                  <span className="text-sm">Delete Account</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition cursor-pointer w-full"
                >
                  <FiLogOut className="text-[14px]" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 text-white md:hidden shadow-lg">
            <ul className="flex flex-col px-6 py-4 space-y-3 text-sm font-medium">
              <li><NavLink to="/Home" end className={linkClasses} onClick={() => setMenuOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/Home/Subscription" className={linkClasses} onClick={() => setMenuOpen(false)}>Subscription</NavLink></li>
              <li><NavLink to="/Home/Contact" className={linkClasses} onClick={() => setMenuOpen(false)}>Contact us</NavLink></li>
            </ul>
          </div>
        )}
      </nav>

      {/* Modals */}
      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
      {showProfileModal && <ViewProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
}
