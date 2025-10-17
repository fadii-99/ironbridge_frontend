import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi"; // ▼ dropdown icon
import GradientButton from "./../components/GradientButton";
import SmallLoader from "./../components/SmallLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./../context/UserProvider";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const SEARCH_ENDPOINT = `${serverUrl}/catalog/search/`;
const MANUFACTURER_LIST_ENDPOINT = `${serverUrl}/catalog/manufacturer_list/`;
const DEFAULT_PER_PAGE = 10;

const Hero = () => {
  const { user, reloadUser } = useUser();

  // dropdown + list
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");

  // loading/UI
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // search & data
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);

  // pagination
  const [page, setPage] = useState(1);
  const [perPage] = useState(DEFAULT_PER_PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);

  // expanded cell state
  const [expandedCells, setExpandedCells] = useState({});

  const resultRef = useRef(null);

  const planName = user?.user?.plan_name ?? "—";
  const availableSearches =
    typeof user?.user?.searches_limit === "number"
      ? user.user.searches_limit
      : "—";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch manufacturer list (POST) once
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const token = localStorage.getItem("Access-Token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const res = await fetch(MANUFACTURER_LIST_ENDPOINT, {
          method: "GET",
          headers,
        });
        const payload = await res.json();
        // console.log('Manufacturer list', payload);

        const list =
          payload?.data?.manufacturers ??
          payload?.manufacturers ??
          payload?.data ??
          [];

        const clean = (Array.isArray(list) ? list : []).filter(Boolean);
        setManufacturers(clean);
        if (clean.length > 0) setSelectedManufacturer(clean[0]); // auto-select first
      } catch (err) {
        toast.error("Failed to load manufacturers.");
      }
    };

    fetchManufacturers();
  }, []);

  const toggleExpand = (rowIndex, key) => {
    const cellId = `${rowIndex}-${key}`;
    setExpandedCells((prev) => ({ ...prev, [cellId]: !prev[cellId] }));
  };

  const fetchPage = async (nextPage) => {
    setLoading(true);
    if (!showTable) setShowTable(true);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 30);

    try {
      const token = localStorage.getItem("Access-Token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

            const params = new URLSearchParams({
              type: selectedManufacturer,
              q: query.trim(),
              page: String(nextPage),
              page_size: String(perPage),
            });

            const url = `${SEARCH_ENDPOINT}?${params.toString()}`;


      const res = await fetch(url.toString(), { method: "GET", headers });
      const payload = await res.json();

      if (!res.ok || payload?.success === false) {
        throw new Error(payload?.message || "Search failed. Please try again.");
      }

      const dataArray = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data?.results)
        ? payload.data.results
        : [];

      setRows(dataArray);
      setPage(nextPage || 1);
      setTotalPages(payload?.data?.pages || 0);
      setCount(payload?.data?.count || dataArray.length || 0);

      await reloadUser();
    } catch (err) {
      toast.error(`❌ ${err?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedManufacturer) {
      return toast.error("Please select a manufacturer.");
    }
    if (!query.trim()) {
      return toast.error("Please enter a part number.");
    }
    
    // Check for SQL injection patterns or suspicious query formats
    const suspiciousPatterns = [
      /=/,  // Contains equals sign
      /;/,  // Contains semicolon
      /'/,  // Contains single quote
      /"/,  // Contains double quote
      /--/, // Contains SQL comment
      /\/\*/, // Contains SQL comment start
      /\*\//, // Contains SQL comment end
      /union/i, // Contains UNION keyword
      /select/i, // Contains SELECT keyword
      /insert/i, // Contains INSERT keyword
      /delete/i, // Contains DELETE keyword
      /update/i, // Contains UPDATE keyword
      /drop/i, // Contains DROP keyword
    ];
    
    const hasInvalidPattern = suspiciousPatterns.some(pattern => pattern.test(query.trim()));
    
    if (hasInvalidPattern) {
      return toast.error("Invalid characters detected in part number. Please enter a valid part number.");
    }
    
    setRows([]);
    setCount(0);
    setTotalPages(0);
    setPage(1);
    await fetchPage(1);
  };

  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;
  const startIdx = count === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, count);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* Slim scrollbar styles for the dropdown */}
      <style>{`
        .thin-scroll {
          scrollbar-width: thin;
          scrollbar-color: #555 transparent;
        }
        .thin-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .thin-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #2a2a2a, #555);
          border-radius: 10px;
        }
        .thin-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #444, #777);
        }
        .thin-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center sm:gap-10 gap-7 min-h-screen px-6 text-white md:max-w-[80%] max-w-[95%] mx-auto">
        <h1 className="md:text-7xl text-5xl font-extrabold sm:leading-tight leading-15">
          <span className="text-yellow-300">Industrial</span> Cross Reference
        </h1>
        <p className="md:text-md sm:text-sm text-xs text-gray-300 leading-relaxed">
          A powerful tool to quickly search and reference industrial products. <br />
          Search faster. Cross-reference smarter. Streamline sourcing.
        </p>

        {/* Search bar */}
        <div className="w-full xl:max-w-[60%] lg:max-w-[80%] mx-auto mt-4 flex flex-col items-end gap-3">
          <div className="flex flex-row gap-8 items-center">
            <label className="md:text-xs text-[11px] text-gray-400 font-light">
              Your Plan : <span className="text-white ml-1">{planName}</span>
            </label>
            <label className="md:text-xs text-[11px] text-gray-400 font-light">
              Available Searches :{" "}
              <span className="text-white ml-1">{availableSearches}</span>
            </label>
          </div>

          <div className="flex gap-2 w-full flex-col sm:flex-row">
            {/* Left: custom dropdown + part number input */}
            <div className="flex items-center justify-between flex-1 px-4 rounded border border-white/20 bg-black/50 relative">
              {/* Manufacturer dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm font-light py-4 focus:outline-none text-nowrap"
                  disabled={manufacturers.length === 0}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  {selectedManufacturer || "Select manufacturer"}
                  <HiChevronDown
                    className={`text-base transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-1 w-64 bg-black border border-white/20 rounded shadow-lg z-10 thin-scroll overflow-auto"
                    style={{
                      maxHeight: manufacturers.length > 4 ? "176px" : "auto",
                    }}
                  >
                    {manufacturers.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-gray-400">
                        Loading manufacturers…
                      </div>
                    ) : (
                      manufacturers.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setSelectedManufacturer(m);
                            setDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-white/10 ${
                            selectedManufacturer === m
                              ? "text-yellow-300"
                              : "text-gray-300"
                          }`}
                        >
                          {m}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-white/20 mx-3" />

              {/* Part number input */}
              <div className="flex items-center flex-1">
                <FaSearch className="text-gray-400 sm:mr-3 mr-2 text-sm" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Enter part number"
                  className="w-full py-4 text-white sm:text-sm text-xs placeholder-gray-400 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Search Button */}
            <GradientButton
              label={loading ? "SEARCHING..." : "SEARCH"}
              onClick={handleSearch}
              disabled={loading}
            />
          </div>

          <p className="text-[11px] text-gray-400 font-light text-center">
            <span className="text-white font-semibold">Disclaimer:</span> All brand names,
            logos, and part numbers are the property of their respective owners. IronBridge
            provides cross-reference data for informational and sourcing purposes only and
            is not endorsed or sponsored by any manufacturer.
          </p>
        </div>
      </section>

      {/* RESULTS */}
      {(loading || showTable) && (
        <section
          ref={resultRef}
          className="scroll-mt-28 -mt-20 md:-mt-28 w-full mx-auto sm:max-w-[80%] max-w-[95%] bg-black/80 sm:mb-20 mb-14 border border-white/20 px-6 py-12 text-white flex justify-center"
        >
          <div className="w-full">
            {loading ? (
              <div className="flex items-center justify-center sm:h-[40vh] h-[50vh]">
                <SmallLoader size={15} />
              </div>
            ) : (
              <>
                <div className="mb-14 flex items-center justify-between text-xs sm:text-sm text-gray-300">
                  <div>
                    {count > 0 ? (
                      <span>
                        Showing <span className="text-white">{startIdx}</span>–
                        <span className="text-white">{endIdx}</span> of{" "}
                        <span className="text-white">{count}</span>
                      </span>
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchPage(page - 1)}
                      disabled={page <= 1}
                      className={`px-3 py-1 rounded border border-white/20 hover:bg-white/10 transition ${
                        page <= 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Prev
                    </button>
                    <span className="px-2">
                      Page <span className="text-white">{page}</span>
                      {totalPages ? (
                        <> / <span className="text-white">{totalPages}</span></>
                      ) : null}
                    </span>
                    <button
                      onClick={() => fetchPage(page + 1)}
                      disabled={page >= totalPages}
                      className={`px-3 py-1 rounded border border-white/20 hover:bg-white/10 transition ${
                        page >= totalPages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>

                {rows.length === 0 ? (
                  <div className="flex items-center justify-center sm:h-[30vh] h-[25vh] text-gray-400 text-sm">
                    No results found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300 border-collapse">
                      <thead>
                        <tr className="border-b border-white/20 text-yellow-300">
                          {Object.keys(rows[0]).map((key) => (
                            <th
                              key={key}
                              className="p-3 sm:text-sm text-xs capitalize whitespace-nowrap"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className="border-b border-white/10 hover:bg-white/5 transition align-top"
                          >
                            {Object.keys(row).map((key, colIndex) => {
                              const value = row[key] ?? "-";
                              const isLong =
                                typeof value === "string" && value.length > 70;
                              const cellId = `${rowIndex}-${key}`;
                              const expanded = expandedCells[cellId];

                              return (
                                <td
                                  key={colIndex}
                                  className="p-3 sm:text-sm text-xs whitespace-pre-wrap break-words max-w-[300px]"
                                >
                                  {isLong ? (
                                    <>
                                      {expanded ? value : `${value.slice(0, 70)}... `}
                                      <button
                                        onClick={() => toggleExpand(rowIndex, key)}
                                        className="text-yellow-300 underline hover:text-yellow-400 text-[11px]"
                                      >
                                        {expanded ? "see less" : "see more"}
                                      </button>
                                    </>
                                  ) : (
                                    value
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Hero;
