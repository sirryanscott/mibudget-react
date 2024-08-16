import './App.css';
import AccountsList from './components/AccountsList';
import BudgetAndTransactions from './components/BudgetAndTransactions';
import { CategoryProvider } from './GlobalStateContext/CategoryStateProvider';
import { MerchantProvider } from './GlobalStateContext/MerchantStateProvider';

function App() {
  return (
    <MerchantProvider>
      <CategoryProvider>
        <div className="App">
          <AccountsList/>
          <BudgetAndTransactions/>
        </div>
      </CategoryProvider>
    </MerchantProvider>
  );
}

export default App;
