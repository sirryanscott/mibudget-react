const DBItems = [
    {
        id: 10001,
        name: "KS Whole Milk 2 gal - 147741",
        commonName: "Whole Milk",
        budgetCategory: "Groceries",
        taxCategory: "Food",
        merchant: {
            id: 1001,
            name: "Costco",
        }
    },
    {
        id: 10001,
        name: "KS Mild Cheddar Cheese - 258852",
        commonName: "Cheddar Cheese",
        budgetCategory: "Groceries",
        taxCategory: "Food",
        merchant: {
            id: 1001,
            name: "Costco",
        }
    },
    {
        id: 10003,
        name: "Vanity Fair Napkins 80 ct",
        commonName: "Napkins",
        budgetCategory: "Household Supplies",
        taxCategory: "Use Tax",
        merchant: {
            id: 1003,
            name: "Walmart",
        }
    },
]

function InitialItems() {
    let initialItems = []
    DBItems.map(key => (
        initialItems.push({
          label: key.name,
          value: {
              itemName: key.name,
              commonName: key.commonName,
              budgetCategory: key.budgetCategory,
              taxCategory: key.taxCategory,
              taxRate: key.taxRate,
              merchant: key.merchant
          }
        })
      )
    )

    return (
        initialItems
    )
}

export default InitialItems;

