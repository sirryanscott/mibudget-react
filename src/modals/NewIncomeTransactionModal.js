import {useState, useEffect} from "react"
import CreatableSelect from 'react-select/creatable';
import "../styles/NewIncomeTransactionModal.css"
import TaxCategories from "../mock-data/taxCategories";
import {createTransactionForUser, createCategoryForUser, fetchCategoriesForUser, fetchMerchantsForUser} from "../api";
import Modal from "../modals/AddModal";
import NewMerchantModal from "./NewMerchantModal";
import { convertObjectsToOptions } from "../utils/ConvertToOptions";
import AccountSelectDropdown from "../components/AccountSelectDropdown";

function NewIncomeTransactionModal({transactions}){
    const [allMerchants, setAllMerchants] = useState([]);
    const [budgetCategories, setBudgetCategories] = useState([])
    const [taxCategories, setTaxCategories] = useState(TaxCategories)

    const [transactionDate, setTransactionDate] = useState('')
    const [description, setDescription] = useState('')
    const [totalAmount, setTotalAmount] = useState('')

    const [selectedAccount, setSelectedAccount] = useState({label:"Select or Create Account", value:{}})
    const [selectedBudgetCategory, setSelectedBudgetCategory] = useState({label:"Select or Create Category", value:{}})
    const [selectedTaxCategory, setSelectedTaxCategory] = useState({label:"Select or Create Category", value:{}})
    const [selectedMerchant, setSelectedMerchant] = useState({label:"Select or Create Merchant", value:{}})

    const [isNewMerchantModalOpen, setIsNewMerchantModalOpen] = useState(false);

    const [newMerchantName, setNewMerchantName] = useState('')

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [merchants, categories] = await Promise.all([
                    fetchMerchantsForUser(1),
                    fetchCategoriesForUser(1),
                ]);
                setAllMerchants(convertObjectsToOptions(merchants));
                setBudgetCategories(convertObjectsToOptions(categories));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        setAllMerchants({label:"Loading...", value:{}})
        setBudgetCategories({label:"Loading...", value:{}})
    }

    const addTransaction = async (event) => {
        event.preventDefault()
        let transaction = 
            {
                "category": {"name": selectedBudgetCategory.value}, 
                "date": transactionDate, 
                "merchant": {"id":selectedMerchant.value.id, "name":selectedMerchant.value.name}, 
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
        setSelectedMerchant(merchant);

        if (merchant.value.budgetCategory === undefined) {
            setSelectedBudgetCategory({ label: "Select Budget Category", value: {} });
        } else {
            if (merchant.value.budgetCategory.id === 0) {
                setSelectedTaxCategory({ label: "Select Tax Category", value: {} });
            } else {
                let budgetCategory = merchant.value.budgetCategory;
                setSelectedBudgetCategory(convertObjectsToOptions([budgetCategory])[0]);
            }
        }
    };

    const openMerchantCreateModal = (merchantName) => {
        setIsNewMerchantModalOpen(true)
        setNewMerchantName(merchantName)
    }

    const handleCloseMerchantModal = async(event) => {
        event.preventDefault()
        try {
            const response = await fetchMerchantsForUser(1);
            setAllMerchants(convertObjectsToOptions(response))
        } catch (error) {
            console.error('Error fetching merchants:', error);
        } finally {
            setIsNewMerchantModalOpen(false);
            setSelectedMerchant({label:newMerchantName, value:{name:newMerchantName}})
        }
    };

    const handleCategoryCreate = async(newCategoryName) => {
        let category = {
            "name": newCategoryName,
        }

        try {
            const response = await createCategoryForUser(1, category);
            setBudgetCategories(convertObjectsToOptions(response))
        } catch (error) {
            console.error('Error creating category:', error);
        } finally {
            setSelectedBudgetCategory({label:newCategoryName, value:{name:newCategoryName}})
        }
    };

    const handleBudgetCategoryChange = (category) => {
        setSelectedBudgetCategory(category)
    }

    const handleTaxCategoryChange = (taxCategory) => {
        setSelectedTaxCategory(taxCategory)
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
                        budgetCategories={budgetCategories} 
                        taxCategories={taxCategories}
                        selectedBudgetCategory={selectedBudgetCategory}
                        selectedTaxCategory={selectedTaxCategory}
                        setSelectedMerchant={setSelectedMerchant}
                        setSelectedBudgetCategory={setSelectedBudgetCategory}
                        setIsNewMerchantModalOpen={setIsNewMerchantModalOpen}
                        setAllMerchants={setAllMerchants}
                        setBudgetCategories={setBudgetCategories}
                    />
                </Modal>
                )}
            </div>
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
                                className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                                id="merchantName"
                                value={selectedMerchant}
                                onChange={handleMerchantChange}
                                onCreateOption={openMerchantCreateModal}
                                options={allMerchants}
                                placeholder="Select or Create Merchant"
                                isSearchable
                                styles={customStyles}
                            />
                        </div>
                        <AccountSelectDropdown id="account" selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} isNewMerchantModalOpen={isNewMerchantModalOpen}/>
                        <div className="form-group">
                            <label htmlFor="budgetCategory">Budget Category:</label>
                            <CreatableSelect
                                className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                                id="budgetCategory"
                                value={selectedBudgetCategory}
                                onChange={handleBudgetCategoryChange}
                                onCreateOption={handleCategoryCreate}
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
        </div>
    );
}

export default NewIncomeTransactionModal

