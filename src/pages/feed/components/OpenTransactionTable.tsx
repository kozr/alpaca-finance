import { useEffect, useState } from "react";
import api from "@/utilities/api";
import TransactionRow from "./TransactionRow";

const OpenTransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const transactionLength = transactions.length;

  const transaction_total_sum = transactions.reduce(
    (sum, transaction) => sum + transaction.total_amount, 
    0
  );

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await api.fetch("/api/transactions/active", {
          method: "GET",
        });
        const json = await response.json();
        setTransactions(json.data);
      } catch (error) {
        alert(error);
      }
    };

    getTransactions();
  }, []);

  return (
    <>
      <div className="text-xl font-bold text-gray-800 mt-4 flex justify-between">
        <div>All Open Transactions</div>
        <div>Pending: {transaction_total_sum}</div>
      </div>
      {(showAll ? transactions : transactions.slice(0, 5)).map((transaction) => (
        <TransactionRow key={transaction.id} transactionDetails={transaction} />
      ))}

      {transactionLength >= 5 && ( // ONLY SHOWS THE BUTTON IF THERE ARE MORE THAN 5 TRANSACTIONS
        <button className="w-full bg-gray-200 font-bold text-black py-2 my-2 rounded"
        onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "Show All"}
        </button>
      )}
    </>
  );
};

export default OpenTransactionTable;

