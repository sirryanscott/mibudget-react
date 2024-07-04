import { formatCurrency } from "../utils/FormatCurrency";

function BudgetAmounts({budgetAmounts}) {
    return(
        <div>
            <h3>
                Budget
                <button className="new-item">+</button>
            </h3>
            <table className="budgets-container">
              <tr>
                  <th>Category</th>
                  <th>Budget Amount</th>
                  <th>Adjust +/-</th>
                  <th>Spent</th>
                  <th>Remaining</th>
              </tr>
                {budgetAmounts?.map((budgetAmount, index) => (
                    <tr key={index}>
                       <td>{budgetAmount.category}</td>
                       <td>{formatCurrency(budgetAmount.budgetAmount)}</td>
                       <td>{formatCurrency(budgetAmount.adjust)}</td>
                       <td>{formatCurrency(budgetAmount.spent)}</td>
                       <td className={budgetAmount.remaining < 0 ? 'negative' : ''}>
                          {formatCurrency(budgetAmount.remaining)}
                       </td>
                    </tr>
                ))}
            </table>
        {/*
            <div className="budgets-container">
                {budgetAmounts?.map((budgetAmount, index) => (
                    <div key={index} className="budget-item">
                       <p>{budgetAmount.category}</p>
                       <p>{budgetAmount.category}</p>
                    </div>
                ))}
            </div>
            */}
        </div>
    );
}

export default BudgetAmounts
