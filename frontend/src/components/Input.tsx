import React from "react";

interface InputProps {
  type: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  register?: (name: string) => any;
  name: string;
  error?: string | undefined;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  required,
  className,
  autoComplete,
  register,
  name,
  error,
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        {...(register && name ? register(name) : {})}
        className={`w-full px-4 py-2 rounded-lg border-2 ${
          error ? "border-red-500" : "border-gray-700"
        } focus:ring-2 focus:ring-purple-600 ${className}`}
      />
    </div>
  );
};

export default Input;
