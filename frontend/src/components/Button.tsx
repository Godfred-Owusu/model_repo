import React from "react";

interface ButtonProps {
  type: "submit" | "button";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  children,
  className,
  onClick,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={false}
      className={`w-full px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
