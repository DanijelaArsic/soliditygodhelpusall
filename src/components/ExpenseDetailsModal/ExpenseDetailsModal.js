import React from "react";
import { useState, useEffect } from "react";
import Expense from '../../contracts/ExpenseEntry.json'
import './ExpenseDetailsModal.css';

const ExpenseDetailsModal = ({ expense, onClose, web3, account }) => {

    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseCanceled, setExpenseCanceled] = useState(false);


    const loadExpenseDetails = async () => {
        if (web3 && expense) {
            const expenseContract = new web3.eth.Contract(Expense.abi, expense);

            const amount = await expenseContract.methods.amount().call();
            const date = await expenseContract.methods.date().call();
            const category = await expenseContract.methods.category().call();
            const description = await expenseContract.methods.description().call();
            const canceled = await expenseContract.methods.canceled().call();

            setExpenseAmount(amount);
            setExpenseDate(date);
            setExpenseCategory(category);
            setExpenseDescription(description);
            setExpenseCanceled(canceled);
        }
    };

    useEffect(() => {
        loadExpenseDetails();
    }, [web3, expense]);

    const modifyExpense = async () => {
        if (!web3 || !expense || !account) {
            alert("Web3 instance, contract address, or account is not available.");
            return;
        }

        try {
            const expenseContract = new web3.eth.Contract(Expense.abi, expense);

            // Get the modified expense details from the input fields
            const modifiedAmount = parseFloat(document.getElementById("modifiedAmount").value);
            const modifiedDate = new Date(document.getElementById("modifiedDate").value).getTime(); // Parse date into Unix timestamp
            const modifiedCategory = document.getElementById("modifiedCategory").value;
            const modifiedDescription = document.getElementById("modifiedDescription").value;

            // Validate input
            if (isNaN(modifiedAmount) || modifiedAmount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }
            if (!modifiedDate) {
                alert("Please select a valid date.");
                return;
            }
            if (!modifiedCategory.trim()) {
                alert("Please enter a category.");
                return;
            }

            // Call the smart contract function to modify the expense details
            await expenseContract.methods.modifyExpense(
                modifiedAmount,
                modifiedDate,
                modifiedCategory,
                modifiedDescription
            ).send({ from: account });

            // Reload the expense details after modification
            loadExpenseDetails();

            alert("Expense modified successfully.");
        } catch (error) {
            console.error("Error modifying expense: ", error);
            alert("Failed to modify expense. See console for details.");
        }
    };


    const cancelExpense = async () => {
        if (!web3 || !expense || !account) {
            alert("Web3 instance, contract address, or account is not available.");
            return;
        }

        try {
            const expenseContract = new web3.eth.Contract(Expense.abi, expense);

            // Call the smart contract function to cancel the expense
            await expenseContract.methods.cancelExpense().send({ from: account });

            // Reload the expense details after cancellation
            loadExpenseDetails();

            alert("Expense canceled successfully.");
        } catch (error) {
            console.error("Error canceling expense: ", error);
            alert("Failed to cancel expense. See console for details.");
        }
    };

    return (
        <div className="expense-details-modal">
            <h2 className="modal-title">Expense Details</h2>
            <p className="expense-info">Expense Amount: {expenseAmount}</p>
            <p className="expense-info">Expense Date: {expenseDate}</p>
            <p className="expense-info">Expense Category: {expenseCategory}</p>
            <p className="expense-info">Expense Description: {expenseDescription}</p>
            <p className="expense-info">Expense Canceled: {expenseCanceled ? 'Yes' : 'No'}</p>

            {!expenseCanceled && (
                <button className="cancel-button" onClick={cancelExpense}>Cancel Expense</button>
            )}

            <input type="text" id="modifiedAmount" placeholder="Modified Amount" />
            <input type="text" id="modifiedDate" placeholder="Modified Date" />
            <input type="text" id="modifiedCategory" placeholder="Modified Category" />
            <input type="text" id="modifiedDescription" placeholder="Modified Description" />


            <button className="modify-button" onClick={modifyExpense}>Modify Expense</button>
            <button className="close-button" onClick={onClose}>Close</button>
        </div>
    );
}
export default ExpenseDetailsModal;