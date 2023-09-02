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
  const pendingPayments = payments.filter(payment => payment.state === "pending");

  return (
    <>
      <TabList items={pendingPayments} RowComponent={PaymentRow} />
    </>
  );
};

export default InvolvedPaymentTable;