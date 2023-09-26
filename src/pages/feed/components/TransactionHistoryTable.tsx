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

  const dataLength = transactions ? transactions.length : 0;

  const [timeRange, setTimeRange] = useState('1 week'); // Default value

  const calculateDates = (range) => {
    let endDate = new Date();
    // set and initialize start date to now
    let startDate = new Date();

    switch (range) {
      case '1 week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '2 week':
        startDate.setDate(endDate.getDate() - 14);
        break;
      case '1 Month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '2 Month':
        startDate.setMonth(endDate.getMonth() - 2);
        break;
      case '6 Month':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1 Year':
        startDate.setMonth(endDate.getMonth() - 12);
        break;
      case 'All Time':
        startDate = new Date(0);
        break;
      // Add more cases as needed
      default:
        break;
    }
  // Log the dates for debugging
  console.log("Range:", range);
  console.log("Start Date:", startDate.toISOString());
  console.log("End Date:", endDate.toISOString());

    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
  };

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const { startDate, endDate } = calculateDates(timeRange);

        const response = await api.fetch(`/api/transactions/inactive?userId=${currentUser.id}&startDate=${startDate}&endDate=${endDate}`, {
          method: 'GET',
        });

        const transactionsJson = await response.json();

        setTransactions(transactionsJson.data);

      } catch (error) {
        alert(error);
      }
    };

    getTransactions();
  }, [currentUser.id, timeRange]);

  return (
    <>
      <div className="items-center justify-center">
        <select onChange={(e) => setTimeRange(e.target.value)} value={timeRange}>
          <option value="1 week">1 Week Ago</option>
          <option value="1 Month">1 Month Ago</option>
          <option value="2 Month">2 Months Ago</option>
          <option value="6 Month">6 Months Ago</option>
          <option value="1 Year">1 Year Ago</option>
          <option value="All Time">All Time</option>
          {/* Add more options as needed */}
        </select>
      </div>
      {dataLength === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <h2>You have no transaction payment records.</h2>
        </div>
      ) : (
        <div>
          <TabList items={transactions} RowComponent={TransactionRow} />
        </div>
      )}
    </>
  );

};

export default HistoryTable;
