import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import navigate
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import logo from "./../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); // 👈 hook use kiya

  // scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // future me auth clear karna hoga
    navigate("/"); // 👈 abhi login page pe redirect karega
  };

  return (
    <nav
      className={`fixed flex items-center justify-between px-6 py-4 w-full z-50 
      transition-colors duration-500 ease-in-out
      ${scrolled ? "bg-black/90 shadow-lg" : "bg-transparent shadow-none"} text-white`}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="website-logo" className="h-auto w-[4rem]" />
      </div>

      {/* Mid: Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
        <li>
          <a href="#" className="hover:text-yellow-300 transition text-sm font-light opacity-80">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-300 transition text-sm font-light opacity-80">
            Subscription
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-300 transition text-sm font-light opacity-80">
            Link
          </a>
        </li>
      </ul>

      {/* Right: Hamburger (mobile) + Profile */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded hover:bg-white/10 transition"
        >
          {menuOpen ? <HiX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-300/10 transition"
          >
            <FaUserCircle className="text-white text-2xl" />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-black/80 text-gray-200 shadow-2xl rounded-xl p-3 z-50 border border-white/20">
              {/* Name + occupation */}
              <div className="px-3 py-2">
                <div className="text-md font-medium">Usama Kamran</div>
                <div className="text-[11px] text-gray-400 mt-1">Electrician</div>
              </div>

              <div className="h-px bg-white/10 my-2" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-200/10 rounded-lg transition cursor-pointer w-full"
              >
                <FiLogOut className="text-lg" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 text-white md:hidden shadow-lg">
          <ul className="flex flex-col px-6 py-4 space-y-3 text-sm font-medium">
            <li>
              <a href="#" className="block hover:text-yellow-300 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-yellow-300 transition">
                Subscription
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-yellow-300 transition">
                Link
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
