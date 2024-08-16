import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { fetchPaymentMethodsForUser } from '../../api';
import { convertObjectsToOptions } from '../../utils/ConvertToOptions';
import { AccountPlaceholder } from '../../constants/Placeholders';

function AccountSelector(
    {
        id, 
        accountLabel, 
        selectedAccount, 
        setSelectedAccount, 
        isNewMerchantModalOpen, 
        isBankTransfer, 
        selectedFromAccount, 
        setSelectedFromAccount,
        setDefault,
    }) {

    const [accounts, setAccounts] = useState([])
    const [filteredAccounts, setFilteredAccounts] = useState(accounts)
    const [loading, setLoading] = useState(true);

    const handleAccountChange = (newValue) => {
        setSelectedAccount(newValue);

        if (isBankTransfer) {
            if(setSelectedFromAccount !== undefined){
                setSelectedFromAccount(newValue)
            } 
        }
    };

    // Todo: Implement this function
    const handleAccountCreate = (inputValue) => {
        console.log('Account created:', inputValue);
        setSelectedAccount({ value: inputValue, label: inputValue });
    };

    useEffect(() => {
        const filterAccounts = () => {
            if (isBankTransfer && setSelectedFromAccount === undefined) {
                if(selectedAccount.value.id === selectedFromAccount.value.id){
                    setSelectedAccount(AccountPlaceholder);
                }
                let filteredAccounts = accounts.filter(account => (
                    account.value.id !== selectedFromAccount.value.id
                ))
                setFilteredAccounts(filteredAccounts)
            }
        }
        filterAccounts()
    }, [selectedFromAccount])

    useEffect(() => {
        const getPaymentMethods = async () => {
            try {
                const data = await fetchPaymentMethodsForUser(1);
                setAccounts(convertObjectsToOptions(data));
                setFilteredAccounts(convertObjectsToOptions(data));

                if(setDefault){
                    for(let i=0; i<data.length; i++){
                        if(data[i].isPrimary){
                            setSelectedAccount(convertObjectsToOptions([data[i]])[0])
                            break;
                        }
                    }
                }
                console.log('Payment methods:', data);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
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
            <label htmlFor="account">{accountLabel ? accountLabel : "Account"}:</label>
            <CreatableSelect
                id={id}
                className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                value={selectedAccount}
                onChange={handleAccountChange}
                onCreateOption={handleAccountCreate}
                options={isBankTransfer ? filteredAccounts : accounts}
                placeholder={AccountPlaceholder.label}
                isSearchable
                styles={customStyles}
                isClearable
            />
        </div>
    )
}

export default AccountSelector;