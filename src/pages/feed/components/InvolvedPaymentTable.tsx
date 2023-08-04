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

  return (
    <>

      <ExpandableList
        items={payments}
        limit={5}
        className="w-full bg-button-grey font-semibold text-black py-2 mt-5 rounded"
      >
        {(payment) => (
          <PaymentRow key={payment.id} paymentDetails={payment} />
        )}
      </ExpandableList>
    </>
  );
};

export default InvolvedPaymentTable;
