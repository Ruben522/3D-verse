import React from 'react';

const InputForm = ({ value, onClick, type = "button", disabled = false, variant = "primary", className = "" }) => {
  const baseStyle = "px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400",
    outline: "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 disabled:bg-gray-100",
    ghost: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary-600"
  };

  return (
    <input
      type={type}
      value={value}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    />
  );
};

export default InputForm;