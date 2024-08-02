const DBAccounts = [
    {
        id: 1001,
        nickname: "Checking",
        isCC: false,
        pendingBalance: 1000, 
        currentBalance: 3500, 
        balanceAfterPending: 2500
    },
    {
        id: 1003,
        nickname: "Citi",
        isCC: true,
        pendingBalance: 1000, 
        currentBalance: 3500, 
        balanceAfterPending: 2500
    },
    {
        id: 1003,
        nickname: "Emergency Fund",
        isCC: false,
        pendingBalance: 1000, 
        currentBalance: 3500, 
        balanceAfterPending: 2500
    },
    {
        id: 1003,
        nickname: "Next Month Expenses",
        isCC: false,
        pendingBalance: 1000, 
        currentBalance: 3500, 
        balanceAfterPending: 2500
    },
    {
        id: 1003,
        nickname: "3rd Paycheck",
        isCC: false,
        pendingBalance: 1000, 
        currentBalance: 3500, 
        balanceAfterPending: 2500
    },
]

function InitalAccounts() {
    let initialAccounts = []
    DBAccounts.map(key => (
        initialAccounts.push({
          label: key.nickname,
          value: {
              id: key.id,
              nickname: key.nickname,
              isCC: key.isCC,
              currentBalance: key.currentBalance,
              pendingBalance: key.pendingBalance,
              balanceAfterPending: key.balanceAfterPending,
          }
        })
      )
    )

    return (
        initialAccounts
    )
}

export default InitalAccounts;
