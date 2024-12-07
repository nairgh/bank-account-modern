import React, { useReducer } from "react";
import "./App.css"; // Import Tailwind styles

// Initial state
const initialState = {
  balance: 0,
  transactions: [],
  hasLoan: false,
  loanAmount: 0, // Added to track the specific loan amount
};
// Reducer function
const bankReducer = (state, action) => {
  switch (action.type) {
    case "DEPOSIT":
      return {
        ...state,
        balance: state.balance + action.amount,
        transactions: [
          ...state.transactions,
          { type: "Deposit", amount: action.amount },
        ],
      };
    case "WITHDRAW":
      if (state.balance < action.amount) {
        alert("Insufficient funds!");
        return state;
      }
      return {
        ...state,
        balance: state.balance - action.amount,
        transactions: [
          ...state.transactions,
          { type: "Withdraw", amount: action.amount },
        ],
      };
    case "LOAN":
      if (state.hasLoan) {
        alert("Loan already taken. Repay it before taking another.");
        return state;
      }
      return {
        ...state,
        balance: state.balance + action.amount,
        hasLoan: true,
        loanAmount: action.amount, // Track the loan amount separately
        transactions: [
          ...state.transactions,
          { type: "Loan", amount: action.amount },
        ],
      };
    case "REPAY_LOAN":
      if (!state.hasLoan) {
        alert("No active loan to repay.");
        return state;
      }
      if (state.balance < state.loanAmount) {
        alert("Insufficient balance to repay the loan.");
        return state;
      }
      return {
        ...state,
        balance: state.balance - state.loanAmount,
        hasLoan: false,
        loanAmount: 0, // Reset loan amount
        transactions: [
          ...state.transactions,
          { type: "Repay Loan", amount: state.loanAmount },
        ],
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(bankReducer, initialState);
  const [amount, setAmount] = React.useState("");

  const handleDeposit = () => {
    if (amount && amount > 0) {
      dispatch({ type: "DEPOSIT", amount: parseFloat(amount) });
      setAmount("");
    } else {
      alert("Enter a valid amount");
    }
  };

  const handleWithdraw = () => {
    if (amount && amount > 0) {
      dispatch({ type: "WITHDRAW", amount: parseFloat(amount) });
      setAmount("");
    } else {
      alert("Enter a valid amount");
    }
  };

  const handleLoan = () => {
    const loanAmount = parseFloat(amount);
    if (!loanAmount || loanAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    if (loanAmount > 5000) {
      alert("Loan amount exceeds $5000. Please contact the branch.");
      return;
    }
    dispatch({ type: "LOAN", amount: loanAmount });
    setAmount("");
  };

  const handleRepayLoan = () => {
    dispatch({ type: "REPAY_LOAN" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Bank Account</h1>
        <div className="mb-4">
          <p className="text-lg">
            Balance:{" "}
            <span className="font-bold text-green-500">
              ${state.balance.toFixed(2)}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Loan Status:{" "}
            {state.hasLoan
              ? `Active ($${state.loanAmount.toFixed(2)})`
              : "No Loan"}
          </p>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex justify-between gap-4 mb-6">
          <button
            onClick={handleDeposit}
            className="w-1/3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Deposit
          </button>
          <button
            onClick={handleWithdraw}
            className="w-1/3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Withdraw
          </button>
          <button
            onClick={handleLoan}
            className="w-1/3 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          >
            Loan
          </button>
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={handleRepayLoan}
            disabled={!state.hasLoan}
            className={`w-full px-4 py-2 rounded-lg ${
              state.hasLoan
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Repay Loan
          </button>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Transactions</h2>
          <ul className="divide-y divide-gray-200">
            {state.transactions.map((txn, index) => (
              <li
                key={index}
                className={`py-2 flex justify-between px-4 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                <span>{txn.type}</span>
                <span>${txn.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
