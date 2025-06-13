import React, { useEffect, useState, useContext } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apipath';
import IncomeOverview from '../../components/Income/IncomeOverview';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import { toast } from 'react-toastify';
import IncomList from '../../components/Income/IncomList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';
import VoiceCommandButton from '../../components/VoiceCommandButton';
import { ThemeContext } from '../../context/ThemeContext';

const Income = () => {
  useUserAuth();
  const { darkMode } = useContext(ThemeContext);

  const [incomeData, setIncomeData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });
  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);

  // Get All Income details
  const fetchIncomeDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if(response.data){
        setIncomeData(response.data);
      }
    } catch(error) {
      console.log("Something went wrong, Please try again", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    //Check validation
    if(!source.trim()){
      toast.error("Source is required");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Invalid Amount");
      return;
    }

    if(!date){
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon: icon || null // Ensure icon is null if not provided
      });
      setOpenAddIncomeModel(false);
      toast.success("Income Added Successfully");
      fetchIncomeDetails();
    } catch(error) {
      console.error("Error adding income:", error.response?.data?.message || error.message);
      toast.error("Failed to add income. Please try again.");
    }
  };

  // Handle Voice Command
  const handleVoiceCommand = async (commandData) => {
    try {
      // Validate the command data
      if (!commandData.amount || !commandData.source) {
        toast.error("Invalid command data. Please try again.");
        return;
      }

      // Add to backend with a specific icon for voice command
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source: commandData.source,
        amount: commandData.amount,
        date: commandData.date,
        icon: "VOICE_COMMAND_AVATAR" // Set a specific icon string for voice commands
      });

      toast.success(`Added income of ₹${commandData.amount} from ${commandData.source}`);
      setOpenAddIncomeModel(false);

      // Refresh the income list to get the real ID and consistency
      fetchIncomeDetails();

    } catch (error) {
      console.error("Error processing voice command:", error);
      toast.error("Failed to process voice command. Please try again.");
    }
  };

  //Delete Income
  const deleteIncome = async (id) => {
    if (!id) return;

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      toast.success("Income deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      fetchIncomeDetails(); 
    } catch (error) {
      console.error("Error deleting income:", error.response?.data?.message || error.message);
    }
  };

  // Handle downloadIncome details
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        }
      );
      
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Income.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Income details:", error);
      toast.error("Failed to download Income details. Please try again.");
    }
   };
  useEffect(() => {
    fetchIncomeDetails();

    return() => {};
  },[]);

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Income Dashboard
            </h1>
            <VoiceCommandButton onCommand={handleVoiceCommand} type="income" />
          </div>

          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModel(true)}
            />
          </div>

          <IncomList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModel}
          onClose={() => setOpenAddIncomeModel(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>

        <Modal 
          isOpen={openDeleteAlert.show} 
          onClose={() => setOpenDeleteAlert({ show: false, data: null })} 
          title="Delete Income"
        >
          <DeleteAlert 
            content="Are you sure you want to delete this income detail?" 
            onDelete={() => deleteIncome(openDeleteAlert.data)} 
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
