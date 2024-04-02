import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ExpenseList from "../ExpenseList/ExpenseList";
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal";

const expenseFactoryAddress = "0xa4cB2ba45C643d2e7745FBaAc90cC64ACdEeB12B";
const sepoliaRPCUrl = "https://sepolia.infura.io/v3/5abbb3fcfc364ea781c05972e5411b04";

const Main = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                console.log("Connected to Ethereum account: ", accounts[0]);
                window.ethereum.on('accountsChanged', (newAccounts) => {
                    setAccount(newAccounts[0]);
                    console.log("Switched to account: ", newAccounts[0]);
                });
            } else {
                console.log("MetaMask is not installed.");
            }
        } catch (error) {
            console.error("Error connecting to MetaMask: ", error);
        }
    };

    useEffect(() => {
        const web3Instance = new Web3(sepoliaRPCUrl);
        console.log("Web3 instance created: ", web3Instance);

        // Set the web3 state
        setWeb3(web3Instance);
        console.log("Web3 instance set up: ", web3Instance); // <- Change 'web3' to 'web3Instance' here

        connectWallet();
    }, []);


    return (
        <div className="main-container">
            {!account && (
                <button className="connect-wallet-button" onClick={connectWallet}>
                    Connect with MetaMask
                </button>
            )}
            <ExpenseList className="expense-list" web3={web3} account={account} expenseFactoryAddress={expenseFactoryAddress} />
            <button className="add-expense-button" onClick={() => setShowCreateModal(true)}>
                Add your expense
            </button>
            {showCreateModal && (
                <CreateExpenseModal className="create-expense-modal" web3={web3} account={account} onClose={() => setShowCreateModal(false)} expenseFactoryAddress={expenseFactoryAddress} />
            )}
        </div>
    );
};

export default Main;
