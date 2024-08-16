import React, { createContext, useState } from 'react';
import { BudgetCategoryPlaceholder } from '../constants/Placeholders';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setselectedCategory] = useState(BudgetCategoryPlaceholder);

    return (
        <CategoryContext.Provider value={{ categories, setCategories, selectedCategory, setselectedCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};