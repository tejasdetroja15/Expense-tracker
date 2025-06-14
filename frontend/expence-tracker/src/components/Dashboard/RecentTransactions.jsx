import React, { useContext } from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard"; // assuming it's in the same folder
import { ThemeContext } from '../../context/ThemeContext';

const RecentTransactions = ({ transactions, onSeeMore }) => { 
    // console.log("RecentTransactions", transactions);
    const { darkMode } = useContext(ThemeContext);
    
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Transactions</h5>
                
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.type === "expense" ? item.category : item.source}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
