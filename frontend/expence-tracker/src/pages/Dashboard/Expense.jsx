import { React , useState , useEffect, useContext} from 'react'
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
import VoiceCommandButton from '../../components/VoiceCommandButton';
import { ThemeContext } from '../../context/ThemeContext';

const Expense = () => {

  useUserAuth();
  const { darkMode } = useContext(ThemeContext);

  const [expenseData , setExpenseData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading , setLoading] = useState(false)
  const [ openDeleteAlert , setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  const[openAddExpenseModel , setOpenAddExpenseModel] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null);

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
  
  // Handle Update Expense
  const handleUpdateExpense = async (updatedExpense) => {
    const { _id, category, amount, date, icon } = updatedExpense;

    //Check validation
    if(!category.trim()){
      toast.error("Category is required");
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
      await axiosInstance.put(`${API_PATHS.EXPENSE.UPDATE_EXPENSE(_id)}`, {
        category,
        amount,
        date,
        icon: icon || null
      });
      setOpenAddExpenseModel(false);
      setEditingExpense(null);
      toast.success("Expense Updated Successfully");
      fetchExpenseDetails();
    } catch(error) {
      console.error("Error updating expense:", error.response?.data?.message || error.message);
      toast.error("Failed to update expense. Please try again.");
    }
  };

  // Handle Edit Expense (for microphone added expenses)
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setOpenAddExpenseModel(true);
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

  // Handle Voice Command
  const handleVoiceCommand = async (commandData) => {
    try {
      // Validate the command data
      if (!commandData.amount || !commandData.category) {
        toast.error("Invalid command data. Please try again.");
        return;
      }

      // Add to backend with a specific icon for voice command
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category: commandData.category,
        amount: commandData.amount,
        date: commandData.date,
        icon: "VOICE_COMMAND_AVATAR" // Set a specific icon string for voice commands
      });

      toast.success(`Added expense of ₹${commandData.amount} for ${commandData.category}`);
      setOpenAddExpenseModel(false);

      // Refresh the expense list to get the real ID and consistency
      fetchExpenseDetails();

    } catch (error) {
      console.error("Error processing voice command:", error);
      toast.error("Failed to process voice command. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();

    return() => {};
  },[]);

  return (
    <DashboardLayout activeMenu="Expense">
        <div className='my-5 w-full'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
            <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2 sm:mb-0`}>
              Expense Dashboard
            </h1>
            {/* Wrap VoiceCommandButton and message in a column flex container for vertical stacking */}
            <div className="flex flex-col items-end w-full sm:w-auto mt-4 sm:mt-0">
              <VoiceCommandButton onCommand={handleVoiceCommand} type="expense" />
              <p className={`text-sm mt-2 mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}> {/* Adjusted mb */}
                Try saying: "add expense <span className="font-semibold">(amount)</span> as <span className="font-semibold">(category)</span>"
              </p>
            </div>
          </div>

          {/* Full width graph section */}
          <div className="w-full mb-8">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => {setOpenAddExpenseModel(true);}}
            />
          </div>

          {/* Two column expense list section */}
            <div className="w-full">
            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => {
                setOpenDeleteAlert({show:true , data:id})
              }}
              onDownload = {handleDownloadExpenseDetails}
              onEdit={handleEditExpense}
            />
          </div>

        <Modal
          isOpen={openAddExpenseModel}
          onClose={() => {
            setOpenAddExpenseModel(false);
            setEditingExpense(null);
          }}
          title={editingExpense ? "Edit Expense" : "Add Expense"}
        >
          <AddExpenseForm 
            onAddExpense={editingExpense ? handleUpdateExpense : handleAddExpense}
            initialData={editingExpense}
            isEditing={!!editingExpense}
          />
        </Modal>

        <Modal 
            isOpen={openDeleteAlert.show} 
            onClose={() => setOpenDeleteAlert({ show: false, data: null })} 
            title="Delete Expense"
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
