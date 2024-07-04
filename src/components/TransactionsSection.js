import { useState } from "react";
import { formatCurrency } from "../utils/FormatCurrency";
import "../styles/BudgetAndTransactions.css"
import Modal from "../modals/AddModal";
import NewTransactionModal from "../modals/NewTransactionModal";

function TransactionsSection({originalTransactions}) {
    const [selectedContent, setSelectedContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState(originalTransactions);

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
                <NewTransactionModal transactions={originalTransactions}/>
            );
          case 'newIncome':
            return <p>This is the content for Option B.</p>;
          case 'accountTransfer':
            return <p>This is the content for Option C.</p>;
          default:
            return <p>Please select an option to see the content.</p>;
        }
    };
                      /*
                  <Modal onClose={() => setModalOpen(false)}>
                    <h2 className="modal-title">New Transaction</h2>
                    <form onSubmit={addItem}>
                      <label htmlFor="newItem">New Item:</label>
                      <input id="newItem" type="text"></input>
                      <button type="submit">Add</button>
                    </form>
                  </Modal>
                          <select value={selectedContent} onChange={handleChange}>
                  */
    return (
        <div>
            <h3>
                Transactions
                <button className="new-item" onClick={handleOpenModal}>+</button>
                  {isModalOpen && (
                  <Modal 
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
                  <th>Account</th>
                  <th>Total Amount</th>
                  <th>Merchant</th>
                  <th>Category</th>
                  <th>Description</th>
              </tr>
                {transactions?.map((transaction, index) => (
                    <tr key={index}>
                       <td><input type="checkbox" id={index} name="paid"/></td>
                       <td><input type="checkbox" id={index} name="cleared"/></td>
                       <td>{transaction.date}</td>
                       <td>{transaction.account}</td>
                       <td>{formatCurrency(transaction.total)}</td>
                       <td>{transaction.merchant}</td>
                       <td>{transaction.category}</td>
                       <td>{transaction.description}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

export default TransactionsSection
