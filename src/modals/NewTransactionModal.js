// TODO: Add
//   Edit item
//   Delete item

import {useState, useEffect, useContext} from "react"
import { formatCurrency } from "../utils/FormatCurrency"
import CreatableSelect from 'react-select/creatable';
import "../styles/NewTransactionModal.css"
import initialItems from "../mock-data/mockItems";
import CommonNames from "../mock-data/commonNames";
import Modal from "../modals/AddModal";
import { convertObjectsToOptions, convertStateObjectsToOptions } from "../utils/ConvertToOptions";
import NewMerchantModal from "./NewMerchantModal";
import AccountSelector from "../components/DropdownComponents/AccountSelector";
import CategorySelector from "../components/DropdownComponents/CategorySelector";
import MerchantSelector from "../components/DropdownComponents/MerchantSelector";
import { MerchantContext } from "../GlobalStateContext/MerchantStateProvider";
import { CategoryContext } from "../GlobalStateContext/CategoryStateProvider";
import { AccountPlaceholder, BudgetCategoryPlaceholder, CommonNamePlaceholder, ItemPlaceholder, MerchantPlaceholder, StatePlaceholder, TaxCategoryPlaceholder, ZipCodePlaceholder } from "../constants/Placeholders";
import ZipCodeSelector from "../components/DropdownComponents/ZipCodeSelector";
import { fetchStates, fetchTaxCategories } from "../api";
import TaxCategorySelector from "../components/DropdownComponents/TaxCategorySelector";

