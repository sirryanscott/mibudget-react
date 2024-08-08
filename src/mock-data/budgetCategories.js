const budgetCategories = [ {id:1, name:"Groceries"},{id:2,name: "Restaurants"}, {id:3, name: "Household Supplies"}, {id:4, name: "Toiletries"}, {id:5, name: "Payday"} ]

function BudgetCategories() {
    let allBudgetCategories = []
    budgetCategories.map(key => (
        allBudgetCategories.push({
          label: key.name,
          value: {
            id: key.id,
            name: key.name,
          }
        })
      )
    )

    return (
        allBudgetCategories
    )
}

export default BudgetCategories;
