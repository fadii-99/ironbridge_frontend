import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle, FaTrashAlt, FaIdBadge } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import logo from "./../assets/logo.png";
import { useUser } from "./../context/UserProvider";
import DeleteAccountModal from "./DeleteAccount";
import ViewProfileModal from "./ViewProfileModal";
import GradientButton from "./GradientButton";
import SmallLoader from "./SmallLoader"; // 👈 3-dot loader

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const { user, setUser, loading } = useUser();

  const hasToken = Boolean(localStorage.getItem("Access-Token"));
  const isAuthed = hasToken && Boolean(user?.user);

  // 🔄 stages: loading (has token + context loading), authed, guest
  const authStage = hasToken && loading ? "loading" : isAuthed ? "authed" : "guest";

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

  // close menus on route change
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("Access-Token");
    setUser(null);
    setOpen(false);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const linkClasses = ({ isActive }) =>
    `transition text-sm font-light ${
      isActive ? "text-yellow-300" : "opacity-80 hover:text-yellow-300"
    }`;

  const NavItem = ({ to, label, disabled = false, exact = false, onClick }) => {
    if (disabled) {
      return (
        <span
          title="Login to access"
          className="text-sm font-light opacity-50 cursor-not-allowed select-none"
          onClick={(e) => e.preventDefault()}
        >
          {label}
        </span>
      );
    }
    return (
      <NavLink to={to} end={exact} className={linkClasses} onClick={onClick}>
        {label}
      </NavLink>
    );
  };

  const closeMenu = () => setMenuOpen(false);
  const disableProtectedLinks = authStage !== "authed";

  return (
    <>
      <nav
        className={`fixed flex items-center justify-between px-6 py-4 w-full z-50 
        transition-colors duration-500 ease-in-out
        ${scrolled ? "bg-black/90 shadow-lg" : "bg-transparent shadow-none"} text-white`}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="website-logo" className="h-auto w-[5.5rem]" />
        </div>

        {/* Mid: Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          <li>
            <NavItem to="/Home" label="Home" disabled={disableProtectedLinks} exact />
          </li>
          <li>
            <NavItem to="/Subscription" label="Subscription" />
          </li>
          <li>
            <NavItem to="/Contact" label="Contact us" /> {/* ✅ Now public */}
          </li>
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded hover:bg-white/10 transition"
            aria-label="Menu"
          >
            {menuOpen ? <HiX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
          </button>

          {/* Desktop right section */}
          {authStage === "loading" ? (
            // ⏳ show loader
            <div className="hidden md:block w-16">
              <SmallLoader size={4} />
            </div>
          ) : authStage === "authed" ? (
            // 👤 profile dropdown
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-300/10 transition"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <FaUserCircle className="text-white text-2xl" />
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-3 w-64 bg-black/80 text-gray-200 shadow-2xl rounded-xl p-3 z-50 border border-white/20 backdrop-blur"
                  role="menu"
                >
                  <div className="px-3 py-2">
                    <div className="text-md font-medium">{user?.user?.full_name || "User"}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{user?.user?.email || ""}</div>
                  </div>

                  <div className="h-px bg-white/10 my-2" />

                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center gap-3 px-4 py-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition cursor-pointer w-full"
                  >
                    <FaIdBadge className="text-[14px]" />
                    <span className="text-sm">View Profile</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-600/20 rounded-lg transition cursor-pointer w-full"
                  >
                    <FaTrashAlt className="text-[14px]" />
                    <span className="text-sm">Delete Account</span>
                  </button>

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
          ) : (
            // 🔓 guest — show Login
            <div className="hidden md:block">
              <GradientButton label="Login" onClick={() => navigate("/")} />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 text-white md:hidden shadow-lg border-t border-white/10">
            <ul className="flex flex-col px-6 py-4 space-y-4 text-sm font-medium">
              {authStage === "loading" && (
                <li className="py-1">
                  <SmallLoader size={5} />
                </li>
              )}

              <li>
                {authStage === "authed" ? (
                  <NavLink to="/Home" end className={linkClasses} onClick={closeMenu}>
                    Home
                  </NavLink>
                ) : (
                  <span className="opacity-50 cursor-not-allowed select-none">Home</span>
                )}
              </li>

              <li>
                <NavLink to="/Subscription" className={linkClasses} onClick={closeMenu}>
                  Subscription
                </NavLink>
              </li>

              <li>
                <NavLink to="/Contact" className={linkClasses} onClick={closeMenu}>
                  Contact us
                </NavLink>
              </li>

              {authStage === "guest" ? (
                <div className="pt-2">
                  <GradientButton
                    label="Login"
                    fullWidth
                    onClick={() => {
                      closeMenu();
                      navigate("/");
                    }}
                  />
                </div>
              ) : authStage === "authed" ? (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="w-full px-4 py-3 rounded bg-white/10 hover:bg-white/20 transition text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
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