function NewTransactionModal({transactions}){
    const {merchants, selectedMerchant, setSelectedMerchant} = useContext(MerchantContext)
    const {categories} = useContext(CategoryContext)
    // Initial Stuff
    const [allItems, setAllItems] = useState(initialItems);

    const [items, setItems] = useState([])
    const [selectableItems, setSelectableItems] = useState(initialItems);
    const [selectableStates, setSelectableStates] = useState(StatePlaceholder);
    const [taxCategories, setTaxCategories] = useState(null)
    const [commonNames, setCommonNames] = useState(CommonNames)

    // Selected Stuff
    const [selectedItem, setSelectedItem] = useState(ItemPlaceholder)
    const [selectedAccount, setSelectedAccount] = useState(AccountPlaceholder)
    const [selectedState, setSelectedState] = useState({label:"UT", value:"UT"})
    const [selectedZipCode, setSelectedZipCode] = useState({label:84005, value:{zipCode:84005,taxRegionName:"UTAH CO TR",taxRate:0.0735}})
    const [selectedTaxCategory, setSelectedTaxCategory] = useState(TaxCategoryPlaceholder)
    const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(BudgetCategoryPlaceholder)
    const [selectedCommonName, setSelectedCommonName] = useState(CommonNamePlaceholder)
    const [transactionDate, setTransactionDate] = useState('')

    const [itemUnitPrice, setItemUnitPrice] = useState('')
    const [itemDiscount, setItemDiscount] = useState('')
    const [itemSubtotal, setItemSubtotal] = useState('')
    const [itemTotal, setItemTotal] = useState('')
    const [itemTaxTotal, setItemTaxTotal] = useState('')
    const [itemQuantity, setItemQuantity] = useState('')
    const [itemTaxRate, setItemTaxRate] = useState('')

    const [shouldCreateNewItem, setShouldCreateNewItem] = useState(false)
    const [isNewMerchantModalOpen, setIsNewMerchantModalOpen] = useState(false)
    const [newMerchantName, setNewMerchantName] = useState('')

    // Totals
    const [transactionTotal, setTransactionTotal] = useState(0)
    const [transactionTaxTotal, setTransactionTaxTotal] = useState(0)
    const [transactionUnitPriceTotal, setTransactionUnitPriceTotal] = useState(0)

    const [budgetSummary, setBudgetSummary] = useState(new Map())

    const [descriptionMap, setDescriptionMap] = useState(new Map())

    useEffect(() => {
        if (selectedMerchant === null || JSON.stringify(selectedMerchant.value) === '{}') {
            setSelectableItems(allItems)
            clearItemFields()
            clearItemTotals()
            return;
        }
        merchantChange()
    }, [selectedMerchant])

    useEffect(() => {
        if (selectedTaxCategory === null || JSON.stringify(selectedTaxCategory) === '{}') {
            clearItemTotals()
            return;
        }
        console.log('selectedTaxCategory:', selectedTaxCategory)
        let taxRate = setTaxRateFromTaxCategory(selectedTaxCategory.value, selectedZipCode)
        console.log('taxRate:', taxRate)
        calculateTotals(itemUnitPrice, taxRate, itemQuantity, itemDiscount)
    }, [selectedTaxCategory])

    useEffect(() => {
        const loadStates = async () => {
            try {
                const response = await fetchStates()
                setSelectableStates(convertStateObjectsToOptions(response))
                console.log('States:', response);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        }

        loadStates()
    }, [])

    useEffect(() => {
        if (selectedZipCode === null || JSON.stringify(selectedZipCode) === '{}') {
            return;
        }
        let taxRate = setTaxRateFromTaxCategory(selectedTaxCategory.value, selectedZipCode)
        calculateTotals(itemUnitPrice, taxRate, itemQuantity, itemDiscount)
    }, [selectedZipCode])

    const handleStateChange = (newValue) => {
        setSelectedState(newValue)
        setSelectedZipCode(ZipCodePlaceholder)
    }

    const addItem = (event) => {
        event.preventDefault()

        let quantity = parseFloat(event.target.quantity.value) || 1
        if (quantity === ''){
            quantity = 1
        }

        setTransactionDate(event.target.date.value)

        let commonName = ""
        if(JSON.stringify(selectedCommonName.value) !== '{}'){
            commonName = selectedCommonName.value
        }
        let budgetCategory = ""
        if(JSON.stringify(selectedBudgetCategory.value) !== '{}'){
            budgetCategory = selectedBudgetCategory.value
        }
        let taxCategory = ""
        if(JSON.stringify(selectedTaxCategory.value) !== '{}'){
            taxCategory = selectedTaxCategory.value
        }

        let item = {
            itemName: selectedItem.value.itemName,
            commonName: commonName,
            unitPrice: -parseFloat(itemUnitPrice),
            quantity: quantity,
            discount: itemDiscount,
            subtotal: -parseFloat(itemSubtotal),
            taxCategory: taxCategory,
            taxRate: itemTaxRate,
            taxAmount: -parseFloat(itemTaxTotal),
            total: -parseFloat(itemTotal),
            budgetCategory: budgetCategory,
            merchant: selectedMerchant,
        }
      
        if(shouldCreateNewItem) {
            const newItem = { value: item, label: item.itemName };
            setAllItems([...allItems, newItem]);
            setSelectedItem(newItem);
            setSelectableItems([...selectableItems, newItem])
        }

        setItems([...items, item])
        addBudgetSummary(item)
        setShouldCreateNewItem(false)
        if(JSON.stringify(selectedCommonName.value) !== '{}'){
            setDescriptionMap(prevMap => {
                const newMap = new Map(prevMap);

                let currentCategoryDescription = newMap.get(item.budgetCategory.name) || [];

                if (!currentCategoryDescription.includes(selectedCommonName.value)) {
                    currentCategoryDescription.push(selectedCommonName.value);
                }

                newMap.set(item.budgetCategory.name, currentCategoryDescription);

                return newMap;
            });
        }
        clearItemFields()
        clearItemTotals()
    }

    const calculateTotals = (unitPrice, taxRate, quantity, discount) => {
        if(quantity === undefined || quantity === ""){
            quantity = 1
        }
        if(discount === undefined || discount === ""){
            discount = 0
        }

        let subtotal = ((unitPrice - discount) * quantity).toFixed(2)
        let taxAmount = (subtotal * taxRate).toFixed(2)
        let total = parseFloat(subtotal) + parseFloat(taxAmount)

        setItemSubtotal(subtotal)
        setItemTotal(total.toFixed(2))
        setItemTaxTotal(taxAmount)
    }

    const handleItemChange = (selectedOption) => {
        console.log('selectedOption:', selectedOption)
        let itemCommonName = selectedOption.value.commonName
        for(let i = 0; i < commonNames.length; i++){
            if(commonNames[i].value === itemCommonName) {
                setSelectedCommonName(commonNames[i])
            }
        }

        let taxCategory = selectedOption.value.taxCategory
        for(let i = 0; i < taxCategories.length; i++){
            if(taxCategories[i].value === taxCategory) {
                setSelectedTaxCategory(taxCategories[i])
            }
        }

        let budgetCategory = selectedOption.value.budgetCategory
        for(let i = 0; i < categories.length; i++){
            if(categories[i].value.name === budgetCategory) {
                setSelectedBudgetCategory(categories[i])
            }
        }

        if(JSON.stringify(selectedMerchant.value) === '{}'){
            let merchantId = selectedOption.value.merchant.id
            for(let i = 0; i < merchants.length; i++){
                if(merchantId === merchants[i].value.id){
                    let newSelectedMerchant = merchants[i]
                    setSelectedMerchant(newSelectedMerchant)

                    let filteredItems = allItems.filter(item => (
                        item.value.merchant.id === newSelectedMerchant.value.id
                    ))

                    setSelectableItems([...filteredItems])
                }
            }
        }

        let taxRate = setTaxRateFromTaxCategory(taxCategory, selectedZipCode)

        if(selectedOption.value.lastPurchasePrice !== 0){
            let unitPrice = selectedOption.value.lastPurchasePrice
            setItemUnitPrice(unitPrice)
            calculateTotals(unitPrice, taxRate, itemQuantity, itemDiscount)
        } else{
            setItemUnitPrice("")
            setItemTaxTotal("")
            setItemTotal("")
        }

        setSelectedItem(selectedOption);
    };

    const handleItemCreate = (inputValue) => {
        setShouldCreateNewItem(true)
        setSelectedCommonName(CommonNamePlaceholder)
        setSelectedTaxCategory(TaxCategoryPlaceholder)
        setSelectedBudgetCategory(BudgetCategoryPlaceholder)
        setItemTaxRate("")
        setSelectedItem({value: {itemName: inputValue}, label:inputValue});
    };

    const addBudgetSummary = (item) => {
        let summary = budgetSummary.get(item.budgetCategory)
        if (summary === undefined){
            summary = {"subtotal":item.subtotal, "taxTotal":item.taxAmount, "total":item.total}
        } else {
            summary.subtotal += item.subtotal
            summary.taxTotal += item.taxAmount
            summary.total += item.total
        }

        setTransactionTotal(transactionTotal + item.total)
        setTransactionTaxTotal(transactionTaxTotal + item.taxAmount)
        setTransactionUnitPriceTotal(transactionUnitPriceTotal + item.subtotal)

        setBudgetSummary(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(item.budgetCategory, summary);
            return newMap;
        });

        clearItemFields()
    }

    const addTransaction = (event) => {
        event.preventDefault()

        let date = transactionDate
        let splitTransaction = budgetSummary.size > 1
        let transaction = {}
        let childTransactions = []

        if (splitTransaction) {
            transaction = {
                "category":"Multiple", 
                "date": transactionDate, 
                "merchant": selectedMerchant.value, 
                "paymentMethod": selectedAccount.value,
                "totalAmount":transactionTotal, 
                "isCC": selectedAccount.value.isCC
            }
            date = ""
        }
        Array.from(budgetSummary.entries()).forEach(([key, value]) => {
            let itemsDescription = descriptionMap.get(key.name)
            let finalDescription = ""

            if(itemsDescription !== undefined){
                for(let i = 0; i < itemsDescription.length; i++){
                    finalDescription += itemsDescription[i]
                    if(i+1 !== itemsDescription.length){
                        finalDescription += ", "
                    }
                }
            }
            let transaction = {
                "category":key.name, 
                "date": date, 
                "merchant": selectedMerchant.value, 
                "paymentMethod": selectedAccount.value,
                "totalAmount":value.total, 
                "description":finalDescription, 
                "isCC": selectedAccount.value.isCC
            }
            if(splitTransaction){
                transaction.isChild = true
                childTransactions.push(transaction)
            } else {
                transaction.childTransactions = childTransactions
                transactions.push(transaction)
            }
        });

        if (splitTransaction){
            transaction.childTransactions = childTransactions
            transactions.push(transaction)
        }

        setBudgetSummary(new Map())
        setItems([])
        clearBaseFields()
        clearItemFields()
        setTransactionTotal(0)
        setTransactionTaxTotal(0)
        setTransactionUnitPriceTotal(0)
    }

    const handleCommonNameCreate = (commonName) => {
        const newCommonName = { value: commonName, label: commonName };
        setSelectedCommonName(newCommonName)
        setCommonNames([...commonNames, newCommonName])
    }

    const handleCommonNameChange = (commonName) => {
        setSelectedCommonName(commonName)
    }

    const handleTaxRateChange = (e) => {
        let taxRate = e.target.value
        setItemTaxRate(taxRate)

        calculateTotals(itemUnitPrice, taxRate, itemQuantity, itemDiscount)
    }

    const setTaxRateFromTaxCategory = (taxCategory, zipcode) => {
        let useTaxRate = 0.0735 // default value TODO: get this from the user's profile
        if(zipcode.value.estimatedCombinedRate !== undefined) {
            useTaxRate = zipcode.value.estimatedCombinedRate
        }
            
        switch (taxCategory.name){
            case "NT":
                useTaxRate = zipcode.value.nt
                break;
            case "Food":
                useTaxRate = zipcode.value.foodTaxRate
                break;
            case "Restaurant":
                useTaxRate = zipcode.value.restaurantTaxRate
                break
            case "Use Tax":
            default:
                break;
        }

        setItemTaxRate(useTaxRate)

        return useTaxRate
    }

    const handleCloseMerchantModal = async(event) => {
        event.preventDefault()
        setIsNewMerchantModalOpen(false);
        setSelectedMerchant(MerchantPlaceholder)
    };

    const merchantChange = () => {
        console.log('selectedMerchant:', selectedMerchant)
        console.log(categories)
        let filteredItems = allItems.filter(item => (
            item.value.merchant.id === selectedMerchant.value.id
        ))

        setSelectableItems([...filteredItems])

        let selectedItemInList = filteredItems.includes(selectedItem)
        if(!selectedItemInList){
            setSelectedItem(ItemPlaceholder)

            if(selectedMerchant.value.taxCategoryType === undefined){
                setSelectedTaxCategory(TaxCategoryPlaceholder)
                setItemTaxRate("")
            } else{
                if(selectedMerchant.value.taxCategoryType.id === 0){
                    setSelectedTaxCategory(TaxCategoryPlaceholder)
                } else{
                    let taxCategory = selectedMerchant.value.taxCategoryType
                    console.log('taxCategory:', taxCategory)
                    setSelectedTaxCategory(convertObjectsToOptions([taxCategory])[0])

                    setTaxRateFromTaxCategory(taxCategory, selectedZipCode)
                }
            }

            if(selectedMerchant.value.budgetCategory === undefined){
                setSelectedBudgetCategory(BudgetCategoryPlaceholder)
            } else{
                if(selectedMerchant.value.budgetCategory.id === 0){
                    setSelectedBudgetCategory(BudgetCategoryPlaceholder)
                } else{
                    let budgetCategory = selectedMerchant.value.budgetCategory
                    setSelectedBudgetCategory(convertObjectsToOptions([budgetCategory])[0])
                }
            }

            clearItemTotals()
        }
    }

    const handleTransactionDateSelect = (e) => {
        setTransactionDate(e.target.value)
    }

    const handleUnitPriceChange = (e) => {
        let unitPrice = e.target.value
        setItemUnitPrice( unitPrice)
        calculateTotals(unitPrice, itemTaxRate, itemQuantity, itemDiscount)
    }

    const handleQuantityChange = (e) => {
        let quantity = e.target.value
        setItemQuantity(quantity)
        calculateTotals(itemUnitPrice, itemTaxRate, quantity, itemDiscount)
    }

    const handleDiscountChange = (e) => {
        let discount = e.target.value
        setItemDiscount(discount)
        calculateTotals(itemUnitPrice, itemTaxRate, itemQuantity, discount)
    }

    const handleTaxTotalChange = (e) => {
        let taxAmount = parseFloat(e.target.value)
        let subtotal = parseFloat(itemSubtotal)
        setItemTaxTotal(taxAmount)
        setItemTotal(subtotal + taxAmount)
    }

    const handleTotalChange = (e) => {
        setItemTotal(e.target.value)
    }

    const isFormValid = () => {
        return itemUnitPrice === '' || JSON.stringify(selectedMerchant.value) === '{}' || transactionDate === '' || JSON.stringify(selectedAccount.value) === '{}';
    }

    const isSummaryValid = () => {
        return budgetSummary.size === 0;
    }

    const clearBaseFields = () => {
        setTransactionDate('')
        setSelectedAccount(AccountPlaceholder)
        setSelectedMerchant(MerchantPlaceholder)
    }

    const clearItemFields = () => {
        setSelectedItem(ItemPlaceholder)
        setSelectedCommonName(CommonNamePlaceholder)
        setSelectedTaxCategory(TaxCategoryPlaceholder)
        setSelectedBudgetCategory(BudgetCategoryPlaceholder)
    }

    const clearItemTotals = () => {
        setItemUnitPrice("")
        setItemQuantity("")
        setItemDiscount("")
        setItemTaxRate("")
        setItemTaxTotal("")
        setItemTotal("")
    }

    const customStyles = {
            container: (provided) => ({
            ...provided,
            width: 275, // Set your desired static width here
            fontWeight: "normal",
            fontSize: ".7em",
        }),
    };

    const getModalStyle = () => {
        return {
            width: '30%',
            height: 'auto',
            zIndex: '100000',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            position: 'relative',
        }
    }

    return (
        <div className="top-level-transaction-modal">
            <div>
                {isNewMerchantModalOpen && (
                <Modal 
                    modalStyle={getModalStyle()}
                    isOpen={isNewMerchantModalOpen} 
                    onClose={handleCloseMerchantModal}
                >
                    <NewMerchantModal 
                        newMerchantName={newMerchantName} 
                        setMerchantName={setNewMerchantName}
                        selectedBudgetCategory={selectedBudgetCategory}
                        selectedTaxCategory={selectedTaxCategory}
                        setSelectedTaxCategory={setSelectedTaxCategory}
                        setSelectedMerchant={setSelectedMerchant}
                        setSelectedBudgetCategory={setSelectedBudgetCategory}
                    />
                </Modal>
                )}
            </div>
            <div className="new-transaction-modal">
                <div className="new-transaction-modal-top-section">
                    <div className="add-item-form-section">
                        <form className="add-item-form-and-button" onSubmit={addItem}>
                            <div className="add-item-form">
                                <div className="add-item-form-input">
                                <div className="form-group">
                                    <label htmlFor="date">Transaction Date:</label>
                                    <input id="date" type="date" value={transactionDate} onChange={handleTransactionDateSelect}></input>
                                </div>
                                <MerchantSelector id="merchantName" selectedMerchant={selectedMerchant} setSelectedMerchant={setSelectedMerchant} setNewMerchantName={setNewMerchantName} isNewMerchantModalOpen={isNewMerchantModalOpen} setIsNewMerchantModalOpen={setIsNewMerchantModalOpen}/>
                                <AccountSelector id="account" selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} isNewMerchantModalOpen={isNewMerchantModalOpen} setDefault={true}/>
                                <div className="form-group">
                                    <label htmlFor="itemName">State:</label>
                                    <CreatableSelect
                                    id="stateDropdown"
                                    className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                                    value={selectedState}
                                    onChange={handleStateChange}
                                    options={selectableStates}
                                    placeholder={StatePlaceholder.label}
                                    isSearchable
                                    styles={customStyles}
                                    isValidNewOption={() => false}
                                    />
                                </div>
                                <ZipCodeSelector id="zipcode" selectedState={selectedState} selectedZipCode={selectedZipCode} setSelectedZipCode={setSelectedZipCode} isNewMerchantModalOpen={isNewMerchantModalOpen}/>
                            </div>
                            <div>
                                <div className="form-group">
                                    <label htmlFor="itemName">Item Name:</label>
                                    <CreatableSelect
                                    id="itemName"
                                    className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                                    value={selectedItem}
                                    onChange={handleItemChange}
                                    onCreateOption={handleItemCreate}
                                    options={selectableItems}
                                    placeholder={ItemPlaceholder.label}
                                    isSearchable
                                    styles={customStyles}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="commonName">Common Name:</label>
                                    <CreatableSelect
                                        id="commonName"
                                        className={isNewMerchantModalOpen ? "hide-parent-modal" : ""}
                                        value={selectedCommonName}
                                        onChange={handleCommonNameChange}
                                        onCreateOption={handleCommonNameCreate}
                                        options={commonNames}
                                        placeholder={CommonNamePlaceholder.label}
                                        isSearchable
                                        styles={customStyles}
                                    />
                                </div>
                                <CategorySelector id="budgetCategory" selectedCategory={selectedBudgetCategory} setSelectedCategory={setSelectedBudgetCategory} isNewMerchantModalOpen={isNewMerchantModalOpen}/>
                                <TaxCategorySelector id="taxCategory" selectedTaxCategory={selectedTaxCategory} setSelectedTaxCategory={setSelectedTaxCategory} isNewMerchantModalOpen={isNewMerchantModalOpen}/>
                                <div className="form-group">
                                    <label htmlFor="taxRate">Tax Rate:</label>
                                    <input id="taxRate" type="text" value={itemTaxRate} onChange={handleTaxRateChange}></input>
                                </div>
                                <hr/>
                                <div className="form-group">
                                    <label htmlFor="unitPrice">Unit Price:</label>
                                    <input id="unitPrice" min="1" type="number" step="any" value={itemUnitPrice} onChange={handleUnitPriceChange}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="discount">Discount:</label>
                                    <input id="discount" min="1" type="number" step="any" placeholder="Enter a positive value" value={itemDiscount} onChange={handleDiscountChange}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantity:</label>
                                    <input id="quantity" min="1" type="number" value={itemQuantity} onChange={handleQuantityChange}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="taxTotal">Tax Total:</label>
                                    <input id="taxTotal" type="number" step="any" value={itemTaxTotal} onChange={handleTaxTotalChange}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="total">Total:</label>
                                    <input id="total" min="1" type="number" step="any" value={itemTotal} onChange={handleTotalChange}></input>
                                </div>
                            </div>
                        </div>
                        <div className="add-item-button">
                            <button type="submit" disabled={isFormValid()}>Add Item</button>  
                        </div>
                    </form>
                </div>
              <div className="transaction-summary">
                  <table>
                   <caption>Summary</caption>
                   <tr>
                     <th>Budget Category</th>
                     <th>Subtotal</th>
                     <th>Total Tax</th>
                     <th>Total</th>
                   </tr>
                     {Array.from(budgetSummary.entries()).map(([key, value]) => (
                         <tr>
                            <td>{key.name}</td>
                            <td>{formatCurrency(value.subtotal)}</td>
                            <td>{formatCurrency(value.taxTotal)}</td>
                            <td>{formatCurrency(value.total)}</td>
                         </tr>
                     ))}
                   <tr>
                     <td><b>Totals</b></td>
                     <td><b>{formatCurrency(transactionUnitPriceTotal)}</b></td>
                     <td><b>{formatCurrency(transactionTaxTotal)}</b></td>
                     <td><b>{formatCurrency(transactionTotal)}</b></td>
                   </tr>
                  </table>
                  <div className="add-transaction-button">
                      <button onClick={addTransaction} disabled={isSummaryValid()}>Add Transaction</button>
                  </div>
              </div>
            </div>
            <div className="add-item-list">
              <h3>Items</h3>
              <table className="budgets-container">
              <tr>
                  <th>Item Name</th>
                  <th>Common Name</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>Subtotal</th>
                  <th>Tax Category</th>
                  <th>Tax Rate</th>
                  <th>Tax Amount</th>
                  <th>Total</th>
                  <th>Budget Category</th>
              </tr>
                {items?.map((item, index) => (
                    <tr key={index} className="itemsList">
                       <td>{item.itemName}</td>
                       <td>{item.commonName}</td>
                       <td>{formatCurrency(item.unitPrice)}</td>
                       <td>{item.quantity}</td>
                       <td>{formatCurrency(item.discount)}</td>
                       <td>{formatCurrency(item.subtotal)}</td>
                       <td>{item.taxCategory}</td>
                       <td>{item.taxRate}</td>
                       <td>{formatCurrency(item.taxAmount)}</td>
                       <td>{formatCurrency(item.total)}</td>
                       <td>{item.budgetCategory.name}</td>
                    </tr>
                ))}
              </table>
            </div>
        </div>
    </div>
    );
}

export default NewTransactionModal

