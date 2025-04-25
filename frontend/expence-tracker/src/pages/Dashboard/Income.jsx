import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apipath';
import IncomeOverview from '../../components/Income/IncomeOverview';
import Modal from '../../components/Modal';
import AddIncomeForm  from '../../components/Income/AddIncomeForm';
import { toast } from 'react-toastify';
import IncomList from '../../components/Income/IncomList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';



const Income = () => {
  useUserAuth();

  const [incomeData , setIncomeData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading , setLoading] = useState(false)
  const [ openDeleteAlert , setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  const[openAddIncomeModel , setOpenAddIncomeModel] = useState(false)

  // Get All Income details
  const fetchIncomeDetails = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if(response.data){
        setIncomeData(response.data)
      }
    } catch(error) {
      console.log("Something went wrong , Please try again",error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source , amount , date , icon} = income;

    //Check validation
    if(!source.trim()){
      toast.error("Source is required")
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Invalid Amount")
      return;
    }

    if(!date){
      toast.error("Date is required")
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME , {
        source ,
        amount ,
        date ,
        icon
      })
      setOpenAddIncomeModel(false)
      toast.success("Income Added Successfully")
      fetchIncomeDetails();
    }
    catch(error){
      console.error("Error addding income:" ,
        error.response?.data?.message || error.message
      );
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
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModel(true)}
            />
          </div>

        <IncomList
          transactions={incomeData}
          onDelete={(id) =>{
            setOpenDeleteAlert({ show: true , data:id})
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
  )
}

export default Income
