import React from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';

const IncomeList = ({ transactions, onDelete, onDownload, onEdit }) => {
  return (
    <div className="card w-full border-2 border-green-500">
      <div className="flex items-center justify-between">
        <h5 className="text-lg text-gray-800">Income Sources</h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income._id)}
            onEdit={() => onEdit(income)}
            isVoiceCommand={income.isVoiceCommand}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
