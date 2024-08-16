import React, { useState, useEffect, useContext } from 'react';
import CreatableSelect from 'react-select/creatable';
import { convertObjectsToOptions } from '../../utils/ConvertToOptions';
import { fetchMerchantsForUser } from '../../api';
import { MerchantContext } from '../../GlobalStateContext/MerchantStateProvider';
import { MerchantPlaceholder } from '../../constants/Placeholders';

function MerchantSelector({id, setNewMerchantName, isNewMerchantModalOpen, setIsNewMerchantModalOpen}) {
    const { merchants, setMerchants, selectedMerchant, setSelectedMerchant } = useContext(MerchantContext);
    const [loading, setLoading] = useState(true);

    const handleMerchantChange = (newValue) => {
        if(newValue === null){
            setSelectedMerchant(MerchantPlaceholder)
            return
        }
        setSelectedMerchant(newValue);
    };

    const openMerchantCreateModal = (merchantName) => {
        setIsNewMerchantModalOpen(true)
        setNewMerchantName(merchantName)
    }

    useEffect(() => {
        const getMerchants = async () => {
            try {
                const data = await fetchMerchantsForUser(1);
                setMerchants(convertObjectsToOptions(data));
                console.log('Merchants:', data);
            } catch (error) {
                console.error('Error fetching merchants:', error);
            } finally {
                setLoading(false);
            }
        };

        getMerchants();
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
            <label htmlFor="merchantName">Merchant:</label>
            <CreatableSelect
                className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                id={id}
                value={selectedMerchant}
                onChange={handleMerchantChange}
                onCreateOption={openMerchantCreateModal}
                options={merchants}
                placeholder={MerchantPlaceholder.label}
                isSearchable
                styles={customStyles}
                isClearable
            />
        </div>
    )
}

export default MerchantSelector;