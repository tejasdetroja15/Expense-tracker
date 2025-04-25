import React from 'react';

const InfoCard = ({ icon, label, value, color, darkMode }) => {
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-md ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    } p-5 transition-all duration-200 hover:shadow-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {label}
          </p>
          <h3 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          ₹{value}
          </h3>
        </div>
        
        <div className={`flex items-center justify-center h-12 w-12 rounded-full ${color} bg-opacity-90 text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 w-full h-1 ${color}`}></div>
    </div>
  );
};

export default InfoCard;