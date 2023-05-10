import React from "react";
import Image from "next/image";
import { PaymentDetails } from "@/serializers/payments/payment-details-serializer";
import { useAuth } from "@/components/AuthProvider";

interface PaymentRowProps {
  paymentDetails: PaymentDetails;
  onClick?: () => void;
};

const TransactionRow = ({ paymentDetails, onClick }: PaymentRowProps) => {
  const authContext = useAuth()
  const currentUser = authContext.user

  const { payeeUserId, payerUserId, amount, payeeName, payerName, state, payeeAvatarUrl, payerAvatarUrl } = paymentDetails;
  const userIsPayee = currentUser?.id === payeeUserId;
  const targetName = userIsPayee ? payerName : payeeName;
  const targetAvatarUrl = userIsPayee ? payerAvatarUrl : payeeAvatarUrl;

  return (
    <div className="flex flex-row items-center justify-between pt-5" onClick={onClick}>
      <div className="flex items-center">
        <div className="flex-none w-16 h-16 bg-gray-100">
          <Image
            className="object-cover w-16 h-16 rounded-md"
            src={targetAvatarUrl}
            alt={`${targetName}'s avatar`}
            width={128}
            height={128}
          />
        </div>
        <div className="pl-3 flex flex-col">
          <div className="font-medium">
            {targetName}
          </div>
          <div className="text-sm font-light text-gray-600">
            {state}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-light text-gray-600">
          {userIsPayee ? -amount : amount}
        </div>
      </div>
    </div>
  );
};

export default TransactionRow;
