import React, { useContext, useEffect } from 'react';
import { createMerchantForUser } from "../api";
import { convertObjectsToOptions } from '../utils/ConvertToOptions';
import CategorySelector from '../components/DropdownComponents/CategorySelector';
import { MerchantContext } from '../GlobalStateContext/MerchantStateProvider';
import TaxCategorySelector from '../components/DropdownComponents/TaxCategorySelector';

function NewMerchantModal(
    {
        newMerchantName, 
        setMerchantName,
        selectedBudgetCategory, 
        selectedTaxCategory, 
        setSelectedTaxCategory,
        setIsNewMerchantModalOpen, 
        setSelectedMerchant,
        setSelectedBudgetCategory,
    }) {
    
    const { setMerchants } = useContext(MerchantContext);

    useEffect(() => {
        if (selectedTaxCategory === null || JSON.stringify(selectedTaxCategory) === '{}') {
            return;
        }
        setSelectedTaxCategory(selectedTaxCategory)
    }, [selectedTaxCategory])

    const handleMerchantCreate = async(event) => {
        event.preventDefault()

        let merchant = {
            "name": newMerchantName,
            "budgetCategory": selectedBudgetCategory.value,
            "taxCategoryType": selectedTaxCategory.value,
        }
        try {
            const response = await createMerchantForUser(1, merchant);
            let convertedResponse = convertObjectsToOptions(response)
            setMerchants(convertedResponse)
            for (let i = 0; i < convertedResponse.length; i++) {
                if (convertedResponse[i].value.name === newMerchantName) {
                    setSelectedMerchant(convertedResponse[i])
                    return
                }
            }
        } catch (error) {
            console.error('Error creating merchant:', error);
        } finally {
            setIsNewMerchantModalOpen(false);
        }
    }

    const handleMerchantNameChange = (e) => {
        setMerchantName(e.target.value)
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
        <div>
            <div className="new-merchant-modal">
                <h2 className="modal-title">New Merchant</h2>
                <div className="new-merchant-form-container">
                    <form className="new-merchant-form">
                        <div className="form-group">
                            <label htmlFor="merchantName">Merchant Name:</label>
                            <input id="merchantName" type="text" value={newMerchantName} onChange={handleMerchantNameChange}></input>
                        </div>
                        <CategorySelector id="budgetCategory" selectedCategory={selectedBudgetCategory} setSelectedCategory={setSelectedBudgetCategory} isNewMerchantModalOpen={false}/>
                        <TaxCategorySelector id="taxCategory" selectedTaxCategory={selectedTaxCategory} setSelectedTaxCategory={setSelectedTaxCategory} isNewMerchantModalOpen={false}/>
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