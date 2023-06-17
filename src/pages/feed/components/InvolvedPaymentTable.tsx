import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { useAuth } from "@/components/AuthProvider";
import PaymentRow from "./PaymentRow";

const InvolvedPaymentTable = () => {
  const authContext = useAuth()
  const currentUser = authContext.user

  const [payments, setPayments] = useState([]);
  const [showAll, setShowAll] = useState(false);

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

  return (
    <>
      <div className="text-xl font-bold text-gray-800 mt-4">Payments Record</div>
      {(showAll ? payments : payments.slice(0, 5)).map((transaction) => (
        <PaymentRow key={transaction.id} paymentDetails={transaction} />
      ))}
      {payments.length >= 5 && ( // ONLY SHOWS THE BUTTON IF THERE ARE MORE THAN 5 PAYMENT RECORDS
      <button className="w-full bg-button-grey font-semibold text-black py-2 my-5 rounded"
        onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "Show All"}
        </button>
      )}
    </>
  );
};

export default InvolvedPaymentTable;
