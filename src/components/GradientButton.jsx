import React from "react";

const GradientButton = ({
  label = "Click Me",
  onClick,
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`
        ${fullWidth ? "w-full" : "sm:px-8 px-4"}
        py-3 rounded font-bold text-black
        bg-gradient-to-r from-yellow-400 to-yellow-600
        hover:from-yellow-300 hover:to-yellow-500
        transition-all shadow-lg sm:text-sm text-xs
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
    >
      {loading && (
        <span
          className="inline-block h-4 w-4 border-2 border-black/60 border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      <span>{loading ? "Loading..." : label}</span>
    </button>
  );
};

export default GradientButton;
