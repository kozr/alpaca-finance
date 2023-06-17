import { useEffect, useState } from "react";
import api from "@/utilities/api";
import TransactionRow from "./TransactionRow";

const OpenTransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAll, setShowAll] = useState(false);

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
      <div className="text-xl font-bold text-gray-800 mt-4">All Open Transactions</div>
      {(showAll ? transactions : transactions.slice(0, 5)).map((transaction) => (
        <TransactionRow key={transaction.id} transactionDetails={transaction} />
      ))}

      {transactions.length >= 5 && ( // ONLY SHOWS THE BUTTON IF THERE ARE MORE THAN 5 TRANSACTIONS
        <button className="w-full bg-button-grey font-semibold text-black py-2 my-5 rounded"
        onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "Show All"}
        </button>
      )}
    </>
  );
};

export default OpenTransactionTable;

