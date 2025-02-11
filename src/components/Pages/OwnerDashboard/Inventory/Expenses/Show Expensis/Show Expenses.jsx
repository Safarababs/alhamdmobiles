import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ShowExpenses.css";

const ShowExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const fetchExpenseData = async () => {
    const database = getDatabase(app);
    const expensesRef = ref(database, "expenses");

    try {
      const snapshot = await get(expensesRef);
      if (snapshot.exists()) {
        const expensesArray = [];
        snapshot.forEach((childSnapshot) => {
          const expense = childSnapshot.val();
          expense.key = childSnapshot.key; // Store the Firebase key
          expensesArray.push(expense);
        });
        setExpenses(expensesArray);
        toast.success("Expenses data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching expenses data:", error);
      toast.error("Failed to load expenses data!");
    }
  };

  return (
    <div className="view-expenses-section">
      <h2>Here is your expense details</h2>
      <div className="view-expenses-table">
        <table className="view-expenses-table-element">
          <thead className="view-expenses-table-head">
            <tr>
              <th className="view-expenses-table-th">Amount</th>
              <th className="view-expenses-table-th">Date</th>
              <th className="view-expenses-table-th">Name</th>
            </tr>
          </thead>
          <tbody className="view-expenses-table-body">
            {expenses.map((expense) => (
              <tr className="view-expenses-table-row" key={expense.key}>
                <td className="view-expenses-table-td">{expense.amount}</td>
                <td className="view-expenses-table-td">{expense.date}</td>
                <td className="view-expenses-table-td">{expense.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowExpenses;
