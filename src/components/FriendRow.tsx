import React from "react";
import Image from "next/image";
import type { Payment, User, Transaction } from "../types";
import { useAuth } from "./AuthProvider";

type FriendRowProps = {
  user: User;
  payment?: Payment;
  transaction?: Transaction;
  onClick?: () => void;
};

const FriendRow = ({ user, payment, transaction, onClick }: FriendRowProps) => {
  const authContext = useAuth()
  const currentUser = authContext.user

  const amountColor = payment?.amount > 0 ? "money-green-500" : "money-red-500";
  const amount = payment?.amount < 0 ? `-${payment?.amount}` : payment?.amount;

  return (
    <div className="flex flex-row items-center flex-start" onClick={onClick}>
      <div className="flex-none float-left w-16 h-16 bg-gray-100">
        <Image
          className="object-cover w-16 h-16 rounded-md"
          src={user.avatar_url}
          alt={`${user.first_name}'s avatar`}
          width={128}
          height={128}
        />
      </div>
      <div className="flex flex-col">
        <div className="pl-3 font-medium">
          {user.first_name} {user.last_name} {currentUser?.id === user.id && "(You)"}
        </div>
        <div className="neutral-grey-500">
          {transaction && transaction.type} &nbsp;
        </div>
      </div>
      <div className="flex flex-col">
        <div className={`${amountColor}`}>{amount}</div>
        <div className="neutral-grey-500">{payment && new Date(payment?.created_at).toString()}</div>
      </div>
    </div>
  );
};

export default FriendRow;
