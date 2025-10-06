// src/components/ViewProfileModal.jsx
import React from "react";
import { FaIdBadge, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useUser } from "./../context/UserProvider";

const fmt = (val) => {
  if (!val) return "-";
  // your backend sends friendly strings already (e.g., "06 Oct 2025")
  // if ISO ever comes through, fall back to Date parsing
  const date = new Date(val);
  return isNaN(date.getTime()) ? String(val) : date.toLocaleString();
};

const LabelVal = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 py-2 border-b border-white/10">
    <span className="text-[11px] text-gray-400">{label}</span>
    <span className="text-xs text-white">{children}</span>
  </div>
);

const Badge = ({ children, color = "gray" }) => {
  const map = {
    green: "bg-green-500/15 text-green-400 border-green-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    gray: "bg-white/10 text-gray-300 border-white/10",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`px-2 py-1 rounded text-[10px] border ${map[color]}`}>
      {children}
    </span>
  );
};

const ViewProfileModal = ({ onClose }) => {
  const { user } = useUser();
  const u = user?.user || {};

  const planName = u?.plan_name ?? "—";
  const availableSearches =
    typeof u?.searches_limit === "number" ? u.searches_limit : "—";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="relative bg-black/90 border border-white/20 rounded-xl shadow-2xl p-6 sm:p-8 text-left max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-300/10">
            <FaIdBadge className="text-yellow-300 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">Profile</h2>
            <p className="text-[11px] text-gray-400">Your account information</p>
          </div>
        </div>

        {/* Name + Verified */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-white text-lg font-medium uppercase">
            {u.full_name || "Guest User"}
          </div>
          <div className="flex items-center gap-2">
            {u.is_verified ? (
              <Badge color="green">
                <span className="inline-flex items-center gap-1">
                  <FaCheckCircle className="text-[12px]" />{" "}
                  <span className="pt-[0.5px]">Verified</span>
                </span>
              </Badge>
            ) : (
              <Badge color="red">
                <span className="inline-flex items-center gap-1">
                  <FaTimesCircle className="text-[12px]" />{" "}
                  <span className="pt-[0.5px]">Not Verified</span>
                </span>
              </Badge>
            )}
          </div>
        </div>

        {/* Plan badges row */}
        <div className="flex items-center gap-2 mb-5">
          <Badge color="yellow">
            Plan:&nbsp;<strong className="text-yellow-300">{planName}</strong>
          </Badge>
          <Badge color="blue">
            Available Searches:&nbsp;<strong className="text-blue-300">{availableSearches}</strong>
          </Badge>
        </div>

        {/* Info list */}
        <div className="rounded-lg border border-white/10 bg-black/40 p-5">
          <LabelVal label="Email">{u.email || "-"}</LabelVal>
          <LabelVal label="Joined On">{fmt(u.date_joined)}</LabelVal>
          <LabelVal label="Last Login">{fmt(u.last_login)}</LabelVal>
     
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 transition shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileModal;
