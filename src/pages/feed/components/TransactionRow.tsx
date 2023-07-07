import React from "react";
import Image from "next/image";
import { TransactionDetails } from "@/serializers/transactions/transaction-details-serializer";
import { useAuth } from "@/components/AuthProvider";

interface TransactionRowProps {
  transactionDetails: TransactionDetails;
  onClick?: () => void;
};

const TransactionRow = ({ transactionDetails, onClick }: TransactionRowProps) => {
  const authContext = useAuth()
  const currentUser = authContext.user

  const { id, userId, type, name, createdAt, state, avatarUrl, total_amount } = transactionDetails;

  return (
    <div className="flex flex-row items-center justify-between pt-5" onClick={onClick}>
      <div className="flex items-center">
        <div className="flex-none w-16 h-16 bg-gray-100">
          <Image
            className="object-cover w-16 h-16 rounded-md"
            src={avatarUrl}
            alt={`${name}'s avatar`}
            width={128}
            height={128}
          />
        </div>
        <div className="pl-3 flex flex-col">
          <div className="font-medium">
            {name} {currentUser?.id === userId && "(You)"}
          </div>
          <div className="text-sm font-light text-gray-600">
            {type}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-light text-gray-600">
          {total_amount}
        </div>
      </div>
    </div>
  );
};

export default TransactionRow;
