import React, { useEffect, useState, useContext } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart"; 
import { ThemeContext } from "../../context/ThemeContext";

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
  const [chartData, setChartData] = useState([]);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);
    return () => {};
  }, [transactions]);

  return (
    <div className="card w-full border-2 border-green-500">
      <div className="flex items-center justify-between">
        <div>
          <h5 className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Expense Overview</h5>
          <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-400'} mt-0.5`}>
            Track your spending trends over time and gain insights into where your money goes.
          </p>
        </div>
        <button className="add-btn" onClick={onExpenseIncome}>
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>

      <div className="mt-6">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
