import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../Charts/CustomBarChart'
import { prepareIncomeBarChartData } from '../../../utils/helper'

const IncomeOverview = ({transactions,onAddIncome}) => {
    const [chartData , setChartData] = useState([])
    
    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setChartData(result)
    } ,[transactions]);

    return (
        <div className="card w-full">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg text-gray-800">Income Overview</h5>
              <p className="text-xs text-gray-400 mt-0.5">
                Track your earnings over time and analyze your income trends.
              </p>
            </div>
            <button className="add-btn" onClick={onAddIncome}>
              <LuPlus className="text-lg" />
              Add Income
            </button>
          </div>
    
          <div className="mt-6">
            <CustomBarChart data={chartData} />
          </div>
        </div>
      );
}

export default IncomeOverview