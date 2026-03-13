import React from 'react';

const Button = ({ children, onClick, variant = "primary", className = "" }) => {
  const baseStyle = "px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center gap-3";
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    outline: "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;