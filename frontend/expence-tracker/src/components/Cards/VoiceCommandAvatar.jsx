import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

const VoiceCommandAvatar = ({ source }) => {
  const firstLetter = source ? source.charAt(0).toUpperCase() : '';

  return (
    <div className="relative w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-white font-bold text-lg">
      <span className="text-gray-800">
        {firstLetter}
        </span>
      <div className="absolute -bottom-0.5 -right-0.5 bg-black rounded-full p-1">
        <FaMicrophone size={14} className="text-white" />
      </div>
    </div>
  );
};

export default VoiceCommandAvatar; 
