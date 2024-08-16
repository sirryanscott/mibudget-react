import {useState, useEffect, useContext} from "react"
import "../styles/NewIncomeTransactionModal.css"
import TaxCategories from "../mock-data/taxCategories";
import {createTransactionForUser, fetchMerchantsForUser} from "../api";
import Modal from "../modals/AddModal";
import NewMerchantModal from "./NewMerchantModal";
import AccountSelector from "../components/DropdownComponents/AccountSelector";
import CategorySelector from "../components/DropdownComponents/CategorySelector";
import MerchantSelector from "../components/DropdownComponents/MerchantSelector";
import { MerchantContext } from "../GlobalStateContext/MerchantStateProvider";
import { convertObjectsToOptions } from "../utils/ConvertToOptions";
import { AccountPlaceholder, BudgetCategoryPlaceholder, MerchantPlaceholder, TaxCategoryPlaceholder } from "../constants/Placeholders";

function NewIncomeTransactionModal({transactions}){
    const {selectedMerchant, setSelectedMerchant} = useContext(MerchantContext)
    const [taxCategories, setTaxCategories] = useState(TaxCategories)

    const [transactionDate, setTransactionDate] = useState('')
    const [description, setDescription] = useState('')
    const [totalAmount, setTotalAmount] = useState('')

    const [selectedAccount, setSelectedAccount] = useState(AccountPlaceholder)
    const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(BudgetCategoryPlaceholder) 
    const [selectedTaxCategory, setSelectedTaxCategory] = useState(TaxCategoryPlaceholder)

    const [isNewMerchantModalOpen, setIsNewMerchantModalOpen] = useState(false);
    const [newMerchantName, setNewMerchantName] = useState('')

    useEffect(() => {
        console.log('selectedMerchant:', selectedMerchant)
        if(selectedMerchant.value.budgetCategory === undefined){
            setSelectedBudgetCategory(BudgetCategoryPlaceholder)
        } else{
            if(selectedMerchant.value.budgetCategory.id === 0){
                setSelectedTaxCategory(TaxCategoryPlaceholder)
            } else{
                let budgetCategory = selectedMerchant.value.budgetCategory
                setSelectedBudgetCategory(convertObjectsToOptions([budgetCategory])[0])
            }
        }
    }, [selectedMerchant]);

    const addTransaction = async (event) => {
        event.preventDefault()
        let transaction = 
            {
                "category": selectedBudgetCategory.value.name,
                "date": transactionDate, 
                "merchant": selectedMerchant.value, 
                "paymentMethod": selectedAccount.value, 
                "totalAmount": parseFloat(totalAmount), 
                "description":description
            }
        transactions.push(transaction)

        try {
            const response = await createTransactionForUser(1, transaction);
            // Handle success, e.g., clear the form or update the state
        } catch (error) {
            console.error('Error creating transaction:', error);
            // Handle error
        }

        setTransactionDate('')
        setSelectedMerchant(MerchantPlaceholder)
        setSelectedAccount(AccountPlaceholder)
        setSelectedBudgetCategory(BudgetCategoryPlaceholder)
        setTotalAmount('')
        setDescription('')
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleCloseMerchantModal = async(event) => {
        event.preventDefault()
        setIsNewMerchantModalOpen(false);
        setSelectedMerchant({label:newMerchantName, value:{name:newMerchantName}})
    };

    const handleTransactionDateSelect = (e) => {
        setTransactionDate(e.target.value)
    }
    const handleTotalChange = (e) => {
        setTotalAmount(e.target.value)
    }

    const isFormValid = () => {
        return selectedMerchant.value.name === '' || transactionDate === '' || selectedAccount.value.name === '' || totalAmount === '';
    }

    const getModalStyle = () => {
        return {
            width: '30%',
            height: 'auto',
            zIndex: '100000',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            position: 'relative',
        }
    }

    return (
        <div>
            <div>
                {isNewMerchantModalOpen && (
                <Modal 
                    modalStyle={getModalStyle()}
                    isOpen={isNewMerchantModalOpen} 
                    onClose={handleCloseMerchantModal}
                >
                    <NewMerchantModal 
                        newMerchantName={newMerchantName} 
                        setMerchantName={setNewMerchantName}
                        taxCategories={taxCategories}
                        selectedBudgetCategory={selectedBudgetCategory}
                        selectedTaxCategory={selectedTaxCategory}
                        setSelectedMerchant={setSelectedMerchant}
                        setSelectedBudgetCategory={setSelectedBudgetCategory}
                        setIsNewMerchantModalOpen={setIsNewMerchantModalOpen}
                    />
                </Modal>
                )}
            </div>
            <div className="new-income-transaction-modal">
                <div className="new-income-form-container">
                    <form className="new-transaction-form">
                        <div className="form-group">
                            <label htmlFor="date">Transaction Date:</label>
                            <input id="date" type="date" value={transactionDate} onChange={handleTransactionDateSelect}></input>
                        </div>
                        <MerchantSelector id="merchantName" selectedMerchant={selectedMerchant} setSelectedMerchant={setSelectedMerchant} setNewMerchantName={setNewMerchantName} isNewMerchantModalOpen={isNewMerchantModalOpen} setIsNewMerchantModalOpen={setIsNewMerchantModalOpen}/>
                        <AccountSelector id="account" selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} isNewMerchantModalOpen={isNewMerchantModalOpen}/>
                        <CategorySelector id="budgetCategory" selectedCategory={selectedBudgetCategory} setSelectedCategory={setSelectedBudgetCategory} isNewMerchantModalOpen={isNewMerchantModalOpen}/>
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
        </div>
    );
}

export default NewIncomeTransactionModal