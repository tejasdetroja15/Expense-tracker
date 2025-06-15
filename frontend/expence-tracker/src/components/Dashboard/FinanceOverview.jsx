import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balance = totalBalance || 0;
  const income = totalIncome || 0;
  const expense = totalExpense || 0;

  const balanceData = [
    { name: "Total Balance", amount: balance },
    { name: "Total Expenses", amount: expense },
    { name: "Total Income", amount: income },
  ];
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg text-gray-800">Financial Overview</h5>
      </div>
      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`₹${balance}`}
        colors={COLORS}
        showTextAnchor={true}
      />
    </div>
  );
};

export default FinanceOverview;