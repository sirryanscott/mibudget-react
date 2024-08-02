// TODO: Add
//   Edit item
//   Delete item
//   I can totally get rid of the "item..." states and just use the "selected..." ones

import {useState} from "react"
import { formatCurrency } from "../utils/FormatCurrency"
import CreatableSelect from 'react-select/creatable';
import "../styles/NewTransactionModal.css"
import initialItems from "../mock-data/mockItems";
import initialMerchants from "../mock-data/mockMerchants";
import initialAccounts from "../mock-data/mockAccounts";
import InitialZipCodesAndRates from "../mock-data/ZipCodes";
import TaxCategories from "../mock-data/taxCategories";
import BudgetCategories from "../mock-data/budgetCategories";
import CommonNames from "../mock-data/commonNames";

function NewTransactionModal({transactions}){
    // Initial Stuff
    const [allMerchants, setAllMerchants] = useState(initialMerchants);
    const [allAccounts, setAllAccounts] = useState(initialAccounts);
    const [allItems, setAllItems] = useState(initialItems);

    const [items, setItems] = useState([])
    const [selectableItems, setSelectableItems] = useState(initialItems);
    const [selectableZipCodes, setSelectableZipCodes] = useState(InitialZipCodesAndRates);
    const [taxCategories, setTaxCategories] = useState(TaxCategories)
    const [budgetCategories, setBudgetCategories] = useState(BudgetCategories)
    const [commonNames, setCommonNames] = useState(CommonNames)

    // Selected Stuff
    const [selectedItem, setSelectedItem] = useState({label:"Select or Create Item", value:{}})
    const [selectedMerchant, setSelectedMerchant] = useState({label:"Select or Create Merchant", value:{}})
    const [selectedAccount, setSelectedAccount] = useState({label:"Select or Create Account", value:{}})
    const [selectedZipCode, setSelectedZipCode] = useState({label:84005, value:{zipCode:84005,taxRegionName:"UTAH CO TR",taxRate:0.0735}})
    const [selectedTaxCategory, setSelectedTaxCategory] = useState({label:"Select Tax Category", value:""})
    const [selectedBudgetCategory, setSelectedBudgetCategory] = useState({label:"Select or Create Budget Category", value:""})
    const [selectedCommonName, setSelectedCommonName] = useState({label:"Select or Create Common Name", value:""})
    const [transactionDate, setTransactionDate] = useState('')

    const [itemUnitPrice, setItemUnitPrice] = useState('')
    const [itemDiscount, setItemDiscount] = useState('')
    const [itemSubtotal, setItemSubtotal] = useState('')
    const [itemTotal, setItemTotal] = useState('')
    const [itemTaxTotal, setItemTaxTotal] = useState('')
    const [itemQuantity, setItemQuantity] = useState('')
    const [itemTaxRate, setItemTaxRate] = useState('')

    const [shouldCreateNewItem, setShouldCreateNewItem] = useState(false)

    // Totals
    const [transactionTotal, setTransactionTotal] = useState(0)
    const [transactionTaxTotal, setTransactionTaxTotal] = useState(0)
    const [transactionUnitPriceTotal, setTransactionUnitPriceTotal] = useState(0)

    const [budgetSummary, setBudgetSummary] = useState(new Map())

    const [descriptionMap, setDescriptionMap] = useState(new Map())

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
            merchant: {id: selectedMerchant.value.id}
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

                let currentCategoryDescription = newMap.get(item.budgetCategory) || [];

                if (!currentCategoryDescription.includes(selectedCommonName.value)) {
                    currentCategoryDescription.push(selectedCommonName.value);
                }

                newMap.set(item.budgetCategory, currentCategoryDescription);

                return newMap;
            });
        }
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
        for(let i = 0; i < budgetCategories.length; i++){
            if(budgetCategories[i].value === budgetCategory) {
                setSelectedBudgetCategory(budgetCategories[i])
            }
        }

        if(JSON.stringify(selectedMerchant.value) === '{}'){
            let merchantId = selectedOption.value.merchant.id
            for(let i = 0; i < allMerchants.length; i++){
            console.log(allMerchants[i])
                if(merchantId === allMerchants[i].value.id){
                    let newSelectedMerchant = allMerchants[i]
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
        setSelectedCommonName({label: "Select or Create Common Name", value:""})
        setSelectedTaxCategory({label: "Select Tax Category", value:""})
        setSelectedBudgetCategory({label:"Select or Create Budget Category", value:""})
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

        setSelectedItem({label:"Select or Create Item", value:{}})
        setSelectedTaxCategory({label:"Select Tax Category", value:""})
        setSelectedBudgetCategory({label:"Select or Create Budget Category", value:""})
        setItemTaxRate("")
        setItemUnitPrice("")
        setItemQuantity("")
        setItemDiscount("")
        setSelectedCommonName({label:"Select or Create Common Name", value:""})
        setItemTaxTotal("")
        setItemTotal("")
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
                "merchant": selectedMerchant.value.name, 
                "paymentMethod": {"nickname":selectedAccount.value.nickname}, 
                "totalAmount":transactionTotal, 
                "isCC": selectedAccount.value.isCC
            }
            date = ""
        }
        Array.from(budgetSummary.entries()).forEach(([key, value]) => {
            let itemsDescription = descriptionMap.get(key)
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
                "category":key, 
                "date": date, 
                "merchant": selectedMerchant.value.name, 
                "paymentMethod": {"nickname": selectedAccount.value.nickname}, 
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

        console.log(transaction)
        console.log(transactions)

        setBudgetSummary(new Map())
        setTransactionTotal(0)
        setTransactionTaxTotal(0)
        setTransactionUnitPriceTotal(0)
        setItems([])
        setTransactionDate('')
        setSelectedAccount({label:"Select or Create Account", value:{}})
        setSelectedItem({label:"Select or Create Item", value:{}})
        setSelectedMerchant({label:"Select or Create Merchant", value:{}})
        setItemUnitPrice("")
        setItemTaxRate('')
        setSelectableItems(allItems)
    }

    const handleCommonNameCreate = (commonName) => {
        const newCommonName = { value: commonName, label: commonName };
        setSelectedCommonName(newCommonName)
        setCommonNames([...commonNames, newCommonName])
    }

    const handleCommonNameChange = (commonName) => {
        setSelectedCommonName(commonName)
    }

    const handleTaxCategoryChange = (taxCategory) => {
        setSelectedTaxCategory(taxCategory)

        selectedItem.value.taxCategory = taxCategory.value
        setSelectedItem(selectedItem)

        let taxRate = setTaxRateFromTaxCategory(taxCategory.value, selectedZipCode)

        calculateTotals(itemUnitPrice, taxRate, itemQuantity, itemDiscount)
    }

    const handleBudgetCategoryChange = (budgetCategory) => {
        setSelectedBudgetCategory(budgetCategory)
    }

    const handleTaxRateChange = (e) => {
        let taxRate = e.target.value
        setItemTaxRate(taxRate)

        calculateTotals(itemUnitPrice, taxRate, itemQuantity, itemDiscount)
    }

    const handleAccountChange = (account) => {
        setSelectedAccount(account)
    }

    const handleAccountCreate = (account) => {
        const newAccount = { value: {name:account}, label: account };
        setSelectedAccount(newAccount);
        setAllAccounts([...allAccounts, newAccount])
    }

    const handleZipcodeChange = (zipcode) => {
        setSelectedZipCode(zipcode)
        let taxCategory = "Use Tax"
        if(selectedMerchant.value.taxCategory !== undefined){
            taxCategory = selectedMerchant.value.taxCategory
        }
        if(selectedItem.value.taxCategory !== undefined){
            taxCategory = selectedItem.value.taxCategory
        }
        setTaxRateFromTaxCategory(taxCategory, zipcode)
        calculateTotals(itemUnitPrice || 0, itemTaxRate || 0, itemQuantity, itemDiscount)
    }

    const setTaxRateFromTaxCategory = (taxCategory, zipcode) => {
        let useTaxRate = 0.0735 // default value
        if(zipcode.value.taxRate !== undefined) {
            useTaxRate = zipcode.value.taxRate
        }
            
        switch (taxCategory){
            case "NT":
                useTaxRate = 0
                break;
            case "Food":
                useTaxRate = 0.03
                break;
            case "Restaurant":
                let restaurantRate = (useTaxRate + 0.01).toFixed(4)
                useTaxRate = restaurantRate
                break
            case "Use Tax":
            default:
                break;
        }

        setItemTaxRate(useTaxRate)

        return useTaxRate
    }

    const handleMerchantCreate = (merchantName) => {
        // go to BE to get the ID
        // setSelectedMerchant(newMerchant)
    }

    const handleMerchantChange = (selectedMerchant) => {
        setSelectedMerchant(selectedMerchant)

        let filteredItems = allItems.filter(item => (
            item.value.merchant.id === selectedMerchant.value.id
        ))

        setSelectableItems([...filteredItems])

        setSelectedItem({label:"Select or Create Item", value:{}})

        if(selectedMerchant.value.taxCategory === undefined){
            setSelectedTaxCategory({label:"Select Tax Category", value:""})
            setItemTaxRate("")
        } else{
            let taxCategory = selectedMerchant.value.taxCategory
            setSelectedTaxCategory({label:taxCategory, value:taxCategory})

            setTaxRateFromTaxCategory(taxCategory, selectedZipCode)
        }

        if(selectedMerchant.value.budgetCategory === undefined){
            setSelectedBudgetCategory({label:"Select Budget Category", value:""})
        } else{
            let budgetCategory = selectedMerchant.value.budgetCategory
            setSelectedBudgetCategory({label:budgetCategory, value:budgetCategory})
        }

        setItemUnitPrice("")
        setItemQuantity("")
        setItemDiscount("")
        setSelectedCommonName({label:"Select or Create Common Name", value:{}})
        setItemTaxTotal("")
        setItemTotal("")
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
        return itemUnitPrice === '' || selectedMerchant.value.name === undefined || transactionDate === '' || selectedAccount.value.nickname === undefined;
    }

    const isSummaryValid = () => {
        return budgetSummary.size === 0;
    }

    const customStyles = {
            container: (provided) => ({
            ...provided,
            width: 275, // Set your desired static width here
            fontWeight: "normal",
            fontSize: ".7em",
        }),
    };

    return (
        <div className="new-transaction-modal">
            <h2 className="modal-title">New Transaction</h2>
            <div className="new-transaction-modal-top-section">
              <div className="add-item-form-section">
                  <form className="add-item-form-and-button" onSubmit={addItem}>
                    <div className="add-item-form">
                        <div className="add-item-form-input">
                          <div className="form-group">
                              <label htmlFor="date">Transaction Date:</label>
                              <input id="date" type="date" value={transactionDate} onChange={handleTransactionDateSelect}></input>
                          </div>
                          <div className="form-group">
                              <label htmlFor="merchantName">Merchant:</label>
                              <CreatableSelect
                                   id="merchantName"
                                   value={selectedMerchant}
                                   onChange={handleMerchantChange}
                                   onCreateOption={handleMerchantCreate}
                                   options={allMerchants}
                                   placeholder="Select or Create Merchant"
                                   isSearchable
                                   styles={customStyles}
                              />
                          </div>
                          <div className="form-group">
                              <label htmlFor="account">Account:</label>
                              <CreatableSelect
                                   id="account"
                                   value={selectedAccount}
                                   onChange={handleAccountChange}
                                   onCreateOption={handleAccountCreate}
                                   options={allAccounts}
                                   placeholder="Select or Create Account"
                                   isSearchable
                                   styles={customStyles}
                              />
                          </div>
                          <div className="form-group">
                              <label htmlFor="zipcode">ZipCode:</label>
                              <CreatableSelect
                                   id="zipcode"
                                   value={selectedZipCode}
                                   onChange={handleZipcodeChange}
                                   options={selectableZipCodes}
                                   placeholder="Select ZipCode"
                                   isSearchable
                                   styles={customStyles}
                              />
                          </div>
                        </div>
                        <div>
                          <div className="form-group">
                            <label htmlFor="itemName">Item Name:</label>
                            <CreatableSelect
                               id="itemName"
                               value={selectedItem}
                               onChange={handleItemChange}
                               onCreateOption={handleItemCreate}
                               options={selectableItems}
                               placeholder="Select or Create Item"
                               isSearchable
                               styles={customStyles}
                            />
                          </div>
                          <div className="form-group">
                              <label htmlFor="commonName">Common Name:</label>
                              <CreatableSelect
                                 id="commonName"
                                 value={selectedCommonName}
                                 onChange={handleCommonNameChange}
                                 onCreateOption={handleCommonNameCreate}
                                 options={commonNames}
                                 placeholder="Select or Create Common Name"
                                 isSearchable
                                 styles={customStyles}
                              />
                          </div>
                          <div className="form-group">
                              <label htmlFor="budgetCategory">Budget Category:</label>
                              <CreatableSelect
                                 id="budgetCategory"
                                 value={selectedBudgetCategory}
                                 onChange={handleBudgetCategoryChange}
                                 options={budgetCategories}
                                 placeholder="Select or Create Budget Category"
                                 isSearchable
                                 styles={customStyles}
                              />
                          </div>
                          <div className="form-group">
                              <label htmlFor="taxCategory">Tax Category:</label>
                              <CreatableSelect
                                 id="taxCategory"
                                 value={selectedTaxCategory}
                                 onChange={handleTaxCategoryChange}
                                 options={taxCategories}
                                 placeholder="Select Tax Category"
                                 isSearchable
                                 styles={customStyles}
                              />
                          </div>
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
                            <td>{key}</td>
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
                       <td>{item.budgetCategory}</td>
                    </tr>
                ))}
              </table>
            </div>
        </div>
    );
}

export default NewTransactionModal

