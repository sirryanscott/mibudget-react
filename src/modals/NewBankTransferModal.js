import {useState} from "react"
import "../styles/NewIncomeTransactionModal.css"
import AccountSelectDropdown from "../components/DropdownComponents/AccountSelector";
import { AccountPlaceholder } from "../constants/Placeholders";

function NewBankTransferModal({transactions}){
    const [transactionDate, setTransactionDate] = useState('')
    const [description, setDescription] = useState('')
    const [totalAmount, setTotalAmount] = useState('')

    const [selectedFromAccount, setSelectedFromAccount] = useState(AccountPlaceholder)
    const [selectedToAccount, setSelectedToAccount] = useState(AccountPlaceholder)
    
    const addTransaction = (event) => {
        event.preventDefault()
        console.log(selectedFromAccount)
        console.log(selectedToAccount)
        transactions.push(
            {
                "category": "Bank Transfer",
                "date": transactionDate, 
                "paymentMethod": selectedFromAccount.value,
                "totalAmount": -totalAmount, 
                "description":description,
                "merchant": {"id":0, "name":""},
            })
        transactions.push(
            {
                "category": "Bank Transfer",
                "date": transactionDate, 
                "paymentMethod": selectedToAccount.value, 
                "totalAmount": totalAmount, 
                "description":description,
                "merchant": {"id":0, "name":""},
            })

        setTransactionDate('')
        setSelectedFromAccount(AccountPlaceholder)
        setSelectedToAccount(AccountPlaceholder)
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
            <div className="new-income-form-container">
                <form className="new-transaction-form">
                    <div className="form-group">
                        <label htmlFor="date">Transaction Date:</label>
                        <input id="date" type="date" value={transactionDate} onChange={handleTransactionDateSelect}></input>
                    </div>
                    <AccountSelectDropdown id="fromAccount" accountLabel="From Account" selectedAccount={selectedFromAccount} setSelectedAccount={setSelectedFromAccount} isNewMerchantModalOpen={false} isBankTransfer={true} setSelectedFromAccount={setSelectedFromAccount}/>
                    <AccountSelectDropdown id="toAccount" accountLabel="To Account" selectedAccount={selectedToAccount} setSelectedAccount={setSelectedToAccount} isNewMerchantModalOpen={false} isBankTransfer={true} selectedFromAccount={selectedFromAccount}/>
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

