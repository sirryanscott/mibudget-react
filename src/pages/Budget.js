import AccountsList from "../components/AccountsList";
import BudgetAndTransactions from "../components/BudgetAndTransactions";

function Budget() {
  return (
    <div>
        <AccountsList/>
        <BudgetAndTransactions/>
    </div>
  );
}

export default Budget;