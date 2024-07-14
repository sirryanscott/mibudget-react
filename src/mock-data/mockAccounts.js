const DBAccounts = [
    {
        id: 1001,
        name: "Checking",
    },
    {
        id: 1003,
        name: "Citi",
    },
    {
        id: 1003,
        name: "Emergency Fund",
    },
    {
        id: 1003,
        name: "Next Month Expenses",
    },
    {
        id: 1003,
        name: "3rd Paycheck",
    },
]

function InitalAccounts() {
    let initialAccounts = []
    DBAccounts.map(key => (
        initialAccounts.push({
          label: key.name,
          value: {
              id: key.id,
              name: key.name,
          }
        })
      )
    )

    return (
        initialAccounts
    )
}

export default InitalAccounts;
