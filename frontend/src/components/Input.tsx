// import React from "react";
// import { UseFormRegister, FieldValues } from "react-hook-form";

// interface InputProps {
//   type: string;
//   placeholder: string;
//   required?: boolean;
//   autoComplete?: string;
//   className?: string;
//   // register?: (name: string) => any;
//   register?: UseFormRegister<FieldValues>;
//   name: string;
//   error?: string | undefined;
// }

// const Input: React.FC<InputProps> = ({
//   type,
//   placeholder,
//   required,
//   className,
//   autoComplete,
//   register,
//   name,
//   error,
// }) => {
//   return (
//     <div className="w-full">
//       <input
//         type={type}
//         placeholder={placeholder}
//         required={required}
//         autoComplete={autoComplete}
//         {...(register && name ? register(name) : {})}
//         className={`w-full px-4 py-2 rounded-lg border-2 ${
//           error ? "border-red-500" : "border-gray-700"
//         } focus:ring-2 focus:ring-purple-600 ${className}`}
//       />
//     </div>
//   );
// };

// export default Input;

//

import React from "react";
import { UseFormRegister, FieldError, FieldValues } from "react-hook-form";

interface InputProps<TFieldValues extends FieldValues> {
  type: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  register: UseFormRegister<TFieldValues>;
  name: keyof TFieldValues;
  error?: FieldError;
}

const Input = <TFieldValues extends FieldValues>({
  type,
  placeholder,
  required,
  autoComplete,
  className = "",
  register,
  name,
  error,
}: InputProps<TFieldValues>) => {
  const errorId = error ? `${String(name)}-error` : undefined;

  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        {...register(name as any)}
        className={`w-full px-4 py-2 rounded-lg border-2 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } focus:ring-2 focus:ring-purple-600 focus:outline-none ${className}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={errorId}
      />
      {error?.message && (
        <p id={errorId} className="mt-1 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;
