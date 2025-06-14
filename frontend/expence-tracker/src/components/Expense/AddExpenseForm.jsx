import React, { useState, useEffect } from "react";
import Input from "../Input/input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense, initialData, isEditing }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: ""
  });

  useEffect(() => {
    if (isEditing && initialData) {
      setExpense({
        category: initialData.category || "",
        amount: initialData.amount || "",
        date: initialData.date ? initialData.date.split('T')[0] : "", // Format date for input type="date"
        icon: initialData.icon || ""
      });
    }
  }, [isEditing, initialData]);
  
  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });
  
  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />
      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="Enter amount"
        type="number"
      />
      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder="Select date"
        type="date"
      />
      <div className="mt-4">
        <button
          type="button"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          onClick={() => onAddExpense(expense)}
        >
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;