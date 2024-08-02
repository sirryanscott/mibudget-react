const budgetCategories = [ "Groceries", "Restaurants", "Household Supplies", "Toiletries", "Payday" ]

function BudgetCategories() {
    let allBudgetCategories = []
    budgetCategories.map(key => (
        allBudgetCategories.push({
          label: key,
          value: key,
        })
      )
    )

    return (
        allBudgetCategories
    )
}

export default BudgetCategories;
