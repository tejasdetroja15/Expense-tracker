import React from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const ExpenseList = ({ transactions, onDelete, onDownload, onEdit }) => {
  return (
    <div className="bg-white rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <LuDownload size={20} />
          <span>Download</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transactions.map((transaction) => (
          <TransactionInfoCard
            key={transaction._id}
            title={transaction.category}
            icon={transaction.icon}
            date={new Date(transaction.date).toLocaleDateString()}
            amount={transaction.amount}
            type="expense"
            onDelete={() => onDelete(transaction._id)}
            onEdit={onEdit ? () => onEdit(transaction) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;