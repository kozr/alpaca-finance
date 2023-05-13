import React from "react";
import Image from "next/image";
import { PaymentDetails } from "@/serializers/payments/payment-details-serializer";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import api from "@/utilities/api";

interface PaymentRowProps {
  paymentDetails: PaymentDetails;
  onClick?: () => void;
};

const PaymentRow = ({ paymentDetails, onClick }: PaymentRowProps) => {
  const authContext = useAuth()
  const currentUser = authContext.user

  const { id, payeeUserId, payerUserId, amount, payeeName, payerName, state, payeeAvatarUrl, payerAvatarUrl } = paymentDetails;
  const userIsPayee = currentUser?.id === payeeUserId;
  const targetName = userIsPayee ? payerName : payeeName;
  const targetAvatarUrl = userIsPayee ? payerAvatarUrl : payeeAvatarUrl;

  const onClickAccept = async () => {
    const res = await api.fetch(`/api/payments/${id}/accept`, {
      method: "POST",
    });
    const { data, error } = await res.json();
    if (error) {
      console.error(`error: ${JSON.stringify(error)}`);
    }
    window.location.reload();
  };
  

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
      <div className="flex flex-row items-center justify-end">
        {
          !userIsPayee && state === "pending" && (
            <div className="ml-4">
              <Button
                size="small"
                backgroundColor="bg-positive-green"
                onClick={onClickAccept}
              >
                <p>
                  Accept
                </p>
              </Button>
            </div>
          )

        }
        <div className="ml-4 text-sm font-light text-gray-600">
          {userIsPayee ? amount : -amount}
        </div>
      </div>
    </div>
  );
};

export default PaymentRow;