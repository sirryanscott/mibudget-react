import {useState} from "react"
import "../styles/NewIncomeTransactionModal.css"
import AccountSelectDropdown from "../components/AccountSelectDropdown";

function NewBankTransferModal({transactions}){
    const [transactionDate, setTransactionDate] = useState('')
    const [description, setDescription] = useState('')
    const [totalAmount, setTotalAmount] = useState('')

    const [selectedFromAccount, setSelectedFromAccount] = useState({label:"Select or Create Account", value:{}})
    const [selectedToAccount, setSelectedToAccount] = useState({label:"Select or Create Account", value:{}})

    const addTransaction = (event) => {
        event.preventDefault()
        transactions.push(
            {
                "category": "Bank Transfer",
                "date": transactionDate, 
                "paymentMethod": {"nickname": selectedFromAccount.value.nickname}, 
                "totalAmount": -totalAmount, 
                "description":description
            })
        transactions.push(
            {
                "category": "Bank Transfer",
                "date": transactionDate, 
                "paymentMethod": {"nickname": selectedToAccount.value.nickname}, 
                "totalAmount": totalAmount, 
                "description":description
            })

        setTransactionDate('')
        setSelectedFromAccount({label:"Select or Create Account", value:{}})
        setSelectedToAccount({label:"Select or Create Account", value:{}})
        setTotalAmount('')
        setDescription('')
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleTransactionDateSelect = (e) => {
        setTransactionDate(e.target.value)
    }
    const handleTotalChange = (e) => {
        setTotalAmount(e.target.value)
    }

    const isFormValid = () => {
        return transactionDate === '' || selectedFromAccount.value.nickname === '' || selectedToAccount.value.nickname === '' || totalAmount === '';
    }

    const customStyles = {
            container: (provided) => ({
            ...provided,
            width: 250, // Set your desired static width here
            fontWeight: "normal",
            fontSize: ".7em",
        }),
    };

    return (
        <div className="new-income-transaction-modal">
            <h2 className="modal-title">New Income Transaction</h2>
            <div className="new-income-form-container">
                <form className="new-transaction-form">
                    <div className="form-group">
                        <label htmlFor="date">Transaction Date:</label>
                        <input id="date" type="date" value={transactionDate} onChange={handleTransactionDateSelect}></input>
                    </div>
                    <AccountSelectDropdown id="fromAccount" selectedAccount={selectedFromAccount} setSelectedAccount={setSelectedFromAccount} isNewMerchantModalOpen={false}/>
                    <AccountSelectDropdown id="toAccount" selectedAccount={selectedToAccount} setSelectedAccount={setSelectedToAccount} isNewMerchantModalOpen={false}/>
                    <div className="form-group">
                        <label htmlFor="total">Total:</label>
                        <input id="total" min="1" type="number" step="any" value={totalAmount} onChange={handleTotalChange}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input id="description" type="text" value={description} onChange={handleDescriptionChange}></input>
                    </div>
                    <br/>
                    <div>
                        <button onClick={addTransaction} disabled={isFormValid()}>Add Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewBankTransferModal

