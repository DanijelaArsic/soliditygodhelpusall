// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract ExpenseEntry {
    struct Expense {
        uint amount;
        uint date;
        string category;
        string description;
        bool canceled;
    }
    
    Expense[] public expenses;
    mapping(address => mapping(uint => bool)) public isExpenseOwner;
    
    event ExpenseAdded(address indexed owner, uint indexed id, uint amount, uint date, string category, string description);
    event ExpenseUpdated(address indexed owner, uint indexed id, uint amount, uint date, string category, string description);
    event ExpenseCanceled(address indexed owner, uint indexed id);
    
    function addExpense(address owner, uint _amount, uint _date, string memory _category, string memory _description) public {
    Expense memory newExpense = Expense(_amount, _date, _category, _description, false);
    expenses.push(newExpense);
    uint id = expenses.length - 1;
    isExpenseOwner[owner][id] = true;
    emit ExpenseAdded(owner, id, _amount, _date, _category, _description);

    }
    
    function updateExpense(uint _id, uint _amount, uint _date, string memory _category, string memory _description) public {
        require(isExpenseOwner[msg.sender][_id], "You are not the owner of this expense.");
        require(!expenses[_id].canceled, "Cannot update a canceled expense.");
        expenses[_id].amount = _amount;
        expenses[_id].date = _date;
        expenses[_id].category = _category;
        expenses[_id].description = _description;
        emit ExpenseUpdated(msg.sender, _id, _amount, _date, _category, _description);
    }
    
    function cancelExpense(uint _id) public {
        require(isExpenseOwner[msg.sender][_id], "You are not the owner of this expense.");
        require(!expenses[_id].canceled, "Expense is already canceled.");
        expenses[_id].canceled = true;
        emit ExpenseCanceled(msg.sender, _id);
    }
}