import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <span className="font-bold text-xl tracking-tight select-none">3DVerse</span>
    </Link>
  );
};

export default Logo;