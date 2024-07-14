const taxCategories = [ "Food", "Restaurant", "Use Tax", "NT" ]

function TaxCategories() {
    let allTaxCategories = []
    taxCategories.map(key => (
        allTaxCategories.push({
          label: key,
          value: key,
        })
      )
    )

    return (
        allTaxCategories
    )
}

export default TaxCategories;
