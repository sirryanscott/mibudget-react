import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { convertTaxObjectsToOptions } from '../../utils/ConvertToOptions';
import { fetchZipcodesAndTaxRates } from '../../api';
import { ZipCodePlaceholder } from '../../constants/Placeholders';

function ZipCodeSelector({id, selectedState, selectedZipCode, setSelectedZipCode, isNewMerchantModalOpen}) {
    const [selectableZipCodes, setSelectableZipCodes] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleZipcodeChange = (newValue) => {
        if(newValue === null){
            setSelectedZipCode(ZipCodePlaceholder)
            return
        }
        setSelectedZipCode(newValue);
    };

    useEffect(() => {
        const getZipCodes = async () => {
            try {
                const data = await fetchZipcodesAndTaxRates(selectedState.value);
                setSelectableZipCodes(convertTaxObjectsToOptions(data));
                console.log('ZipCodes:', data);
            } catch (error) {
                console.error('Error fetching ZipCodes:', error);
            } finally {
                setLoading(false);
            }
        };

        getZipCodes();
    }, [selectedState]);

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
            <label htmlFor="zipcode">ZipCode:</label>
            <div className="form-group">
                <CreatableSelect
                    id={id}
                    className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                    value={selectedZipCode}
                    onChange={handleZipcodeChange}
                    options={selectableZipCodes}
                    placeholder={ZipCodePlaceholder.label}
                    isSearchable
                    styles={customStyles}
                    isValidNewOption={() => false}
                />
            </div>
        </div>
    )
}

export default ZipCodeSelector;