import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import moment from 'moment'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const ExpenseTranscations = ({transactions , onSeeMore}) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg text-gray-800'>Expenses</h5>

            <button className='card-btn'onClick={onSeeMore}>
                See All <LuArrowRight className="text-base"/>
            </button>
        </div>

        <div className="mt-6">
            {transactions?.length > 0 ? (
                transactions.slice(0, 4).map((expense) => (
                    <TransactionInfoCard
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.date).format("Do MMM YYYY")}
                        amount={expense.amount}
                        type="expense"
                        hideDeleteBtn
                    />
                ))
            ) : (
                <p className="text-gray-500 text-sm">No expenses found for the last 30 days.</p>
            )}
        </div>
    </div>
  )
}

export default ExpenseTranscations