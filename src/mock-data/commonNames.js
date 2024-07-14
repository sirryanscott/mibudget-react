const commonNames = [ "Bacon", "Whole Milk", "Cheddar Cheese", "Napkins", "Eggs", "Toilet Paper" ]

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
