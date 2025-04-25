import React, { useEffect, useState, useContext } from 'react';
import CustomPieChart from '../../components/Charts/CustomPieChart'; // Adjust path if needed
import { ThemeContext } from '../../context/ThemeContext';

const COLORS = ['#875CF5', '#ec4899', '#10b981', '#facc15', '#f87171', '#34d399'];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);
  const { darkMode } = useContext(ThemeContext);

  const prepareChartData = () => {
    // Add a null/empty check for data
    if (!data || data.length === 0) {
      setChartData([]);
      return;
    }
    
    // Ensure we're working with proper data structure
    const dataArr = data.map((item) => ({
      name: item?.source || 'Unknown',  // Provide default value
      amount: Number(item?.amount) || 0,  // Convert to number and default to 0
    }));
    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();
  }, [data]); // Dependency array includes data

  // Ensure totalIncome is a number
  const formattedTotalIncome = typeof totalIncome === 'number' 
    ? totalIncome 
    : Number(totalIncome) || 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Last 60 Days Income</h5>
      </div>
      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`₹${formattedTotalIncome.toLocaleString()}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;