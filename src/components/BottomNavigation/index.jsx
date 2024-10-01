import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner shadow-gray-200 py-1 z-50">
      <div className="flex justify-around">
        <Link
          to="/"
          className={`py-2 w-[50%] text-center ${
            location.pathname === "/"
              ? "text-blue-500 font-bold border-b border-blue-500"
              : "text-gray-600"
          }`}
        >
          Navigation
        </Link>
        <Link
          to="/add-report"
          className={`py-2 w-[50%] text-center ${
            location.pathname === "/add-report"
              ? "text-blue-500 font-bold border-b border-blue-500"
              : "text-gray-600"
          }`}
        >
          Add Report
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
