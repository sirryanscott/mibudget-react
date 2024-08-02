const commonNames = [ "Bacon", "Whole Milk", "Cheddar Cheese", "Napkins", "Eggs", "Toilet Paper", "Hand Soap", "Laundry Soap", "Toothpaste" ]

function CommonNames() {
    let allCommonNames = []
    commonNames.map(key => (
        allCommonNames.push({
          label: key,
          value: key,
        })
      )
    )

    return (
        allCommonNames
    )
}

export default CommonNames;
