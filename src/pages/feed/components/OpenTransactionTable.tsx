import { useEffect, useState } from "react";
import api from "@/utilities/api";
import TransactionRow from "./TransactionRow";
import ExpandableList from "./ExpandableList";

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

      <div className="text-xl font-bold text-gray-800 mt-4 flex justify-between"><div>All Open Transactions</div>
      </div>
      <ExpandableList
        items={transactions}
        limit={5}
        className="w-full bg-button-grey font-semibold text-black py-2 mt-5 rounded"
      >
        {(transaction) => (
          <TransactionRow key={transaction.id} transactionDetails={transaction} />
        )}
      </ExpandableList>
    </>
  );
};

export default OpenTransactionTable;
