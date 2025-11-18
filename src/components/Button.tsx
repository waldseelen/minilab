import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-pastel-green hover:bg-pastel-pink text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
