import React, { useState, useRef } from "react";
import { FaSearch, FaArrowDown } from "react-icons/fa";
import GradientButton from "./../components/GradientButton";
import PulseLoader from "react-spinners/PulseLoader"; // 👈 3 dots loader

const Hero = () => {
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const resultRef = useRef(null);

  const handleSearch = () => {
    setLoading(true);
    setShowTable(false);

    // scroll into view immediately
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // simulate loading for 3s
    setTimeout(() => {
      setLoading(false);
      setShowTable(true);
    }, 3000);
  };

  return (
    <>
      {/* Hero Section - always center of screen */}
      <section className="flex flex-col items-center justify-center text-center sm:gap-10 gap-7 min-h-screen px-6 text-white md:max-w-[80%] max-w-[95%] mx-auto">
        {/* Heading */}
        <h1 className="md:text-7xl text-5xl font-extrabold sm:leading-tight leading-15">
          <span className="text-yellow-300">Industrial</span> Cross Reference
        </h1>

        {/* Paragraph */}
        <p className="md:text-md sm:text-sm text-xs text-gray-300 leading-relaxed">
         A powerful tool to quickly search and reference industrial products. <br />
         Search faster. Cross-reference smarter. Streamline sourcing
        </p>

        {/* 👇 Animated Downward Arrow */}
        <FaArrowDown className="text-white sm:text-2xl text-lg smooth-float" />

        {/* Search Bar */}
        <div className="w-full xl:max-w-[60%] lg:max-w-[80%]  mx-auto mt-4 flex flex-col items-end gap-3">
          <div className="flex gap-2 w-full">
            {/* Input with icon */}
            <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50">
              <FaSearch className="text-gray-400 sm:mr-5 mr-3 text-sm" />
              <input
                type="text"
                placeholder="Enter parts number"
                className="w-full py-4 text-white sm:text-sm text-xs placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            {/* Gradient Button reuse */}
            <GradientButton label="SEARCH" onClick={handleSearch} />
          </div>
          <div className="flex flex-row gap-8">
            <label className="md:text-xs text-[11px] text-gray-400 font-light">
              Your Plan : <span className="text-white"> Basic</span>
            </label>
            <label className="md:text-xs text-[11px] text-gray-400 font-light">
              Total Available Searches : <span className="text-white">500</span>
            </label>
          </div>
        </div>
      </section>

      {/* Results Section - appears below hero */}
      {(loading || showTable) && (
        <section
          ref={resultRef}
          className="w-full mx-auto sm:max-w-[80%] max-w-[95%] bg-black/80 sm:mb-20 mb-14 border border-white/20 px-6 py-12 text-white flex justify-center"
        >
          <div className="w-full">
            {loading && (
              <div className="flex items-center justify-center sm:h-[40vh] h-[50vh]">
                <PulseLoader color="#ffffff" size={15} />
              </div>
            )}

            {showTable && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300 border-collapse">
                  <thead>
                    <tr className="border-b border-white/20 text-yellow-300">
                      <th className="p-3 sm:text-sm text-xs text-nowrap">Part No</th>
                      <th className="p-3 sm:text-sm text-xs text-nowrap">Description</th>
                      <th className="p-3 sm:text-sm text-xs text-nowrap">Category</th>
                      <th className="p-3 sm:text-sm text-xs text-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { part: "IND-101", desc: "Gear Assembly", cat: "Mechanical", status: "Available" },
                      { part: "IND-205", desc: "Hydraulic Pump", cat: "Hydraulics", status: "Out of Stock" },
                      { part: "IND-330", desc: "Circuit Board", cat: "Electrical", status: "Available" },
                      { part: "IND-411", desc: "Control Valve", cat: "Hydraulics", status: "Available" },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="p-3 sm:text-sm text-xs text-nowrap">{row.part}</td>
                        <td className="p-3 sm:text-sm text-xs text-nowrap">{row.desc}</td>
                        <td className="p-3 sm:text-sm text-xs text-nowrap">{row.cat}</td>
                        <td className="p-3 sm:text-sm text-xs text-nowrap">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Hero;
