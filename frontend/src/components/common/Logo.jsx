import React, { useContext } from "react";
import { Link } from "react-router-dom";

const Logo = () => {

  return (
    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
      <div
        className={'w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <span className="font-black text-2xl tracking-tight select-none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
        3DVerse
      </span>
    </Link>
  );
};

export default Logo;