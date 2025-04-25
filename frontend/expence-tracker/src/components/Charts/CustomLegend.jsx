import React from "react";

const CustomLegend = (props) => {
  const { payload } = props;
  
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <ul className="flex flex-wrap justify-center gap-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomLegend;