import React, { useState, useEffect } from 'react';
import Input from '../Input/input';
import EmojiPickerPopup from '../EmojiPickerPopup';

const AddIncomeForm = ({ onAddIncome, initialData = null, isEditing = false }) => {
  const [income, setIncome] = useState({
    source: '',
    amount: '',
    date: '',
    icon: ''
  });

  useEffect(() => {
    if (initialData) {
      setIncome({
        _id: initialData._id,
        source: initialData.source || '',
        amount: initialData.amount || '',
        date: initialData.date ? initialData.date.split('T')[0] : '',
        icon: initialData.icon || ''
      });
    } else {
      // Reset form if not editing
      setIncome({
        source: '',
        amount: '',
        date: '',
        icon: ''
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setIncome({ ...income, [key]: value });
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
        <EmojiPickerPopup
            icon={income.icon}
            onSelect={(selectedIcoon) => {
                handleChange("icon", selectedIcoon)
            }}
        />
        
      <Input
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="Income Source"
        placeholder="Freelance, Salary, etc"
        type="text"
      />
      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="Enter amount"
        type="number"
      />
      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddIncome(income)}
        >
          {isEditing ? "Update Income" : "Add Income"}
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
