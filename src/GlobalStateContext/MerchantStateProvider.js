import React, { createContext, useState, useContext } from 'react';
import { MerchantPlaceholder } from '../constants/Placeholders';

export const MerchantContext = createContext();

export const MerchantProvider = ({ children }) => {
    const [merchants, setMerchants] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState(MerchantPlaceholder);

    return (
        <MerchantContext.Provider value={{ merchants, setMerchants, selectedMerchant, setSelectedMerchant }}>
            {children}
        </MerchantContext.Provider>
    );
};