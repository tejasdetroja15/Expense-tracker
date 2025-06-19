const ExcelJS = require('exceljs');
const Expense = require("../models/Expense");


exports.addExpense = async (req, res) => {
    console.log("Request body:", req.body); 
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

exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.updateExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { category, amount, date, icon } = req.body;

        if (!date || !category || !amount) {
            return res.status(400).json({ msg: "Please fill in all fields" });
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId },
            {
                category,
                amount,
                date: new Date(date),
                icon: icon || "default-icon"
            },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ msg: "Expense not found" });
        }

        res.json({ msg: "Expense updated successfully", expense: updatedExpense });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ msg: "Expense deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expense');

        worksheet.columns = [
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Date', key: 'date', width: 15 }
        ];
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' }
        };

        expense.forEach(item => {
            worksheet.addRow({
                category: item.category,
                amount: item.amount,
                date: item.date.toLocaleDateString()
            });
        });

        worksheet.eachRow({ includeEmpty: false }, function(row) {
            row.eachCell({ includeEmpty: false }, function(cell) {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Expense_Details.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

