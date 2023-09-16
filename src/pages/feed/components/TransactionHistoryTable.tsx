import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { useAuth } from "@/components/AuthProvider";
import TransactionRow from "./TransactionRow";
import TabList from "./TabList";

const HistoryTable = () => {
  const authContext = useAuth();
  const currentUser = authContext.user;
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const dataLength = combinedData ? combinedData.length : 0;

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await api.fetch(`/api/transactions/inactive?userId=${currentUser.id}`, {
          method: "GET",
        });
        const transactionsJson = await response.json();

        const paymentResponse = await api.fetch(`/api/payments/${currentUser.id}`, {
          method: "GET",
        });
        const paymentsJson = await paymentResponse.json();

        // Combine the data
        const combined = transactionsJson.data.concat(paymentsJson.data);
        setCombinedData(combined);

      } catch (error) {
        alert(error);
      }
    };

    getTransactions();
  }, []);

  if (dataLength === 0) {
      return (
        <div className="flex flex-col items-center justify-center">
          <h2>You have no transaction payment records.</h2>
        </div>
      );
  }

  return (
      <>
        <div>
          <TabList items={combinedData} RowComponent={TransactionRow} />
        </div>
      </>
  );

};

export default HistoryTable;
