// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./ExpenseEntry.sol";

contract ExpenseFactory {
    ExpenseEntry[] public expenseEntries;

    function createExpenseEntry() public {
        ExpenseEntry newExpenseEntry = new ExpenseEntry();
        expenseEntries.push(newExpenseEntry);
    }

    function addExpense(uint _amount, uint _date, string memory _category, string memory _description) public {
    ExpenseEntry expenseEntry = expenseEntries.length > 0 ? expenseEntries[0] : new ExpenseEntry();
    expenseEntry.addExpense(msg.sender, _amount, _date, _category, _description);
}

    function getAllExpenses() external view returns (ExpenseEntry[] memory) {
        return expenseEntries;
    }
}

