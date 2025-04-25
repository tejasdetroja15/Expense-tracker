import React, { useContext } from 'react'
import { prepareExpenseBarChartData } from '../../../utils/helper'
import { useEffect, useState } from 'react'
import CustomBarChart from '../Charts/CustomBarChart'
import { ThemeContext } from '../../context/ThemeContext'

const Last30DaysExpense = ({data}) => {

  const [chartData , setChartData] = useState([]);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);

    return () => {};
  },[data]);

  return (
    <div className='card col-span-1'>
      <div className='flex items-center justify-between'>
        <h5 className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Last 30 Days Expenses</h5>
      </div>
      <CustomBarChart data = {chartData}/>
    </div>
  )
}

export default Last30DaysExpense