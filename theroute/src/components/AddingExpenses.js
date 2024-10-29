//Adding Expenses

import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import AddExpenseForm from './AddExpenseForm';

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const response = await axiosInstance.get('expenses/');
        setExpenses(response.data);
    };

    const handleDelete = async (id) => {
        await axiosInstance.delete(expenses/${id}/);
        fetchExpenses();
    };

    return (
        <div>
            <h1>Expenses</h1>
            <AddExpenseForm fetchExpenses={fetchExpenses} />
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        {expense.category}: ${expense.amount}
                        <button onClick={() => handleDelete(expense.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
