import BudgetAmounts from "./BudgetAmounts";
import "../styles/BudgetAndTransactions.css";
import TransactionsSection from "./TransactionsSection";

let budgetAmounts = [{"category":"Groceries", "budgetAmount":1000, "adjust":0,"spent":-600,"remaining":600},{"category":"Restaurants", "budgetAmount":200, "adjust":50,"spent":-60,"remaining":-190}]

let transactions = [{"date":"6/26/2024", "account":"Citi", "total":-65, "category":"Restaurants", "merchant":"Mo'bettahs", "description":"", "isCC":true}]


function BudgetAndTransactions() {
    return (
        <div>
            <h1>June</h1>
            <div className="main-container">
                <div className="budget-section">
                 <BudgetAmounts budgetAmounts={budgetAmounts}/>
                </div>
                <div className="transactions-section">
                 <TransactionsSection/>
                </div>
            </div>
        </div>
    );
}

export default BudgetAndTransactions
