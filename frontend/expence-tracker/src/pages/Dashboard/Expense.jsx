import { React , useState , useEffect} from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apipath';
import { toast } from 'react-toastify';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {

  useUserAuth();

  const [expenseData , setExpenseData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading , setLoading] = useState(false)
  const [ openDeleteAlert , setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  const[openAddExpenseModel , setOpenAddExpenseModel] = useState(false)

  // Get All Expense details
  const fetchExpenseDetails = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if(response.data){
        setExpenseData(response.data)
      }
    } catch(error) {
      console.log("Something went wrong , Please try again",error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category , amount , date , icon} = expense;

    //Check validation
    if(!category.trim()){
      toast.error("category is required")
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
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE , {
        category ,
        amount ,
        date ,
        icon
      })
      setOpenAddExpenseModel(false)
      toast.success("Income Added Successfully")
      fetchExpenseDetails();
    }
    catch(error){
      console.error("Error addding Expense:" ,
        error.response?.data?.message || error.message
      );
    }
  };
  
  //Delete Expense
  const deleteExpense = async (id) => {
    if (!id) return;

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      toast.success("Expense deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      fetchExpenseDetails(); 
    } catch (error) {
      console.error("Error deleting expense:", error.response?.data?.message || error.message);
    }
  };


  // Handle downloadExpense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );
      
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
   };


  useEffect(() => {
    fetchExpenseDetails();

    return() => {};
  },[]);

  return (
    <DashboardLayout activeMenu="Expense">
        <div className='my-5 mx-auto'>
          <div className='grid grid-cols-1 gap-6'>
            <div className=''>
              <ExpenseOverview
                transactions={expenseData}
                onExpenseIncome={() => {setOpenAddExpenseModel(true);}}
              />
            </div>
          </div>

          <div className="mt-8">
            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => {
                setOpenDeleteAlert({show:true , data:id})
              }}
              onDownload = {handleDownloadExpenseDetails}
            />
          </div>

        <Modal
          isOpen={openAddExpenseModel}
          onClose={() => {setOpenAddExpenseModel(false)}}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense}/>
        </Modal>

        <Modal 
            isOpen={openDeleteAlert.show} 
            onClose={() => setOpenDeleteAlert({ show: false, data: null })} 
            title="Delete Income"
          >
            <DeleteAlert 
              content="Are you sure you want to delete this expense detail?" 
              onDelete={() => deleteExpense(openDeleteAlert.data)} 
            />
          </Modal>

        </div>
    </DashboardLayout>
  );
};

export default Expense;
