const DBMerchants = [
    {
        id: 1001,
        name: "Costco",
    },
    {
        id: 1003,
        name: "Walmart",
    },
    {
        id: 1004,
        name: "Dairy Queen",
        taxCategory: "Restaurant",
        budgetCategory: "Restaurants"
    },
    {
        id: 1005,
        name: "Direct Communications",
        taxCategory: "NT",
        budgetCategory: "Internet"
    },
    {
        id: 1006,
        name: "LiveAuctioneers",
        budgetCategory: "Payday"
    },

]

function InitalMerchants() {
    let initialMerchants = []
    DBMerchants.map(key => (
        initialMerchants.push({
          label: key.name,
          value: {
              id: key.id,
              name: key.name,
              taxCategory: key.taxCategory,
              budgetCategory: key.budgetCategory,
          }
        })
      )
    )

    return (
        initialMerchants
    )
}

export default InitalMerchants;
