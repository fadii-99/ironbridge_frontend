import React, { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi";

const ScrollTopFab = ({ threshold = 200 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > threshold;
          setVisible(shouldShow);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // initial check (e.g., on refresh somewhere in middle of page)
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50
        rounded-full p-3 sm:p-4 shadow-lg
        bg-gradient-to-r from-yellow-400 to-yellow-600 text-black
        hover:from-yellow-300 hover:to-yellow-500
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
        focus:outline-none focus:ring-2 focus:ring-yellow-400/70`}
    >
      <HiArrowUp className="text-xl sm:text-2xl" />
      <span className="sr-only">Back to top</span>
    </button>
  );
};

export default ScrollTopFab;
