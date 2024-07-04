import Account from "./Account"
let accounts = [{"name":"Checking", "pendingBalance":1000, "currentBalance":3500}]
//let accounts = ["Checking"];

function AccountsTable(){
    return (
        <div>
          {accounts.map((item, key) => (<Account key={key} name={item.name} currentBalance={item.currentBalance} pendingAmount={item.pendingBalance}></Account>))}
        </div>
    );
}

export default AccountsTable
