
import React, { useState, useEffect, useContext } from 'react';
import CreatableSelect from 'react-select/creatable';
import { fetchTaxCategories } from '../../api';
import { convertObjectsToOptions } from '../../utils/ConvertToOptions';
import { TaxCategoryPlaceholder } from '../../constants/Placeholders';

function TaxCategorySelector({id, selectedTaxCategory, setSelectedTaxCategory, isNewMerchantModalOpen}) {
    const [taxcategories, setTaxCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleTaxCategoryChange = (newValue) => {
        setSelectedTaxCategory(newValue);
    };

    useEffect(() => {
        const getTaxCategories = async () => {
            try {
                const data = await fetchTaxCategories();
                setTaxCategories(convertObjectsToOptions(data));
                console.log('Tax Categories:', data);
            } catch (error) {
                console.error('Error fetching Tax categories:', error);
            } finally {
                setLoading(false);
            }
        };

        getTaxCategories();
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
            <label htmlFor="taxCategory">Tax Category:</label>
            <CreatableSelect
                className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                id={id}
                value={selectedTaxCategory}
                onChange={handleTaxCategoryChange}
                options={taxcategories}
                placeholder={TaxCategoryPlaceholder.label}
                isSearchable
                styles={customStyles}
                isClearable
                isValidNewOption={() => false}
            />
        </div>
    )
}

export default TaxCategorySelector;