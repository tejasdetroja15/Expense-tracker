import React from "react";
import { LuTrendingUpDown } from "react-icons/lu";
import CARD_2 from "../../assets/images/card2.png"

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="w-screen md:w-[60vw] px-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
        {children}
      </div>

      <div className="hidden md:flex w-[40vw] h-screen bg-violet-50 relative items-center justify-center">
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 left-5"></div>
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-20 left-32"></div>
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 right-5"></div>
        <div className="grid grid-cols-1 z-20 text-center">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="430,000"
            color="bg-primary"
          />
        </div>
        <img
          src={CARD_2}
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/10"
          alt="Card Image"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
    return (
        <div className="flex gap-6 bg-white p-4 rounded-xl shadow">
            <div className={`flex items-center justify-center p-3 rounded-lg ${color || 'bg-primary'} text-white text-xl`}>
                {icon}
            </div>
            <div className="flex flex-col justify-center">
                <h6 className="text-sm font-medium text-gray-500">{label}</h6>
                <span className="font-bold text-lg text-gray-800">${value}</span>
            </div>
        </div>
    );
};