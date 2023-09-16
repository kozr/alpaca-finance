import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { useAuth } from "@/components/AuthProvider";
import TransactionRow from "./TransactionRow";
import TabList from "./TabList";

const OpenTransactionTable = () => {
  const authContext = useAuth();
  const currentUser = authContext.user;
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
  }, [currentUser]);

  const userTransactions = transactions.filter(transaction => transaction.state === "pending" && transaction.userId === currentUser.id);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2>You have no open transactions.</h2>
      </div>
    );
  }

  return (
    <>
      <TabList items={userTransactions} RowComponent={TransactionRow} />
    </>
  );
};

export default OpenTransactionTable;
