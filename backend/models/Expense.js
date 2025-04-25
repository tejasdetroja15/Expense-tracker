const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    icon: {
        type: String,
        default: "default-icon",
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);