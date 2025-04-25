import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-200">
        <p className="text-xs font-semibold text-purple-800 mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-600">
          Amount: <span className="text-sm font-medium text-gray-900">
          ₹{payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieChart = ({ data, label, totalAmount, colors }) => {
  console.log("📦 Legend Data:", data);
  
  // Ensure we have valid data
  const validData = Array.isArray(data) ? data.filter(item => item && typeof item.amount !== 'undefined') : [];
  
  // Calculate the actual total from data items for percentage calculations
  const calculatedTotal = validData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  // Format the display amount properly
  let displayAmount = totalAmount;
  if (calculatedTotal > 0 && (!totalAmount || totalAmount === '₹0')) {
    // If totalAmount is missing or zero but we have valid data, use the calculated total
    displayAmount = `₹${calculatedTotal.toLocaleString()}`;
  }

  return (
    <div className="relative w-full" style={{ height: "420px" }}> {/* Increased height to allow more space */}
      {/* Center text using absolute positioning - moved slightly up to avoid tooltip overlap */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none" style={{ transform: 'translateY(-20px)' }}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold">{displayAmount}</p>
      </div>
      
      <ResponsiveContainer width="100%" height="85%"> {/* Reduced chart height to 85% to leave room for legend */}
        <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}> {/* Added bottom margin for tooltip space */}
          <Pie
            data={validData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="45%" /* Moved the pie chart up slightly */
            outerRadius={120} /* Slightly reduced from 130 */
            innerRadius={90} /* Slightly reduced from 100 */
            labelLine={false}
          >
            {validData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors ? colors[index % colors.length] : '#8884d8'} 
              />
            ))}
          </Pie>
          
          {/* Position tooltip to avoid overlap */}
          <Tooltip 
            content={<CustomTooltip />} 
            position={{ y: 0 }} /* Force tooltip to appear at the top of the chart area */
            wrapperStyle={{ zIndex: 100 }} /* Ensure tooltip stays on top */
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Custom legend overlay - added more space from bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4">
        <div className="flex flex-wrap items-center justify-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm max-w-full">
          {validData.map((entry, index) => {
            // Calculate the percentage safely
            const percentage = calculatedTotal > 0 
              ? Math.round((Number(entry.amount) / calculatedTotal * 100) || 0) 
              : 0;
              
            // Extract the last part of the name if needed
            const displayName = entry.name?.split(" ").length > 1 
              ? entry.name.split(" ")[1] 
              : entry.name || 'Unknown';
              
            return (
              <div key={`legend-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: colors ? colors[index % colors.length] : '#8884d8' }}
                />
                <span className="text-sm text-gray-600">
                  {displayName} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomPieChart;