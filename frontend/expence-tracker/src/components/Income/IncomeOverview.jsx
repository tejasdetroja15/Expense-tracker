import React, { useEffect, useState, useContext } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../Charts/CustomBarChart'
import { prepareIncomeBarChartData } from '../../../utils/helper'
import { ThemeContext } from '../../context/ThemeContext'

const IncomeOverview = ({transactions,onAddIncome}) => {
    const [chartData , setChartData] = useState([])
    const { darkMode } = useContext(ThemeContext);
    
    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setChartData(result)

        return () => {};
    } ,[transactions]);
    return (
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h5 className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Income Overview</h5>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-400'} mt-0.5`}>
                Track your earnings over time and analyze your income trends.
              </p>
            </div>
            <button className="add-btn" onClick={onAddIncome}>
              <LuPlus className="text-lg" />
              Add Income
            </button>
          </div>
    
          <div className="mt-10">
            <CustomBarChart data={chartData} />
          </div>
        </div>
      );
}

export default IncomeOverview