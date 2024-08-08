import CreatableSelect from 'react-select/creatable';
import {createCategoryForUser, createMerchantForUser} from "../api";
import { convertObjectsToOptions } from '../utils/ConvertToOptions';

function NewMerchantModal(
    {
        newMerchantName, 
        budgetCategories, 
        taxCategories, 
        selectedBudgetCategory, 
        selectedTaxCategory, 
        setIsNewMerchantModalOpen, 
        setSelectedMerchant,
        setSelectedBudgetCategory,
        setAllMerchants,
        setBudgetCategories,
    }) {
    const handleBudgetCategoryChange = (selectedOption) => {
        selectedBudgetCategory = selectedOption
    };

    const handleTaxCategoryChange = (selectedOption) => {
        selectedTaxCategory = selectedOption
    };
    
    const handleMerchantCreate = async(event) => {
        event.preventDefault()
        console.log(event)

        let merchant = {
            "name": newMerchantName,
            "budgetCategory": selectedBudgetCategory.value,
            "taxCategory": selectedTaxCategory.value.name
        }
        console.log(merchant)
        try {
            const response = await createMerchantForUser(1, merchant);
            console.log('Merchant created:', response);
            setAllMerchants(convertObjectsToOptions(response))
        } catch (error) {
            console.error('Error creating merchant:', error);
        } finally {
            setIsNewMerchantModalOpen(false);
            setSelectedMerchant({label:newMerchantName, value:{name:newMerchantName}})
        }
    }

    const handleCategoryCreate = async(newCategoryName) => {
        let category = {
            "name": newCategoryName,
        }

        try {
            const response = await createCategoryForUser(1, category);
            console.log('Category created:', response);
            setBudgetCategories(convertObjectsToOptions(response))
        } catch (error) {
            console.error('Error creating category:', error);
        } finally {
            setSelectedBudgetCategory({label:newCategoryName, value:{name:newCategoryName}})
        }
    };


    const customStyles = {
            container: (provided) => ({
            ...provided,
            width: 250, // Set your desired static width here
            fontWeight: "normal",
            fontSize: ".7em",
        }),
    };

    return (
        <div>
            <div className="new-merchant-modal">
                <h2 className="modal-title">New Merchant</h2>
                <div className="new-merchant-form-container">
                    <form className="new-merchant-form">
                        <div className="form-group">
                            <label htmlFor="merchantName">Merchant Name:</label>
                            <input id="merchantName" type="text" value={newMerchantName}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="budgetCategory">Budget Category:</label>
                            <CreatableSelect
                                id="budgetCategory"
                                options={budgetCategories}
                                placeholder="Select or Create Budget Category"
                                isSearchable
                                styles={customStyles}
                                onChange={handleBudgetCategoryChange}
                                onCreateOption={handleCategoryCreate}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="taxCategory">Tax Category:</label>
                            <CreatableSelect
                                id="taxCategory"
                                options={taxCategories}
                                placeholder="Select or Create Tax Category"
                                isSearchable
                                styles={customStyles}
                                onChange={handleTaxCategoryChange}
                            />
                        </div>
                        <div>
                            <button className='new-merchant-button' onClick={handleMerchantCreate}>Add Merchant</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewMerchantModal