import React, { useContext } from "react";
import CustomPieChart from "../Charts/CustomPieChart"; // Make sure this path is correct
import { ThemeContext } from "../../context/ThemeContext";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  // Ensure these props have default values if they might be undefined
  const balance = totalBalance || 0;
  const income = totalIncome || 0;
  const expense = totalExpense || 0;
  const { darkMode } = useContext(ThemeContext);

  const balanceData = [
    { name: "Total Balance", amount: balance },
    { name: "Total Expenses", amount: expense },
    { name: "Total Income", amount: income },
  ];

  // console.log("Total Balance:", balance);
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Financial Overview</h5>
      </div>
      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`₹${balance}`}
        colors={COLORS}
        showTextAnchor={true} // Make sure this is true
      />
    </div>
  );
};

export default FinanceOverview;