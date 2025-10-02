import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

const SmallLoader = ({ size = 12, color = "#fde047" }) => {
  // yellow-300 hex = #fde047
  return (
    <div className="flex items-center justify-center w-full">
      <PulseLoader color={color} size={size} />
    </div>
  );
};

export default SmallLoader;
