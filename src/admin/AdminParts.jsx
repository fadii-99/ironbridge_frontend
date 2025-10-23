import React, { useEffect, useState } from "react";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCloudUpload,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSearch,
} from "react-icons/hi";
import GradientButton from "./../components/GradientButton";
import SmallLoader from "./../components/SmallLoader";
import EditPartModal from "./../components/EditPartModal";
import DeletePartModal from "./../components/DeletePartModal";
import UnauthorizedAdminModal from "./../components/UnauthorizedAdminModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const AdminParts = () => {
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [columns, setColumns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const [editPart, setEditPart] = useState(null);
  const [deletePart, setDeletePart] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // search
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // auth
  const token = localStorage.getItem("AdminToken");
  if (!token) return <UnauthorizedAdminModal />;

  // fetch
  const fetchParts = async (pageNumber = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
      
      // Build URL with search parameter if provided
      let url = `${serverUrl}/admin/parts/?page=${pageNumber}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      
      const res = await fetch(url, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (!res.ok || !data?.data?.results) {
        toast.error("Failed to load parts");
        setParts([]);
        setFilteredParts([]);
        return;
      }

      const rows = data.data.results || [];
      setParts(rows);
      setFilteredParts(rows);
      setColumns(data.data.columns || Object.keys(rows[0] || {}));
      setTotalPages(data.data.pages || 1);
      setTotalCount(data.data.count || 0);
      setPage(data.data.page || 1);
    } catch (err) {
      console.error("❌ Error fetching parts:", err);
      toast.error("Error fetching parts");
      setParts([]);
      setFilteredParts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load only
  useEffect(() => {
    fetchParts(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchParts(1, searchTerm); // Reset to page 1 when searching
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // upload
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${serverUrl}/admin/upload-data/`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Upload failed");

      toast.success("File uploaded successfully!");
      setFile(null);
      setModalOpen(false);
      fetchParts(page, searchTerm);
    } catch (err) {
      console.error("❌ Upload Error:", err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFileLoading(true);
    setTimeout(() => {
      setFile(selected);
      setFileLoading(false);
    }, 400);
  };

  const removeFile = () => setFile(null);
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") setModalOpen(false);
  };

  // pagination handlers
  const goToPrev = () => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    fetchParts(newPage, searchTerm);
  };
  const goToNext = () => {
    const newPage = Math.min(totalPages, page + 1);
    setPage(newPage);
    fetchParts(newPage, searchTerm);
  };


  return (
    <div className="md:mt-0 mt-16">
      {/* slim scrollbars + prevent header wrapping */}
      <style>{`
        .scroll-x::-webkit-scrollbar{ height:8px }
        .scroll-x::-webkit-scrollbar-thumb{ background:#4b5563; border-radius:9999px }
        .scroll-x{ scrollbar-width:thin; scrollbar-color:#4b5563 transparent }

        .scroll-y::-webkit-scrollbar{ width:8px }
        .scroll-y::-webkit-scrollbar-thumb{ background:#4b5563; border-radius:9999px }
        .scroll-y{ scrollbar-width:thin; scrollbar-color:#4b5563 transparent }
      `}</style>

      {/* header row */}
      <div className="flex items-center justify-between mb-4 px-3 sm:px-0">
        <h1 className="text-2xl font-bold">Parts</h1>
        <GradientButton label="+ Add Part" onClick={() => setModalOpen(true)} />
      </div>

      {/* total + search */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start my-4 text-gray-300 gap-3 px-3 sm:px-0">
        <div className="text-sm text-gray-400">
          Total Parts: <span className="text-yellow-400 font-semibold">{totalCount}</span>
        </div>
        <div className="flex items-center bg-black/50 border border-white/20 rounded-lg px-3 py-2 w-full sm:w-[300px]">
          <HiOutlineSearch className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* table */}
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <SmallLoader />
        </div>
      ) : filteredParts.length === 0 ? (
        <div className="flex items-center justify-center h-[40vh] text-gray-400">No parts found.</div>
      ) : (
        <div className="rounded-lg border border-white/10">
          {/* 
            OUTER: horizontal scroll for small screens (header + body move together)
            INNER: vertical scroll for body with sticky header
          */}
          <div className="">
            <div className="max-h-[65vh] max-w-[100vw] scroll-x overflow-x-auto">
              <table className="w-full text-sm text-gray-200">
                <thead className="sticky top-0 z-10 bg-black/85 backdrop-blur">
                  <tr className="border-b border-white/10">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 text-left text-yellow-300 uppercase text-[12px] font-semibold whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-left text-[12px] text-yellow-300 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredParts.map((part, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      {columns.map((col) => {
                        const value = part[col];
                        const isEmpty =
                          value === null ||
                          value === undefined ||
                          (typeof value === "string" && value.trim() === "");

                        // make long columns truncate so they don't grow tall
                        const longCol = ["DESCRIPTION", "CROSSOVERS", "DISTRIBUTOR INFO"].includes(col);

                        return (
                          <td
                            key={col}
                            className={`px-3 py-2 align-top text-[13px] whitespace-nowrap ${
                              isEmpty ? "text-red-400 font-semibold" : ""
                            }`}
                            title={isEmpty ? "-" : String(value)}
                          >
                            {isEmpty ? (
                              "-"
                            ) : (
                              <span className={`inline-block ${longCol ? "max-w-[280px]" : "max-w-[180px]"} truncate`}>
                                {String(value)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex gap-3 items-center">
                          <button
                            className="text-blue-400 hover:text-blue-300"
                            title="Edit"
                            onClick={() => setEditPart(part)}
                          >
                            <HiOutlinePencil className="text-lg" />
                          </button>
                          <button
                            className="text-red-400 hover:text-red-300"
                            title="Delete"
                            onClick={() => setDeletePart(part)}
                          >
                            <HiOutlineTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* pagination */}
      {!loading && filteredParts.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6 text-gray-300">
          <button
            onClick={goToPrev}
            disabled={page === 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-md border border-white/10 hover:bg-white/10 transition ${
              page === 1 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <HiOutlineChevronLeft />
            Prev
          </button>

          <span className="text-sm">
            Page <span className="text-yellow-400">{page}</span> of{" "}
            <span className="text-yellow-400">{totalPages}</span>
          </span>

          <button
            onClick={goToNext}
            disabled={page === totalPages}
            className={`flex items-center gap-1 px-4 py-2 rounded-md border border-white/10 hover:bg-white/10 transition ${
              page === totalPages ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            Next
            <HiOutlineChevronRight />
          </button>
        </div>
      )}

      {/* upload modal */}
      {modalOpen && (
        <div
          id="modal-overlay"
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-[#111] border border-white/20 rounded-2xl shadow-2xl w-[92%] max-w-md p-6 sm:p-8 relative text-center">
            <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white">
              <HiOutlineX size={20} />
            </button>

            <div className="border-2 border-dashed border-white/20 rounded-2xl py-8 sm:py-10 flex flex-col items-center justify-center bg-black/40 hover:bg-black/60 transition mt-2 mb-6">
              <HiOutlineCloudUpload className="text-yellow-300 text-5xl mb-4" />
              <p className="text-gray-300 font-medium">Choose a file to upload</p>
              <p className="text-xs text-gray-500 mt-1">.csv or .xlsx formats</p>

              {fileLoading ? (
                <div className="mt-5">
                  <SmallLoader size={10} />
                </div>
              ) : (
                <label className="mt-5 cursor-pointer bg-gradient-to-r from-yellow-400 to-yellow-500 hover:opacity-90 text-black px-5 py-2 rounded-lg font-semibold text-sm transition">
                  Browse File
                  <input type="file" accept=".csv, .xlsx" className="hidden" onChange={handleFileSelect} />
                </label>
              )}
            </div>

            {file && (
              <div className="mt-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <HiOutlineCloudUpload className="text-yellow-400 text-lg" />
                  <span className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</span>
                </div>
                <button onClick={removeFile} className="text-gray-400 hover:text-red-400 transition">
                  <HiOutlineX size={18} />
                </button>
              </div>
            )}

            <GradientButton
              label={uploading ? "UPLOADING..." : "UPLOAD"}
              onClick={handleUpload}
              disabled={!file || uploading}
              fullWidth
              className={`mt-6 ${!file ? "opacity-40 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>
      )}

      {/* modals */}
      {editPart && (
        <EditPartModal part={editPart} onClose={() => setEditPart(null)} onSuccess={() => fetchParts(page, searchTerm)} />
      )}
      {deletePart && (
        <DeletePartModal part={deletePart} onClose={() => setDeletePart(null)} onSuccess={() => fetchParts(page, searchTerm)} />
      )}

      <ToastContainer position="top-right" theme="dark" autoClose={2500} />
    </div>
  );
};

export default AdminParts;
