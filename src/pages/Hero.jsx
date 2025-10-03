// Hero.jsx
import React, { useState, useRef } from "react";
import { FaSearch, FaArrowDown } from "react-icons/fa";
import GradientButton from "./../components/GradientButton";
import SmallLoader from "./../components/SmallLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const SEARCH_ENDPOINT = `${serverUrl}/catalog/search/`;

const DEFAULT_PER_PAGE = 10; // 👈 per your requirement

const Hero = () => {
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);

  // pagination state mirrored from backend meta
  const [page, setPage] = useState(1);
  const [perPage] = useState(DEFAULT_PER_PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);

  const resultRef = useRef(null);

  const statusFromMatch = (match_info) => {
    if (!match_info) return "Related";
    if (match_info?.matched_field?.startsWith("primary") && !match_info.is_crossover_match) return "Exact";
    if (match_info?.is_crossover_match) return "Crossover";
    return "Related";
  };

  // 👇 helper to format crossovers array
  const formatCrossovers = (list) => {
    if (!Array.isArray(list) || list.length === 0) return "-";
    return list
      .map((c) => `${c?.brand ?? "-"}: ${c?.part_number ?? "-"}`)
      .join(" • ");
  };

  // core fetcher that respects pagination
  const fetchPage = async (nextPage) => {
    setLoading(true);
    if (!showTable) setShowTable(true);

    // ensure section is visible on any fetch
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 30);

    try {
      const token = localStorage.getItem("Access-Token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(SEARCH_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          partNumber: query,
          page: nextPage,
          per_page: perPage,
        }),
      });

      const payload = await res.json();
      // console.log("🔎 Search API Response:", payload);

      if (!res.ok || payload?.success === false) {
        const msg =
          payload?.error ||
          payload?.message ||
          "Search failed. Please try again.";
        throw new Error(msg);
      }

      const data = Array.isArray(payload?.data) ? payload.data : [];

      // 🔁 map backend → table rows (ADDED extra fields)
      const mapped = data.map((item) => ({
        part: item.part_number || "-",
        desc: item.description || "-",
        cat: item.tool_type || "-",
        status: statusFromMatch(item.match_info),
        manufacturer: item.manufacturer || "-",
        size: item.size || "-",
        finish: item.finish || "-",
        crossovers: formatCrossovers(item.crossovers),
      }));

      setRows(mapped);

      // update pagination from meta
      const meta = payload?.meta || {};
      setPage(meta.page || nextPage || 1);
      setTotalPages(meta.total_pages || 0);
      setCount(typeof payload?.count === "number" ? payload.count : 0);
    } catch (err) {
      // console.error("Search error:", err);
      toast.error(`❌ ${err.message || "Something went wrong"}`);
      // keep table visible with whatever rows were last shown
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("⚠️ Please enter a part number");
      return;
    }
    setRows([]);
    setCount(0);
    setTotalPages(0);
    setPage(1);
    await fetchPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  // range text: “Showing X–Y of Z”
  const startIdx = count === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, count);

  return (
    <>
      {/* Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <section className="flex flex-col items-center justify-center text-center sm:gap-10 gap-7 min-h-screen px-6 text-white md:max-w-[80%] max-w-[95%] mx-auto">
        <h1 className="md:text-7xl text-5xl font-extrabold sm:leading-tight leading-15">
          <span className="text-yellow-300">Industrial</span> Cross Reference
        </h1>

        <p className="md:text-md sm:text-sm text-xs text-gray-300 leading-relaxed">
          A powerful tool to quickly search and reference industrial products. <br />
          Search faster. Cross-reference smarter. Streamline sourcing.
        </p>

        <FaArrowDown className="text-white sm:text-2xl text-lg smooth-float" />

        {/* Search Bar */}
        <div className="w-full xl:max-w-[60%] lg:max-w-[80%]  mx-auto mt-4 flex flex-col items-end gap-3">
          <div className="flex gap-2 w-full">
            <div className="flex items-center flex-1 px-4 rounded border border-white/20 bg-black/50">
              <FaSearch className="text-gray-400 sm:mr-5 mr-3 text-sm" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter part number"
                className="w-full py-4 text-white sm:text-sm text-xs placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            <GradientButton label="SEARCH" onClick={handleSearch} />
          </div>
          <div className="flex flex-row gap-8">
            <label className="md:text-xs text-[11px] text-gray-400 font-light">
              Your Plan : <span className="text-white"> Basic</span>
            </label>
            <label className="md:text-xs text-[11px] text-gray-400 font-light">
              Total Available Searches : <span className="text-white">1</span>
            </label>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {(loading || showTable) && (
        <section
        ref={resultRef}
        className="scroll-mt-28 -mt-40 md:-mt-28 w-full mx-auto sm:max-w-[80%] max-w-[95%] bg-black/80 sm:mb-20 mb-14 border border-white/20 px-6 py-12 text-white flex justify-center"
      >

          <div className="w-full">
            {loading && (
              <div className="flex items-center justify-center sm:h-[40vh] h-[50vh]">
                <SmallLoader size={15} />
              </div>
            )}

            {!loading && showTable && (
              <>
                {/* pagination (same placement as your code) */}
                <div className="mb-14 flex items-center justify-between text-xs sm:text-sm text-gray-300">
                  <div>
                    {count > 0 ? (
                      <span>
                        Showing <span className="text-white">{startIdx}</span>–
                        <span className="text-white">{Math.min(page * perPage, count)}</span> of{" "}
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
                      {totalPages ? <> / <span className="text-white">{totalPages}</span></> : null}
                    </span>
                    <button
                      onClick={() => fetchPage(page + 1)}
                      disabled={totalPages === 0 || page >= totalPages}
                      className={`px-3 py-1 rounded border border-white/20 hover:bg-white/10 transition ${
                        totalPages === 0 || page >= totalPages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>

                {rows.length === 0 ? (
                  <div className="flex items-center justify-center sm:h-[30vh] h-[25vh] text-gray-400 text-sm">
                    No results found. Try a different part number or brand.
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300 border-collapse">
                        <thead>
                          <tr className="border-b border-white/20 text-yellow-300">
                            <th className="p-3 sm:text-sm text-xs text-nowrap">Part No</th>
                            <th className="p-3 sm:text-sm text-xs text-nowrap">Description</th>
                            <th className="p-3 sm:text-sm text-xs text-nowrap">Category</th>
                            <th className="p-3 sm:text-sm text-xs text-nowrap">Status</th>
                            {/* 👇 added columns */}
                            <th className="p-3 sm:text-sm text-xs text-nowrap">Manufacturer</th>
                            <th className="p-3 sm:text-sm text-xs text-nowrap">Size</th>
                            <th className="p-3 sm:text-sm text-xs text-nowrap">Finish</th>
                            <th className="p-3 sm:text-sm text-xs">Crossovers</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, i) => (
                            <tr
                              key={`${row.part}-${i}`}
                              className="border-b border-white/10 hover:bg-white/5 transition"
                            >
                              <td className="p-3 sm:text-sm text-xs text-nowrap">{row.part}</td>
                              <td className="p-3 sm:text-sm text-xs text-nowrap">{row.desc}</td>
                              <td className="p-3 sm:text-sm text-xs text-nowrap">{row.cat}</td>
                              <td className="p-3 sm:text-sm text-xs text-nowrap">{row.status}</td>
                              {/* 👇 added cells */}
                              <td className="p-3 sm:text-sm text-xs text-nowrap">{row.manufacturer}</td>
                              <td className="p-3 sm:text-sm text-xs text-nowrap">{row.size}</td>
                              <td className="p-3 sm:text-sm text-xs text-nowrap">{row.finish}</td>
                              <td className="p-3 sm:text-sm text-xs">{row.crossovers}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
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
