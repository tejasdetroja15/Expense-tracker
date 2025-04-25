import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { ThemeContext } from '../../context/ThemeContext';
import { API_PATHS } from '../../../utils/apipath';
import InfoCard from '../../components/Cards/InfoCard';
import axiosInstance from '../../../utils/axiosInstance';
import { addThousandsSeparator } from '../../../utils/helper';
import { IoMdCard } from 'react-icons/io';
import { GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTranscations from '../../components/Dashboard/ExpenseTranscations';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [dashboardData, setDashboardData] = useState();
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      console.log("📥 API response:", response.data);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    console.log('📊 dashboardData updated:', dashboardData);
  }, [dashboardData]);

  const totalIncome = dashboardData?.last60DaysIncome?.total 
    ? Number(dashboardData.last60DaysIncome.total) 
    : 0;
  
  return (
    <DashboardLayout activeMenu="Dashboard">
      {loading ? (
        <div className="flex justify-center items-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="my-5 mx-auto transition-colors">
          <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Financial Dashboard
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<GiReceiveMoney size={24} />}
              label="Total Balance"
              value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
              color="bg-blue-600"
              darkMode={darkMode}
            /> 

            <InfoCard
              icon={<IoMdCard size={24} />}
              label="Total Income"
              value={addThousandsSeparator(totalIncome)}
              color="bg-green-600"
              darkMode={darkMode}
            />

            <InfoCard
              icon={<GiPayMoney size={24} />}
              label="Total Expense"
              value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
              color="bg-red-600"
              darkMode={darkMode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <RecentTransactions
              transactions={dashboardData?.recentTransactions} 
              onSeeMore={() => navigate('/expense')}
              darkMode={darkMode}
            />
    
            <FinanceOverview
              totalBalance={dashboardData?.totalBalance || 0}
              totalIncome={dashboardData?.totalIncome || 0}
              totalExpense={dashboardData?.totalExpenses || 0}
              darkMode={darkMode}
            />

            <ExpenseTranscations
              transactions={dashboardData?.last30DaysExpenses?.transactions || []} 
              onSeeMore={() => navigate('/expense')}
              darkMode={darkMode}
            />

            <Last30DaysExpenses
              data={dashboardData?.last30DaysExpenses?.transactions || []}
              darkMode={darkMode}
            />

            <RecentIncomeWithChart
              data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
              totalIncome={totalIncome}
              darkMode={darkMode}
            />

            <RecentIncome
              transactions={dashboardData?.last60DaysIncome?.transactions || []}
              onSeeMore={() => navigate('/income')}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Home;