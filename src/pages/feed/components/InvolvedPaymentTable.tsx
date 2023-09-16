import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { useAuth } from "@/components/AuthProvider";
import PaymentRow from "./PaymentRow";
import TabList from "./TabList";

const InvolvedPaymentTable = () => {
  const authContext = useAuth();
  const currentUser = authContext.user;

  const [payments, setPayments] = useState([]);

  const userId = currentUser ? currentUser.id : "null";
  // Filter out the payments with a "pending" state
  const pendingPayments = payments.filter(payment => payment.state === "pending" && payment.payerUserId === userId);
  useEffect(() => {
    const getPayments = async () => {
      try {
        const response = await api.fetch(`/api/payments/${currentUser.id}`, {
          method: "GET",
        });
        const json = await response.json();
        setPayments(json.data);
      } catch (error) {
        console.error(`error: ${JSON.stringify(error)}`);
        alert(error);
      }
    };

    getPayments();
  }, [currentUser]);




  if (pendingPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2>There are no pending requests for you.</h2>
      </div>
    );
  }

  return (
    <>
      <div className="">
        <TabList items={pendingPayments} RowComponent={PaymentRow} />
      </div>
    </>
  );
};

export default InvolvedPaymentTable;