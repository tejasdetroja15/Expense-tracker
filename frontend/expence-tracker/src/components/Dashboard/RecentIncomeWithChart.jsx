import React, { useEffect, useState } from 'react';
import CustomPieChart from '../../components/Charts/CustomPieChart';

const COLORS = ['#875CF5', '#ec4899', '#10b981', '#facc15', '#f87171', '#34d399'];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  const prepareChartData = () => {
    if (!data || data.length === 0) {
      setChartData([]);
      return;
    }
    
    const dataArr = data.map((item) => ({
      name: item?.source || 'Unknown',
      amount: Number(item?.amount) || 0,
    }));
    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();
  }, [data]);

  const formattedTotalIncome = typeof totalIncome === 'number' 
    ? totalIncome 
    : Number(totalIncome) || 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg text-gray-800">Last 60 Days Income</h5>
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