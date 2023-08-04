import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { useAuth } from "@/components/AuthProvider";
import PaymentRow from "./PaymentRow";
import ExpandableList from "./ExpandableList";

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

  // Helper function to format a date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Filter out the payments with a "pending" state
  const pendingPayments = payments.filter(payment => payment.state === "pending");

  // Group pending payments by date
  const paymentsByDate = pendingPayments.reduce((groupedPayments, payment) => {
    const date = formatDate(payment.createdAt);
    if (!groupedPayments[date]) {
      groupedPayments[date] = [];
    }
    groupedPayments[date].push(payment);
    return groupedPayments;
  }, {});

  return (
    <>
      {Object.entries(paymentsByDate).map(([date, paymentsOnDate], idx) => (
        <div key={idx}>
          <h2>{date}</h2> {/* Display the date */}
          <hr /> {/* Black bar */}
          <ExpandableList
            items={paymentsOnDate}
            limit={5}
            className="w-full bg-button-grey font-semibold text-black py-2 mt-5 rounded"
          >
            {(payment, paymentIdx) => (
              <div key={payment.id} className={paymentIdx === paymentsOnDate.length - 1 ? "mb-4" : ""}>
                <PaymentRow paymentDetails={payment} />
              </div>
            )}
          </ExpandableList>
        </div>
      ))}
    </>
  );
};

export default InvolvedPaymentTable;