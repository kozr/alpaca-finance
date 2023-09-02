import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { useAuth } from "@/components/AuthProvider";
import TransactionRow from "./TransactionRow";
import TabList from "./TabList";

const HistoryTable = () => {
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
  }, []);

  return (
    <>
      <TabList items={transactions} RowComponent={TransactionRow} />
    </>
  );
};

export default HistoryTable;
