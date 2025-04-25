const XLSX = require("xlsx");
const Income = require("../models/Income");


// Add Income Source
exports.addIncome = async (req, res) => {
    console.log("Received Data:", req.body);  // Check if req.body is received
    const userId = req.user.id;

    try {
        const { icon = "default-icon", source, amount, date } = req.body;

        if (!date || !source || !amount) {
            return res.status(400).json({ msg: "Please fill in all fields" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();
        res.json({ msg: "Income added successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Get All Income Sources
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
}

// Delete Income Source
exports.deleteIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({msg: "Income deleted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
}

// Download Income Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({ userId }).sort({ date: -1 });
        
        //prepare data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date.toLocaleDateString(),
        }));

        //create Excel file
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Income");
        XLSX.writeFile(wb, "Income_Details.xlsx");
        res.download("Income_Details.xlsx", (err) => {
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

