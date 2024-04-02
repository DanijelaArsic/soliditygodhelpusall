import { useState } from "react";
import ExpenseFactory from '../../contracts/ExpenseFactory.json';

const CreateExpenseModal = ({ onClose, web3, account, expenseFactoryAddress }) => {
    const [expenseData, setExpenseData] = useState({
        amount: '',
        date: '',
        category: '',
        description: ''
    });

    const handleChange = (e) => {
        setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
            console.log('MetaMask is not installed or not connected!');
            return;
        }
        if (!web3 || !account) {
            alert("Web3 instance or account is not available.");
            return;
        }

        // Check if all required fields are filled
        const requiredFields = ['amount', 'date', 'category', 'description'];
        for (const field of requiredFields) {
            if (!expenseData[field]) {
                alert(`Please fill in the ${field} field.`);
                return;
            }
        }

        // Parse manually entered date (DDMMYYYY) and convert to Unix timestamp in seconds
        const day = expenseData.date.substring(0, 2);
        const month = expenseData.date.substring(2, 4);
        const year = expenseData.date.substring(4, 8);
        const formattedDate = `${year}-${month}-${day}`;
        const dateInSeconds = Math.floor(new Date(formattedDate).getTime() / 1000);

        try {
            const expenseFactory = new web3.eth.Contract(ExpenseFactory.abi, expenseFactoryAddress);

            const transactionParameters = {
                to: expenseFactoryAddress,
                from: account,
                data: expenseFactory.methods.addExpense(
                    expenseData.amount,
                    expenseData.date,
                    expenseData.category,
                    expenseData.description
                ).encodeABI(),

            };

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            console.log("Transaction Hash:", txHash);
            onClose();
        } catch (error) {
            console.error("Error sending transaction:", error);
            alert("Failed to create expense. See console for details.");
        }
    };

    return (
        <div className="create-expense-modal">
            <div className="modal-content">
                <input className="modal-input" name="amount" type="text" placeholder="Amount" onChange={handleChange} />
                <input className="modal-input" name="date" type="text" placeholder="Date (DDMMYYYY)" onChange={handleChange} />
                <input className="modal-input" name="category" type="text" placeholder="Category" onChange={handleChange} />
                <input className="modal-input" name="description" type="text" placeholder="Description" onChange={handleChange} />
                <button className="modal-button" onClick={handleSubmit}>Create Expense</button>
                <button className="modal-button cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateExpenseModal;