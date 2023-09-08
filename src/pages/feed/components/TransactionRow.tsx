import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { TransactionDetails } from "@/serializers/transactions/transaction-details-serializer";
import { PaymentDetails } from "@/serializers/payments/payment-details-serializer";
import PaymentRow from "./PaymentRow";
import { useAuth } from "@/components/AuthProvider";
import ExpandableList from "./ExpandableList";

interface TransactionRowProps {
  details: TransactionDetails;
  paymentDetails: PaymentDetails;
  onClick?: () => void;
};

const TransactionRow = ({ details,  onClick }: TransactionRowProps) => {
  const authContext = useAuth()
  const currentUser = authContext.user

  const { id, userId, type, name, createdAt, state, avatarUrl, totalAmount} = details;
  const totalTwoDecimals = totalAmount.toFixed(2);

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

  const acceptedAmount = payments.reduce((acc, payment) => {
    if (payment.state === "accepted") {
      return acc + payment.amount;
    }
    return acc;
  }, 0);

  const relevantPayments = payments.filter(payment => payment.transactionId === id && payment.state === "pending");
  const acceptedAmountToTwoDecimals = acceptedAmount.toFixed(2);
  const requestAmounts = relevantPayments.length;
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between p-2" style={{ backgroundColor: 'lightgray' }} onClick={onClick}>
        <div className="flex items-center">     
          <div className="pl-3 flex flex-col">
            <div className="font-medium">
              {/* {name} {currentUser?.id === userId && "(You)"} */}
              {requestAmounts} {requestAmounts === 1 ? "Request" : "Requests"} Sent
            </div>
            <div className="text-sm font-light text-gray-600">
              {type}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-600">
            {acceptedAmountToTwoDecimals} / {totalTwoDecimals}
          </div>
        </div>
      </div>
  
      {/* Separate div for ExpandableList */}
      <div className="flex flex-col items-center">
        <ExpandableList 
          items={relevantPayments} 
          limit={5}
          className={"w-full bg-button-grey font-semibold text-black py-2 mt-5 rounded"}
        >
          {(payment) => (
            <div key={payment.id} className="flex flex-wrap" style={{ backgroundColor: 'white' }}>
              <PaymentRow details={payment} />
            </div>
          )}
        </ExpandableList>
      </div>
      <div className="h-2"></div>
    </div>
  );
};

export default TransactionRow;
