import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/FormatCurrency";
import "../styles/BudgetAndTransactions.css"
import Modal from "../modals/AddModal";
import NewTransactionModal from "../modals/NewTransactionModal";
import NewIncomeTransactionModal from "../modals/NewIncomeTransactionModal";
import NewBankTransferModal from "../modals/NewBankTransferModal";
import { getTransactionsForUser } from "../api";

function TransactionsSection() {
    const [selectedContent, setSelectedContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const data = await getTransactionsForUser(1);
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


    const handleChange = (event) => {
        setSelectedContent(event.target.value);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setSelectedContent('newTransaction');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateTransactions = (newTransactions) => {
        setTransactions(newTransactions)
        handleCloseModal()
    }

    const renderContent = () => {
        switch (selectedContent) {
          case 'newTransaction':
            return (
                <NewTransactionModal transactions={transactions}/>
            );
          case 'newIncome':
            return (
                <NewIncomeTransactionModal transactions={transactions}/>
            );
          case 'accountTransfer':
            return (
                <NewBankTransferModal transactions={transactions}/>
            );
          default:
            return <p>Please select an option to see the content.</p>;
        }
    };

    const getModalStyle = () => {
        switch (selectedContent) {
            case 'newTransaction':
                return { 
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    position: 'relative',
                    width: '90%',
                    maxHeight: '90%',
                    overflowY: 'auto',
                };
            case 'newIncome':
            case 'accountTransfer':
                return { 
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    position: 'relative',
                    width: '35%',
                    maxHeight: '90%',
                    overflowY: 'auto',
                };
            default:
                return {};
        }
    };    

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

    return (
        <div>
            <h3>
                Transactions
                <button className="new-item" onClick={handleOpenModal}>+</button>
                  {isModalOpen && (
                  <Modal 
                      modalStyle={getModalStyle()}
                      onClose={handleCloseModal}
                      onUpdateItems={handleUpdateTransactions}
                  >
                          <select value={selectedContent} onChange={handleChange}>
                            <option value="">Transaction Type</option>
                            <option value="newTransaction">New Transaction</option>
                            <option value="newIncome">New Income</option>
                            <option value="accountTransfer">Account Transfer</option>
                          </select>
                          {renderContent()}
                  </Modal>
                )}
            </h3>
            <table className="budgets-container">
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
                {transactions?.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                        <tr className={getTransactionRowStyle(transaction)} key={transaction.id}> {/* change key to be the id of the transaction */}
                           <td><input style={transaction.isCC ? {} : {display:'none'}} type="checkbox" id={index} name="paid"/></td>
                           <td><input type="checkbox" id={index} name="cleared"/></td>
                           <td>{transaction.date}</td>
                           <td>{formatCurrency(transaction.totalAmount)}</td>
                           <td>Merchant</td>
                           <td>Category</td>
                           {/*<td>{transaction.merchant}</td>*/}
                           {/*<td>{transaction.category}</td>*/}
                           <td>{transaction.paymentMethod.nickname}</td>
                           <td>{transaction.description}</td>
                        </tr>
                        {transaction.childTransactions && transaction.childTransactions.map((child, i) => (
                            <tr className={getTransactionRowStyle(child)} key={i}> {/* change key to be the id of the transaction */}
                               <td></td>
                               <td></td>
                               <td></td>
                               <td>{formatCurrency(child.total)}</td>
                               <td>{child.merchant}</td>
                               <td>{child.category}</td>
                               <td>{child.account}</td>
                               <td>{child.description}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </table>
        </div>
    );
}

export default TransactionsSection
