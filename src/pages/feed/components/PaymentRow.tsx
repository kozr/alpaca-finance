import React, { useState } from "react";
import Image from "next/image";
import { PaymentDetails } from "@/serializers/payments/payment-details-serializer";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import api from "@/utilities/api";

interface PaymentRowProps {
  paymentDetails: PaymentDetails;
  onClick?: () => void;
}

const PaymentRow = ({ paymentDetails, onClick }: PaymentRowProps) => {
  const authContext = useAuth();
  const currentUser = authContext.user;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAccept, setIsAccept] = useState(true);

  const {
    id,
    createdAt,
    payeeUserId,
    payerUserId,
    amount,
    payeeName,
    payerName,
    state,
    payeeAvatarUrl,
    payerAvatarUrl,
    cancelToken,
    reason,
  } = paymentDetails;
  const userIsPayee = currentUser?.id === payeeUserId;
  const targetName = userIsPayee ? payerName : payeeName;
  const targetAvatarUrl = userIsPayee ? payerAvatarUrl : payeeAvatarUrl;
  const amountTwoDecimals = amount.toFixed(2);
  // Format the createdAt field to only show date, month, and year
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, dateOptions);

  const onClickAccept = async (e) => {
    e.preventDefault();
    try {
      if (isLoading) return;
      setIsLoading(true);
      const response = await api.fetch(`/api/payments/${id}/accept`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please contact the dev.");
      setIsLoading(false);
    }
    };

  const onClickDecline = async (e) => {
      e.preventDefault();
      try {
          if (isLoading) return;
          setIsLoading(true);
          const response = await api.fetch(`/api/payments/${id}/reject?cancel_token=${cancelToken}`, {
              method: "POST",
          });
          if (!response.ok) {
              throw new Error('HTTP error ' + response.status);
          }
          window.location.reload();

      } catch (error) {
          console.error(error);
          alert("Something went wrong. Please contact the dev.");
          setIsLoading(false);
      }
   };

    return (
        <div
            className="flex flex-row items-center justify-between pt-5"
            onClick={onClick}
        >
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
                    <div className="font-medium">{targetName}</div>
                    {reason ? (
                        <div className="flex items-start text-sm font-light text-gray-600">
                            <div>{reason}</div>
                            <div>&nbsp;</div>
                            <div>({state})</div>
                        </div>
                    ) : (
                        <div className="text-sm font-light text-gray-600">({state})</div>
                    )}
                </div>
            </div>
            <div className="flex flex-row items-center justify-end">
                {!userIsPayee && state === "pending" && (
                    <>
                        <div className="ml-2">
                            <button onClick={() => setIsAccept(!isAccept)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                        </div>

                        <div className="ml-4">
                            <Button
                                size="small"
                                backgroundColor={isAccept ? "bg-positive-green" : "bg-negative-red"}
                                onClick={isAccept ? onClickAccept : onClickDecline}
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    isAccept ? "Accept" : "Decline"
                                )}
                            </Button>
                        </div>
                        
                    </>
                )}
                <div className="ml-4 text-sm font-light text-gray-600">
                    {userIsPayee ? amountTwoDecimals : -amountTwoDecimals}
                </div>
            </div>
        </div>
    );
};

export default PaymentRow;
