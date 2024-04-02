import React, { useState, useEffect } from "react";
import ExpenseDetailsModal from '../ExpenseDetailsModal/ExpenseDetailsModal.js';
import ExpenseFactory from '../../contracts/ExpenseFactory.json';

const ExpenseList = ({ web3, account, expenseFactoryAddress }) => {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const loadExpenses = async () => {
        try {
            const expenseFactory = new web3.eth.Contract(
                ExpenseFactory.abi,
                expenseFactoryAddress,
            );

            const expensesFromContract = await expenseFactory.methods.getAllExpenses().call();
            setExpenses(expensesFromContract);
        } catch (error) {
            setError(error.message || "An error occurred while loading expenses.");

        }
    };

    useEffect(() => {
        if (web3) {
            loadExpenses();
        }
    }, [web3]);

    const openDetailsModal = (expense) => {
        setSelectedExpense(expense);
    };


    return (
        <div className="expense-list">
            <h1 className="expense-list-title">Expense Tracker</h1>
            {loading ? (
                <div>Loading expenses...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                expenses.map((expense, index) => (
                    <div key={index} className="expense-item" onClick={() => openDetailsModal(expense)}>
                        Expense {index + 1}
                    </div>
                ))
            )}
            {selectedExpense && <ExpenseDetailsModal web3={web3} account={account} expense={selectedExpense} onClose={() => setSelectedExpense(null)} />}
        </div>
    );
};

export default ExpenseList;
