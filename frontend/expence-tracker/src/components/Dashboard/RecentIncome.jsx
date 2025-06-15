import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const RecentIncome = ({transactions,onSeeMore}) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg text-gray-800'>Income</h5>

            <button className='card-btn' onClick={onSeeMore}>
                See all <LuArrowRight className='text-base'/>
            </button>
        </div>
        <div className='mt-6'>
            {transactions?.slice(0, 4).map((item) => 
                <TransactionInfoCard
                    key={item._id}
                    title={item.source}
                    date={moment(item.date).format('MMM DD, YYYY')}
                    amount={item.amount}
                    icon={item.icon}
                    type= "income"
                    hideDeleteBtn
                />
            )}
        </div>
    </div>
  )
}

export default RecentIncome