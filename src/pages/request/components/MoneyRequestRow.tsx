import React from "react";
import Image from "next/image";
import { MoneyRequest } from "../requestContext";
import { useAuth } from "../../../components/AuthProvider";

type MoneyRequestRowProps = {
  moneyRequest: MoneyRequest
  onClick?: () => void;
};

const MoneyRequestRow = ({ moneyRequest, onClick }: MoneyRequestRowProps) => {
  const authContext = useAuth()
  const currentUser = authContext.user

  const { user, amount } = moneyRequest;

  const amountColor = amount > 0 ? "money-green-500" : "money-red-500";
  const signedAmount = amount < 0 ? `-${amount}` : amount;

  return (
    <div className="flex flex-row items-center justify-between" onClick={onClick}>
      <div className="flex items-center">
        <div className="flex-none w-16 h-16 bg-gray-100">
          <Image
            className="object-cover w-16 h-16 rounded-md"
            src={user.avatar_url}
            alt={`${user.first_name}'s avatar`}
            width={128}
            height={128}
          />
        </div>
        <div className="pl-3 font-medium">
          {user.first_name} {user.last_name} {currentUser?.id === user.id && "(You)"}
        </div>
      </div>
      <div className="flex flex-col">
        <div className={`${amountColor}`}>{signedAmount}</div>
      </div>
    </div>
  );
};

export default MoneyRequestRow;
