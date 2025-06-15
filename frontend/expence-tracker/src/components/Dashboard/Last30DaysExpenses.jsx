import React from 'react'
import { prepareExpenseBarChartData } from '../../../utils/helper'
import { useEffect, useState } from 'react'
import CustomBarChart from '../Charts/CustomBarChart'

const Last30DaysExpense = ({data}) => {
  const [chartData , setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);
  },[data]);

  return (
    <div className='card col-span-1'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg text-gray-800'>Last 30 Days Expenses</h5>
      </div>
      <CustomBarChart data = {chartData}/>
    </div>
  )
}

export default Last30DaysExpense