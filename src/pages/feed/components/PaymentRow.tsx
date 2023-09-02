import React, { useState } from "react";
import Image from "next/image";
import { PaymentDetails } from "@/serializers/payments/payment-details-serializer";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import api from "@/utilities/api";

interface PaymentRowProps {
  details: PaymentDetails;
  onClick?: () => void;
}

const PaymentRow = ({ details, onClick }: PaymentRowProps) => {
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
  } = details;
  const userIsPayee = currentUser?.id === payeeUserId;
  const targetName = userIsPayee ? payerName : payeeName;
  const targetAvatarUrl = userIsPayee ? payerAvatarUrl : payeeAvatarUrl;
  const amountTwoDecimals = Math.abs(amount).toFixed(2);
  // Format the createdAt field to only show date, month, and year
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  

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
            className="grid grid-rows-1 grid-cols-4 grid-flow-col justify-between pt-5 gap-0"
            onClick={onClick}
        >
            <div className="">
                <div className="mr-1 w-16 h-16 bg-gray-100">
                    <Image
                        className="object-cover w-16 h-16 rounded-md"
                        src={targetAvatarUrl}
                        alt={`${targetName}'s avatar`}
                        width={128}
                        height={128}
                    />
                </div>
                
            </div>
             <div className="flex flex-col">
                    <div className="font-medium">{targetName}</div>
                    {reason ? (
                        <div className="flex items-start text-xs font-light text-gray-600">
                            <div>{reason}</div>
                            <div>&nbsp;</div>
                        </div>
                    ) : (
                        <div className="text-sm font-light text-gray-600">({state})</div>
                    )}
                </div>   


            <div className="flex col-span-2 grid-grid-rows-2 grid-flow-col items-center justify-end">
                <div className="grid grid-rows-2">
                    {!userIsPayee && state === "pending" && (
                    <>  <div className="col-span-2 text-right text-sm font-bold text-gray-600">
                                {userIsPayee ? amountTwoDecimals : -amountTwoDecimals}
                        </div>

                        <div className="">
                            <Button
                                size="request"
                                backgroundColor={"bg-positive-green"}
                                onClick={onClickAccept}
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
                                    "Accept"
                                )}
                            </Button>   
                        </div>

                        <div className="ml-1">
                            <Button
                                size="request"
                                backgroundColor={"bg-negative-red"}
                                onClick={onClickDecline}
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
                                    "Decline"
                                )}
                            </Button>
                        </div>

                        
                    </>
                )}
                </div>
                

            </div>
        </div>
    );
};

export default PaymentRow;
