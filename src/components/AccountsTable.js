import { useState } from "react";
import { formatCurrency } from "../utils/FormatCurrency";
import "../styles/AccountsTable.css";

function AccountsList({accounts}){
    const [hideAmounts, setHideAmounts] = useState(false);

    const toggleHideAmounts = () => {
        setHideAmounts(!hideAmounts);
    };

    return (
    <div className="button-container">
        <div>
        {/*
            <button onClick={toggleHideAmounts}>
              {hideAmounts ? 'Show Amounts' : 'Hide Amounts'}
            </button>
        */}
        </div>    
        <div className="account-container">
            {accounts.map((account, index) => (
                <div key={index} className="account-item">
                    <h3>{account.name}</h3>
                    <p><b>Current Balance: {hideAmounts ? '$ -----' : formatCurrency(account.currentBalance)}</b></p>
                    <p><i>Pending Amount: {hideAmounts ? '$ -----' : formatCurrency(account.pendingBalance)}</i></p>
                    <p className={account.balanceAfterPending < 0 ? 'negative' : ''}>
                        Balance <i>After</i> Pending: {hideAmounts ? '$ -----' : formatCurrency(account.balanceAfterPending)}
                    </p>
                </div>
            ))}
        </div>
    </div>
  );
}

export default AccountsList
