const DBMerchants = [
    {
        id: 1001,
        name: "Costco",
        zipcode: 84045,
        taxRates: [
            {
                Food: .03,
                UseTax: .0735,
                Restaurant: .0835,
            }
        ]
    },
    {
        id: 1003,
        name: "Walmart",
        zipcode: 84045,
        taxRates: [
            {
                Food: .03,
                UseTax: .0735,
                Restaurant: .0835,
            }
        ]
    }
]

function InitalMerchants() {
    let initialMerchants = []
    DBMerchants.map(key => (
        initialMerchants.push({
          label: key.name,
          value: {
              id: key.id,
              name: key.name,
              zipcode: key.zipcode,
              taxRates: key.taxRates,
          }
        })
      )
    )

    return (
        initialMerchants
    )
}

export default InitalMerchants;
