import {useState} from "react"
import CreatableSelect from 'react-select/creatable';
import "../styles/NewIncomeTransactionModal.css"
import initialAccounts from "../mock-data/mockAccounts";

function AddCategoryModal({transactions}){
    const [allAccounts, setAllAccounts] = useState(initialAccounts);

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
                "account": selectedFromAccount.value.name, 
                "total": -totalAmount, 
                "description":description
            })
        transactions.push(
            {
                "category": "Bank Transfer",
                "date": transactionDate, 
                "account": selectedToAccount.value.name, 
                "total": totalAmount, 
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

    const handleToAccountChange = (account) => {
        setSelectedToAccount(account)
    }

    const handleFromAccountChange = (account) => {
        setSelectedFromAccount(account)
    }

    const handleAccountCreate = (account) => {
        setAllAccounts([...allAccounts, { value: {name:account}, label: account }])
    }

    const handleTransactionDateSelect = (e) => {
        setTransactionDate(e.target.value)
    }
    const handleTotalChange = (e) => {
        setTotalAmount(e.target.value)
    }

    const isFormValid = () => {
        return transactionDate === '' || selectedFromAccount.value.name === '' || selectedToAccount.value.name === '' || totalAmount === '';
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
                    <div className="form-group">
                        <label htmlFor="fromAccount">From Account:</label>
                        <CreatableSelect
                            id="fromAccount"
                            value={selectedFromAccount}
                            onChange={handleFromAccountChange}
                            onCreateOption={handleAccountCreate}
                            options={allAccounts}
                            placeholder="Select or Create Account"
                            isSearchable
                            styles={customStyles}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="toAccount">To Account:</label>
                        <CreatableSelect
                            id="toAccount"
                            value={selectedToAccount}
                            onChange={handleToAccountChange}
                            onCreateOption={handleAccountCreate}
                            options={allAccounts}
                            placeholder="Select or Create Account"
                            isSearchable
                            styles={customStyles}
                        />
                    </div>
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

export default AddCategoryModal

