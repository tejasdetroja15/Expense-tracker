const XLSX = require("xlsx");
const Expense = require("../models/Expense");


// Add Expense category
exports.addExpense = async (req, res) => {
    console.log("Request body:", req.body); // Debugging log
    const userId = req.user.id;

    try {
        const { icon = "default-icon", category, amount, date } = req.body;

        if (!date || !category || !amount) {
            return res.status(400).json({ msg: "Please fill in all fields" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.json({ msg: "Expense added successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Get All Expense categorys
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
}

// Delete Expense category
exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({msg: "Expense deleted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
}

// Download Expense Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try{
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        
        //prepare data for Excel
        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date.toLocaleDateString(),
        }));

        //create Excel file
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Expense");
        XLSX.writeFile(wb, "Expense_Details.xlsx");
        res.download("Expense_Details.xlsx", (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error downloading file");
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
}

