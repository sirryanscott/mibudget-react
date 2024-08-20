import React, { useState, useEffect, useContext } from "react";
import { formatCurrency } from "../utils/FormatCurrency";
import "../styles/BudgetAndTransactions.css"
import { fetchTransactionsForUser } from "../api";
import DownRightArrow from "../images/down-right-arrow.svg";
import IncomeModalSelectionMenu from "./IncomeModalSelectionMenu";

function TransactionsSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const data = await fetchTransactionsForUser(1);
                console.log(data)
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        getTransactions();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateTransactions = (newTransactions) => {
        setTransactions(newTransactions)
        handleCloseModal()
    }

    const getTransactionRowStyle = (transaction) => {
        if(transaction.category === 'Bank Transfer')
            return 'bank-transfer-transaction'
        if(transaction.totalAmount > 0)
            return 'positive-transaction'
        if(!transaction.isChild)
            return 'parent-transaction'
        if(transaction.isChild)
            return 'child-transaction'
        return ''
    }

    const PrintToConsole = (transaction) => {
        console.log(transaction)
    }

    return (
        <div>
            <h3 style={{display:'flex',justifyContent:'center'}}>
                Transactions
                <IncomeModalSelectionMenu transactions={transactions} handleUpdateTransactions={handleUpdateTransactions} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
            </h3>
            <div className="transactions-container">
                <table >
                    <thead style={isModalOpen ? { zIndex: -1 } : {}}>
                        <tr>
                            <th className="center-text">P</th>
                            <th className="center-text">C</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Merchant</th>
                            <th>Category</th>
                            <th>Account</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.map((transaction, index) => (
                            <React.Fragment key={transaction.id}>
                            {PrintToConsole(transaction)}
                                <tr className={getTransactionRowStyle(transaction)} key={transaction.id}> {/* change key to be the id of the transaction */}
                                <td><input style={transaction.isCC ? {} : {display:'none'}} type="checkbox" id={index} name="paid"/></td>
                                <td><input type="checkbox" id={index} name="cleared"/></td>
                                <td style={{ maxWidth: '70px' }}>{transaction.date.split(' ')[0]}</td>
                                <td>{formatCurrency(transaction.totalAmount)}</td>
                                <td>{transaction.merchant.name}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.paymentMethod.name}</td>
                                <td>{transaction.description}</td>
                                </tr>
                                {transaction.childTransactions && transaction.childTransactions.map((child, i) => (
                                    <tr className={getTransactionRowStyle(child)} key={i}> {/* change key to be the id of the transaction */}
                                    <td></td>
                                    <td></td>
                                    <td style={{ maxWidth: '70px' }}><img src={DownRightArrow} alt="My SVG" width="100" height="20" /></td>
                                    <td>{formatCurrency(child.totalAmount)}</td>
                                    <td>{child.merchant.name}</td>
                                    <td>{child.category}</td>
                                    <td>{transaction.paymentMethod.name}</td>
                                    <td>{child.description}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionsSection
