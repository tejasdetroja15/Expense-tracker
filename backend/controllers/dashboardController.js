const mongoose = require("mongoose");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getDashboardData = async (req, res) => {
    try {
        console.log("📊 Dashboard Data Fetching...");

        const userId = req.user._id;
        const userIdObject = new mongoose.Types.ObjectId(userId);

        // Get cutoff dates
        const today = new Date();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

        console.log("🔍 30 days ago:", thirtyDaysAgo.toISOString());
        console.log("🔍 60 days ago:", sixtyDaysAgo.toISOString());

        // Fetch all income and expense records
        const incomeRecords = await Income.find({ userId: userIdObject });
        const expenseRecords = await Expense.find({ userId: userIdObject });

        // Total Income and Expenses
        const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0);
        const totalExpense = expenseRecords.reduce((sum, record) => sum + record.amount, 0);

        console.log("💰 Total Income:", totalIncome);
        console.log("💸 Total Expense:", totalExpense);

        // Get last 60 days' income
        const last60DaysIncomeTransactions = await Income.find({
            userId: userIdObject
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);

        // Get last 30 days' expenses
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userIdObject
        }).sort({ date: -1 });

        const expenseLast30Days = last30DaysExpenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);

        // Get recent 5 transactions (income + expense)
        const recentIncomes = await Income.find({ userId: userIdObject }).sort({ date: -1 }).limit(5);
        const recentExpenses = await Expense.find({ userId: userIdObject }).sort({ date: -1 }).limit(5);

        const lastTransactions = [
            ...recentIncomes.map(txn => ({ ...txn.toObject(), type: "income" })),
            ...recentExpenses.map(txn => ({ ...txn.toObject(), type: "expense" }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5); // Optional slice to limit to 5

        // Final response
        res.json({
            totalBalance: totalIncome - totalExpense,
            totalExpenses: totalExpense,
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });

    } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};
