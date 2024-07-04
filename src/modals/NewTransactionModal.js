// TODO: Add
//   Edit item
//   Delete item
// I don't want different merchants per zipcode, but rather a dropdown of tax rates by zip code. that way it doesn't matter what merchant it is

import {useState} from "react"
import { formatCurrency } from "../utils/FormatCurrency"
import CreatableSelect from 'react-select/creatable';
import "../styles/NewTransactionModal.css"
import initialItems from "../mock-data/mockItems";
import initialMerchants from "../mock-data/mockMerchants";

function NewTransactionModal({transactions}){
    const [items, setItems] = useState([])
    const [allItems, setAllItems] = useState(initialItems);
    const [selectableItems, setSelectableItems] = useState(initialItems);
    const [allMerchants, setAllMerchants] = useState(initialMerchants);
    const [transactionDate, setTransactionDate] = useState('')
    const [selectedItem, setSelectedItem] = useState({label:"Select or Create Item", value:{}})
    const [selectedMerchant, setSelectedMerchant] = useState({label:"Select or Create Merchant", value:{}})
    const [merchant, setMerchant] = useState('')
    const [account, setAccount] = useState('')
    const [zipcode, setZipcode] = useState('')

    const [itemCommonName, setItemCommonName] = useState('')
    const [itemUnitPrice, setItemUnitPrice] = useState('')
    const [itemDiscount, setItemDiscount] = useState('')
    const [itemQuantity, setItemQuantity] = useState('')
    const [itemTaxCategory, setItemTaxCategory] = useState('')
    const [itemBudgetCategory, setItemBudgetCategory] = useState('')
    const [itemTaxRate, setItemTaxRate] = useState('')

    const [shouldCreateNewItem, setShouldCreateNewItem] = useState(false)

    const [transactionTotal, setTransactionTotal] = useState(0)
    const [transactionTaxTotal, setTransactionTaxTotal] = useState(0)
    const [transactionUnitPriceTotal, setTransactionUnitPriceTotal] = useState(0)

    const [budgetSummary, setBudgetSummary] = useState(new Map())

    const addItem = (event) => {
      event.preventDefault()
      let unitPrice = -parseFloat(event.target.unitPrice.value) || 0

      let quantity = parseFloat(event.target.quantity.value) || 1
      if (quantity === ''){
          quantity = 1
      }

      let discount = parseFloat(event.target.discount.value) || 0
      let subtotal = (unitPrice + discount) * quantity
      let taxRate = itemTaxRate
      let taxAmount = subtotal * taxRate
      let total = subtotal + taxAmount
      
      setTransactionDate(event.target.date.value)
      setAccount(event.target.account.value)

      let item = {
        itemName: selectedItem.value.itemName,
        commonName: itemCommonName,
        unitPrice: unitPrice,
        quantity: quantity,
        discount: discount,
        subtotal: subtotal,
        taxCategory: itemTaxCategory,
        taxRate: taxRate,
        taxAmount: taxAmount,
        total: total,
        budgetCategory: itemBudgetCategory,
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
    }

    const handleChange = (selectedOption) => {
        setItemCommonName(selectedOption.value.commonName)
        setItemTaxCategory(selectedOption.value.taxCategory)
        setItemBudgetCategory(selectedOption.value.budgetCategory)
        setItemTaxRate(selectedOption.value.taxRate)
        setSelectedItem(selectedOption);
    };

    const handleCreate = (inputValue) => {
        setShouldCreateNewItem(true)
        setItemCommonName("")
        setItemTaxCategory("")
        setItemBudgetCategory("")
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
        setItemTaxCategory("")
        setItemBudgetCategory("")
        setItemTaxRate("")
        setItemUnitPrice("")
        setItemQuantity("")
        setItemDiscount("")
        setItemCommonName("")
    }

    const addTransaction = (event) => {
      event.preventDefault()
        let date = transactionDate
        if (budgetSummary.size > 1 ) {
            transactions.push({"category":"Multiple", "date": transactionDate, "merchant": merchant, "account": account, "total":transactionTotal})
            date = ""
        }
        Array.from(budgetSummary.entries()).forEach(([key, value]) => {
          let transaction = {"category":key, "date": date, "merchant": merchant, "account": account, "total":value.total}
          transactions.push(transaction)
        });

        setBudgetSummary(new Map())
        setTransactionTotal(0)
        setTransactionTaxTotal(0)
        setTransactionUnitPriceTotal(0)
        setItems([])
        setTransactionDate('')
        setMerchant('')
        setAccount('')
        setSelectedItem({label:"Select or Create Item", value:{}})
        setItemUnitPrice("")
    }

    const handleCommonNameChange = (e) => {
        setItemCommonName(e.target.value)
    }

    const handleTaxCategoryChange = (e) => {
        setItemTaxCategory(e.target.value)
    }

    const handleBudgetCategoryChange = (e) => {
        setItemBudgetCategory(e.target.value)
    }

    const handleTaxRateChange = (e) => {
        setItemTaxRate(e.target.value)
    }

    const handleAccountChange = (e) => {
        setAccount(e.target.value)
    }

    const handleZipcodeChange = (e) => {
        setZipcode(e.target.value)
    }

    const handleMerchantCreate = (e) => {
        setMerchant(e.target.value)
    }

    const handleMerchantChange = (selectedMerchant) => {
        setSelectedMerchant(selectedMerchant)
        setMerchant(selectedMerchant.value.name)

        let filteredItems = allItems.filter(item => (
            item.value.merchant.id === selectedMerchant.value.id
        ))

        setSelectableItems([...filteredItems])
    }

    const handleTransactionDateSelect = (e) => {
        setTransactionDate(e.target.value)
    }

    const handleUnitPriceChange = (e) => {
        setItemUnitPrice(e.target.value)
    }

    const handleQuantityChange = (e) => {
        setItemQuantity(e.target.value)
    }

    const handleDiscountChange = (e) => {
        setItemDiscount(e.target.value)
    }

    const isFormValid = () => {
        return itemUnitPrice === '' || merchant === '' || transactionDate === '' || account === '';
    }

    const isSummaryValid = () => {
        return budgetSummary.size === 0;
    }

    const customStyles = {
            container: (provided) => ({
            ...provided,
            width: 300, // Set your desired static width here
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
                              <input id="account" type="text" value={account} onChange={handleAccountChange}></input>
                          </div>
                          <div className="form-group">
                              <label htmlFor="zipcode">ZipCode:</label>
                              <input id="zipcode" type="text" value={zipcode} onChange={handleZipcodeChange}></input>
                          </div>
                        </div>
                        <div>
                          <div className="form-group">
                            <label htmlFor="itemName">Item Name:</label>
                            <CreatableSelect
                               id="itemName"
                               value={selectedItem}
                               onChange={handleChange}
                               onCreateOption={handleCreate}
                               options={selectableItems}
                               placeholder="Select or Create Item"
                               isSearchable
                               styles={customStyles}
                            />
                          </div>
                          <div className="form-group">
                              <label htmlFor="commonName">Common Name:</label>
                              <input id="commonName" type="text" value={itemCommonName} onChange={handleCommonNameChange}></input>
                          </div>
                          <div className="form-group">
                              <label htmlFor="taxCategory">Tax Category:</label>
                              <input id="taxCategory" type="text" value={itemTaxCategory} onChange={handleTaxCategoryChange}></input>
                          </div>
                          <div className="form-group">
                              <label htmlFor="taxRate">Tax Rate:</label>
                              <input id="taxRate" type="text" value={itemTaxRate} onChange={handleTaxRateChange}></input>
                          </div>
                          <div className="form-group">
                              <label htmlFor="budgetCategory">Budget Category:</label>
                              <input id="budgetCategory" type="text" value={itemBudgetCategory} onChange={handleBudgetCategoryChange}></input>
                          </div>
                          <div className="form-group">
                              <label htmlFor="unitPrice">Unit Price:</label>
                              <input id="unitPrice" min="1" type="number" step="any" value={itemUnitPrice} onChange={handleUnitPriceChange}></input>
                         </div>
                         <div className="form-group">
                             <label htmlFor="quantity">Quantity:</label>
                             <input id="quantity" min="1" type="number" value={itemQuantity} onChange={handleQuantityChange}></input>
                         </div>
                         <div className="form-group">
                             <label htmlFor="discount">Discount:</label>
                             <input id="discount" min="1" type="number" step="any" value={itemDiscount} onChange={handleDiscountChange}></input>
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

