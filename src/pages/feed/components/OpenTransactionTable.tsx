import { useEffect, useState } from "react";
import api from "@/utilities/api";
import TransactionRow from "./TransactionRow";

const OpenTransactionTable = () => {
  const [transactions, setTransactions] = useState([]);

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
      <div className="text-xl font-bold text-gray-800 mt-4">Open Transactions</div>
      {transactions.map((transaction) => (
        <TransactionRow key={transaction.id} transactionDetails={transaction} />
      ))}
    </>
  );
};

export default OpenTransactionTable;
