import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import ZipcodeAndTaxRatesUpdater from './pages/ZipcodeAndTaxRatesUpdater';
import { CategoryProvider } from './GlobalStateContext/CategoryStateProvider';
import { MerchantProvider } from './GlobalStateContext/MerchantStateProvider';
import Budget from './pages/Budget';

function App() {
  return (
    <div className="App">
      <MerchantProvider>
        <CategoryProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Budget/>} />
                <Route path="/zipcode" element={<ZipcodeAndTaxRatesUpdater/>} />
              </Routes>
            </Router>
        </CategoryProvider>
      </MerchantProvider>
    </div>
  );
}

export default App;
