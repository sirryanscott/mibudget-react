import './App.css';
import AccountsTable from './components/AccountsTable';
import BudgetAndTransactions from './components/BudgetAndTransactions';

let accounts = [{"name":"Checking", "pendingBalance":1000, "currentBalance":3500, "balanceAfterPending":2500},{"name":"Savings", "pendingBalance":1000, "currentBalance":3500, "balanceAfterPending":2500},{"name":"Citi", "pendingBalance":1000, "currentBalance":3500, "balanceAfterPending":2500},{"name":"Emergency Fund", "pendingBalance":500, "currentBalance":100000, "balanceAfterPending":950000},{"name":"Preschool", "pendingBalance":1000, "currentBalance":3500, "balanceAfterPending":2500},{"name":"3rd Paycheck", "pendingBalance":1000, "currentBalance":3500, "balanceAfterPending":2500},{"name":"Next Month Expenses", "pendingBalance":1000, "currentBalance":3500, "balanceAfterPending":-2500},]

function App() {
  return (
    <div className="App">
      <AccountsTable accounts={accounts}/>
      <BudgetAndTransactions/>
    </div>
  );
}

export default App;
