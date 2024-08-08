import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { fetchPaymentMethodsForUser } from '../api';
import { convertObjectsToOptions } from '../utils/ConvertToOptions';

function AccountSelectDropdown({id, selectedAccount, setSelectedAccount, isNewMerchantModalOpen}) {
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true);

    const handleAccountChange = (newValue) => {
        setSelectedAccount(newValue);
    };

    // Todo: Implement this function
    const handleAccountCreate = (inputValue) => {
        console.log('Account created:', inputValue);
        setSelectedAccount({ value: inputValue, label: inputValue });
    };

    useEffect(() => {
        const getPaymentMethods = async () => {
            try {
                const data = await fetchPaymentMethodsForUser(1);
                setAccounts(convertObjectsToOptions(data));
                console.log('Payment methods:', data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        getPaymentMethods();
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
            <label htmlFor="account">Account:</label>
            <CreatableSelect
                id={id}
                className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                value={selectedAccount}
                onChange={handleAccountChange}
                onCreateOption={handleAccountCreate}
                options={accounts}
                placeholder="Select or Create Account"
                isSearchable
                styles={customStyles}
            />
        </div>
    )
}

export default AccountSelectDropdown;