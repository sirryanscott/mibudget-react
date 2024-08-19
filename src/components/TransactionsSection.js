import React, { useState, useEffect, useContext } from "react";
import { formatCurrency } from "../utils/FormatCurrency";
import "../styles/BudgetAndTransactions.css"
import Modal from "../modals/AddModal";
import CreatableSelect from 'react-select/creatable';
import NewTransactionModal from "../modals/NewTransactionModal";
import NewIncomeTransactionModal from "../modals/NewIncomeTransactionModal";
import NewBankTransferModal from "../modals/NewBankTransferModal";
import { fetchTransactionsForUser } from "../api";
import { MerchantContext } from "../GlobalStateContext/MerchantStateProvider";
import DownRightArrow from "../images/down-right-arrow.svg";

function TransactionsSection() {
    const { selectedMerchant, setSelectedMerchant } = useContext(MerchantContext);
    const [selectedContent, setSelectedContent] = useState({value: 'newTransaction', label: 'New Transaction'});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([])
    const [content, setContent] = useState([
        { value: 'newTransaction', label: 'New Transaction' },
        { value: 'newIncome', label: 'New Income Transaction' },
        { value: 'accountTransfer', label: 'New Account Transfer' }
    ])

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


    const handleChange = (event) => {
        setSelectedContent(event);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setSelectedContent({value: 'newTransaction', label: 'New Transaction'});
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateTransactions = (newTransactions) => {
        setTransactions(newTransactions)
        handleCloseModal()
    }

    const renderContent = () => {
        console.log(selectedContent)
        switch (selectedContent.value) {
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
        switch (selectedContent.value) {
            case 'newTransaction':
                return { 
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    position: 'relative',
                    maxHeight: '90%',
                    overflowY: 'auto',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems: 'center',
                };
            case 'newIncome':
            case 'accountTransfer':
                return { 
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    position: 'relative',
                    maxHeight: '90%',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems: 'center',
                };
            default:
                return {
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    position: 'relative',
                    width: '35%',
                    maxHeight: '90%',
                };
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

    const PrintToConsole = (transaction) => {
        console.log(transaction)
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
                    <CreatableSelect
                        className="transaction-dropdown"
                        value={selectedContent}
                        onChange={handleChange}
                        options={content}
                    />
                          {renderContent()}
                  </Modal>
                )}
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
