import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="block text-[13px] font-medium text-slate-800 mb-1">{label}</label>
      <div className="flex items-center border border-gray-300 p-2 rounded-md focus-within:border-[#9810FA] focus-within:ring-1 focus-within:ring-[#9810FA] transition-all">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-800"
          value={value}
          onChange={onChange} // Fixed: Pass the entire event object, not just the value
        />
        {type === 'password' && (
          <span onClick={toggleShowPassword} className="cursor-pointer ml-2">
            {showPassword ? (
              <FaRegEyeSlash size={22} className="text-slate-400" />
            ) : (
              <FaRegEye size={22} className="text-[#9810FA]" /> // Using your custom purple color
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;