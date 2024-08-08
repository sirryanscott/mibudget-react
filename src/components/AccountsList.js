import { fetchPaymentMethodsForUser } from "../api";
import { useState, useEffect } from "react";
import { formatCurrency } from "../utils/FormatCurrency";
import "../styles/AccountsTable.css";

function AccountsList(){
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPaymentMethods = async () => {
            try {
                const data = await fetchPaymentMethodsForUser(1);
                setAccounts(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        getPaymentMethods();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
    <div className="button-container">
        <div className="account-container">
            {accounts.map((account, index) => (
                <div key={index} className="account-item">
                    <h3>{account.nickname}</h3>
                    <p><b>Current Balance: {formatCurrency(account.currentBalance)}</b></p>
                    <p><i>Pending Amount: {formatCurrency(account.pendingBalance)}</i></p>
                    <p className={account.balanceAfterPending < 0 ? 'negative' : ''}>
                        Balance <i>After</i> Pending: {formatCurrency(account.balanceAfterPending)}
                    </p>
                </div>
            ))}
        </div>
    </div>
  );
}

export default AccountsList
