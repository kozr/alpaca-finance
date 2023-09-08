import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { useAuth } from "@/components/AuthProvider";
import PaymentRow from "./PaymentRow";
import ExpandableList from "./ExpandableList";
import TabList from "./TabList";

const InvolvedPaymentTable = () => {
  const authContext = useAuth();
  const currentUser = authContext.user;

  const [payments, setPayments] = useState([]);

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


  // Filter out the payments with a "pending" state
  const pendingPayments = payments.filter(payment => payment.state === "pending" && payment.payerUserId === currentUser.id);

  if (pendingPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
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