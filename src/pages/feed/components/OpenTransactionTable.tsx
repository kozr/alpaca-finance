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

  return (
    <>
      <TabList items={userTransactions} RowComponent={TransactionRow} />
    </>
  );
};

export default OpenTransactionTable;
