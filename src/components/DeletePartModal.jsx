import React, { useState } from "react";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const DeletePartModal = ({ part, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("AdminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${serverUrl}/admin/parts/${part.id}/delete/`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");

      toast.success(`Part "${part["PART NUMBER"]}" deleted successfully!`);
      onSuccess?.(); // refresh parts list
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete part.");
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") onClose();
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOutsideClick}
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
    >
      <ToastContainer position="top-right" theme="dark" autoClose={2500} />

      <div className="relative bg-black/90 border border-white/20 rounded-xl shadow-2xl p-8 text-center max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <FaTimes className="text-lg" />
        </button>

        <FaTrashAlt className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-6 text-red-500">Delete Part</h2>

        <p className="text-gray-300 text-sm mb-10 leading-6">
          Are you sure you want to delete
          <br />
          <span className="text-white font-semibold">
            {part["PART NUMBER"] || "Unknown Part"}
          </span>{" "}
          from the catalog? <br />
          This action <span className="text-red-400">cannot be undone.</span>
        </p>

        <button
          onClick={handleDelete}
          disabled={loading}
          className={`w-full py-3 rounded font-bold text-white
            bg-gradient-to-r from-red-600 to-red-800
            hover:from-red-500 hover:to-red-700
            transition-all shadow-lg sm:text-sm text-xs
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2`}
        >
          {loading && (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>{loading ? "Deleting..." : "Delete Part"}</span>
        </button>
      </div>
    </div>
  );
};


export default DeletePartModal;
