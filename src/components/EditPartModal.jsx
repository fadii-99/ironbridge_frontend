import React, { useState, useEffect } from "react";
import { FaTimes, FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const EditPartModal = ({ part, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    part_number: "",
    description: "",
    manufacturer: "",
    size: "",
    crossovers: "",
    sch_b: "",
    distributor_info: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (part) {
      setForm({
        part_number: part["PART NUMBER"] || "",
        description: part["DESCRIPTION"] || "",
        manufacturer: part["MANUFACTURE"] || "",
        size: part["SIZE"] || "",
        crossovers: part["CROSSOVERS"] || "",
        sch_b: part["SCH B"] || "",
        distributor_info: part["DISTRIBUTOR INFO"] || "",
      });
    }
  }, [part]);


  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      const changed =
        JSON.stringify(updated) !== JSON.stringify({
          part_number: part["PART NUMBER"] || "",
          description: part["DESCRIPTION"] || "",
          manufacturer: part["MANUFACTURE"] || "",
          size: part["SIZE"] || "",
          crossovers: part["CROSSOVERS"] || "",
          sch_b: part["SCH B"] || "",
          distributor_info: part["DISTRIBUTOR INFO"] || "",
        });
      setHasChanged(changed);
      return updated;
    });
  };

  const handleSubmit = async () => {
  if (!hasChanged) {
    toast.info("No changes made.");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("AdminToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // ✅ Build object with only changed fields
    const changedFields = {};
    for (const key in form) {
      const original =
        part[
          key
            .replace("part_number", "PART NUMBER")
            .replace("description", "DESCRIPTION")
            .replace("manufacturer", "MANUFACTURE")
            .replace("size", "SIZE")
            .replace("crossovers", "CROSSOVERS")
            .replace("sch_b", "SCH B")
            .replace("distributor_info", "DISTRIBUTOR INFO")
        ] || "";

      if (form[key] !== original) {
        changedFields[key] = form[key];
      }
    }

    if (Object.keys(changedFields).length === 0) {
      toast.info("No actual changes to submit.");
      setLoading(false);
      return;
    }

    const res = await fetch(`${serverUrl}/admin/parts/${part.id}/edit/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(changedFields),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Update failed");

    toast.success("Part updated successfully!");
    onSuccess?.(); // refresh parent list
    onClose();
  } catch (err) {
    console.error("Edit error:", err);
    toast.error(err.message || "Failed to update part.");
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
      {/* ✅ Toast Container */}
      <ToastContainer position="top-right" theme="dark" autoClose={2500} />

      {/* ✅ Scrollbar Styling */}
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #2a2a2a, #555);
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #444, #777);
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: #555 transparent;
          }
        `}
      </style>

      {/* ✅ Modal Container */}
      <div
        className="relative bg-black/90 border border-white/20 rounded-xl shadow-2xl p-8 text-center w-[90%] max-w-lg max-h-[85vh] overflow-y-auto custom-scroll"
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* 🟡 Header */}
        <FaEdit className="text-yellow-400 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">
          Edit Part Details
        </h2>

        {/* 🧾 Form Fields */}
        <div className="space-y-4 text-left">
          {Object.keys(form).map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-xs uppercase text-gray-400 mb-1 font-semibold tracking-wider"
              >
                {field.replaceAll("_", " ")}
              </label>
              <div className="flex items-center px-4 rounded border border-white/20 bg-black/50">
                <input
                  id={field}
                  type="text"
                  placeholder={`Enter ${field.replaceAll("_", " ")}`}
                  value={form[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full py-3 text-white text-sm placeholder-gray-400 bg-transparent outline-none"
                  disabled={loading}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 💾 Save Button */}
        <button
          onClick={handleSubmit}
          disabled={!hasChanged || loading}
          className={`w-full py-3 mt-8 rounded font-bold text-white
            bg-gradient-to-r from-yellow-400 to-yellow-600
            hover:from-yellow-300 hover:to-yellow-500
            transition-all shadow-lg sm:text-sm text-xs
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2`}
        >
          {loading && (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>{loading ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
};

export default EditPartModal;
