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
        },
        lastPurchasePrice: 5.74,
    },
    {
        id: 10002,
        name: "KS Mild Cheddar Cheese - 258852",
        commonName: "Cheddar Cheese",
        budgetCategory: "Groceries",
        taxCategory: "Food",
        merchant: {
            id: 1001,
            name: "Costco",
        },
        lastPurchasePrice: 5.79,
    },
    {
        id: 10004,
        name: "KS Laundry Soap - 888383",
        commonName: "Laundry Soap",
        budgetCategory: "Household Supplies",
        taxCategory: "Use Tax",
        merchant: {
            id: 1001,
            name: "Costco",
        },
        lastPurchasePrice: 17.99,
    },
    {
        id: 10007,
        name: "Crest Whitening Toothpaste 4 pack - 384838",
        commonName: "Toothpaste",
        budgetCategory: "Toiletries",
        taxCategory: "Use Tax",
        merchant: {
            id: 1001,
            name: "Costco",
        },
        lastPurchasePrice: 0,
    },
    {
        id: 10006,
        name: "KS Hand Soap - 384838",
        commonName: "Hand Soap",
        budgetCategory: "Toiletries",
        taxCategory: "Use Tax",
        merchant: {
            id: 1001,
            name: "Costco",
        },
        lastPurchasePrice: 0,
    },
    {
        id: 10005,
        name: "KS Toilet Paper - 384838",
        commonName: "Toilet Paper",
        budgetCategory: "Toiletries",
        taxCategory: "Use Tax",
        merchant: {
            id: 1001,
            name: "Costco",
        },
        lastPurchasePrice: 0,
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
        },
        lastPurchasePrice: 9.89,
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
              merchant: key.merchant,
              lastPurchasePrice: key.lastPurchasePrice
          }
        })
      )
    )

    return (
        initialItems
    )
}

export default InitialItems;

