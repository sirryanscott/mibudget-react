import {useState} from "react"
import { formatCurrency } from "../utils/FormatCurrency"
import CreatableSelect from 'react-select/creatable';
import "../styles/NewIncomeTransactionModal.css"
import initialAccounts from "../mock-data/mockAccounts";
import initialMerchants from "../mock-data/mockMerchants";
import BudgetCategories from "../mock-data/budgetCategories";
import {createTransactionForUser} from "../api";

function NewIncomeTransactionModal({transactions}){
    const [allAccounts, setAllAccounts] = useState(initialAccounts);
    const [allMerchants, setAllMerchants] = useState(initialMerchants);
    const [budgetCategories, setBudgetCategories] = useState(BudgetCategories)

    const [transactionDate, setTransactionDate] = useState('')
    const [description, setDescription] = useState('')
    const [totalAmount, setTotalAmount] = useState('')

    const [selectedAccount, setSelectedAccount] = useState({label:"Select or Create Account", value:{}})
    const [selectedBudgetCategory, setSelectedBudgetCategory] = useState({label:"Select or Create Category", value:{}})
    const [selectedMerchant, setSelectedMerchant] = useState({label:"Select or Create Merchant", value:{}})

    const addTransaction = async (event) => {
        event.preventDefault()
        let transaction = 
            {
                "category": {"name": selectedBudgetCategory.value}, 
                "date": transactionDate, 
                "merchant": {"name":selectedMerchant.value.name}, 
                "paymentMethod": {"nickname": selectedAccount.value.nickname}, 
                "totalAmount": parseFloat(totalAmount), 
                "description":description
            }
        transactions.push(transaction)

        try {
            const response = await createTransactionForUser(1, transaction);
            console.log('Transaction created:', response.data);
            // Handle success, e.g., clear the form or update the state
        } catch (error) {
            console.error('Error creating transaction:', error);
            // Handle error
        }
        // let response = createTransactionForUser(1, transaction)
        // console.log(response)

        setTransactionDate('')
        setSelectedMerchant({label:"Select or Create Merchant", value:{}})
        setSelectedAccount({label:"Select or Create Account", value:{}})
        setSelectedBudgetCategory({label:"Select or Create Account", value:{}})
        setTotalAmount('')
        setDescription('')
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleMerchantChange = (merchant) => {
        setSelectedMerchant(merchant)

        let budgetCategory = budgetCategories.find(category => category.value === merchant.value.budgetCategory)

        if(budgetCategory === undefined){
            setSelectedBudgetCategory({label:"Select Budget Category", value:{}})
        } else{
            setSelectedBudgetCategory(budgetCategory)
        }
    }

    const handleMerchantCreate = (merchant) => {
    }

    const handleAccountChange = (account) => {
        setSelectedAccount(account)
    }

    const handleAccountCreate = (account) => {
        const newAccount = { value: {name:account}, label: account };
        setSelectedAccount(newAccount);
        setAllAccounts([...allAccounts, newAccount])
    }

    const handleBudgetCategoryChange = (category) => {
        setSelectedBudgetCategory(category)
    }

    const handleTransactionDateSelect = (e) => {
        setTransactionDate(e.target.value)
    }
    const handleTotalChange = (e) => {
        setTotalAmount(e.target.value)
    }

    const isFormValid = () => {
        return selectedMerchant.value.name === '' || transactionDate === '' || selectedAccount.value.nickname === '' || totalAmount === '';
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
                        <label htmlFor="merchantName">Merchant:</label>
                        <CreatableSelect
                            id="merchantName"
                            value={selectedMerchant}
                            onChange={handleMerchantChange}
                            onCreateOption={handleMerchantCreate}
                            options={allMerchants}
                            placeholder="Select or Create Merchant"
                            isSearchable
                            styles={customStyles}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="account">Account:</label>
                        <CreatableSelect
                            id="account"
                            value={selectedAccount}
                            onChange={handleAccountChange}
                            onCreateOption={handleAccountCreate}
                            options={allAccounts}
                            placeholder="Select or Create Account"
                            isSearchable
                            styles={customStyles}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="budgetCategory">Budget Category:</label>
                        <CreatableSelect
                            id="budgetCategory"
                            value={selectedBudgetCategory}
                            onChange={handleBudgetCategoryChange}
                            options={budgetCategories}
                            placeholder="Select or Create Budget Category"
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

export default NewIncomeTransactionModal

