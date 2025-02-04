import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import "./Expenses.css";

const Expenses = () => {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleAddExpense = async () => {
    setLoading(true); // Set loading to true
    const database = getDatabase(app);
    const expensesRef = ref(database, "expenses");

    const newExpense = {
      name: expenseName,
      amount: parseFloat(amount),
      date: date,
    };

    try {
      await push(expensesRef, newExpense);
      toast.success("Expense added successfully!");
      setExpenseName("");
      setAmount("");
      setDate("");
    } catch (error) {
      toast.error("Failed to add expense!");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="add-expense-section-unique">
      <h3 className="add-expense-title-unique">Add Expense</h3>
      <div className="form-group-unique">
        <label className="add-expense-label-unique">Expense Name</label>
        <input
          className="add-expense-input-unique"
          type="text"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />
      </div>
      <div className="form-group-unique">
        <label className="add-expense-label-unique">Amount</label>
        <input
          className="add-expense-input-unique"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="form-group-unique">
        <label className="add-expense-label-unique">Date</label>
        <input
          className="add-expense-input-unique"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button
        className="add-expense-button-unique"
        onClick={handleAddExpense}
        disabled={loading}
      >
        {loading ? <ClipLoader size={24} color={"#fff"} /> : "Add Expense"}
      </button>
    </div>
  );
};

export default Expenses;
