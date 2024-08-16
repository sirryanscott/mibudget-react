import React, { useState, useEffect, useContext } from 'react';
import CreatableSelect from 'react-select/creatable';
import { createCategoryForUser, fetchCategoriesForUser, fetchPaymentMethodsForUser } from '../../api';
import { convertObjectsToOptions } from '../../utils/ConvertToOptions';
import { CategoryContext } from '../../GlobalStateContext/CategoryStateProvider';
import { BudgetCategoryPlaceholder } from '../../constants/Placeholders';

function CategorySelector({id, selectedCategory, setSelectedCategory, isNewMerchantModalOpen}) {
    const { categories, setCategories} = useContext(CategoryContext)
    const [loading, setLoading] = useState(true);

    const handleCategoryChange = (newValue) => {
        setSelectedCategory(newValue);
    };

    const handleCategoryCreate = async(newCategoryName) => {
        let category = {
            "name": newCategoryName,
        }

        try {
            const response = await createCategoryForUser(1, category);
            let convertedResponse = convertObjectsToOptions(response)
            setCategories(convertedResponse)
            for (let i = 0; i < convertedResponse.length; i++) {
                if (convertedResponse[i].value.name === newCategoryName) {
                    setSelectedCategory(convertedResponse[i])
                    return
                }
            }
        } catch (error) {
            console.error('Error creating category:', error);
        } 
    };


    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategoriesForUser(1);
                setCategories(convertObjectsToOptions(data));
                console.log('Categories:', data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        getCategories();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }
    
    const customStyles = {
            container: (provided) => ({
            ...provided,
            width: 275, 
            fontWeight: "normal",
            fontSize: ".7em",
        }),
    };

    return (
        <div className="form-group">
            <label htmlFor="budgetCategory">Budget Category:</label>
            <CreatableSelect
                className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                id={id}
                value={selectedCategory}
                onChange={handleCategoryChange}
                onCreateOption={handleCategoryCreate}
                options={categories}
                placeholder={BudgetCategoryPlaceholder.label}
                isSearchable
                styles={customStyles}
                isClearable
            />
        </div>
    )
}

export default CategorySelector;