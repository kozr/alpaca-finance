import React, { useState } from "react";
import Image from "next/image";
import { PaymentDetails } from "@/serializers/payments/payment-details-serializer";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import api from "@/utilities/api";

interface PaymentRowProps {
  details: PaymentDetails;
  onClick?: () => void;
  size?: "small" | "normal";
}

const PaymentRow = ({ details, onClick, size = "normal" }: PaymentRowProps) => {
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
        className="grid grid-rows-1 grid-cols-4 pt-5 gap-1 border-2 inline-block align-baseline"
        onClick={onClick}>
            

            {/* Icon and name */}
            <div className="">
                <div className={`mr-1 bg-gray-100 ${size === 'small' ? 'w-8 h-8' : 'w-16 h-16'}`}>
                    <Image
                        className={`rounded-md  ${size === 'small' ? 'w-8 h-8' : 'w-16 h-16'}`}
                        src={targetAvatarUrl}
                        alt={`${targetName}'s avatar`}
                        width={128}
                        height={128}
                    />
                </div>
            </div>

             <div className="flex flex-col border-2">
                    <div className="font-medium text-sm">{targetName}</div>
                    {reason ? (
                        <div className="flex items-start text-xs font-light text-gray-600">
                            <div>{reason}</div>
                            <div>&nbsp;</div>
                        </div>
                    ) : (
                        <div className="text-sm font-light text-gray-600">({state})</div>
                    )}
            </div>   


            <div className="flex flex-col items-end justify-end col-start-4 ">              
                <div className="grid grid-cols-2">
                    {/* display state if user is payee and display buttons to accept if user is not */}
                    {userIsPayee ? (
                            // Display state when user is the payee
                        <div className="text-right text-sm font-bold text-gray-600 mb-2 col-start-4">
                            ${amountTwoDecimals} {state}
                        </div>
                        ) : (
                    <>  
                        <div className="text-right text-sm font-bold text-gray-600 mb-2 col-start-4">
                            {/* Display pending amount when user is the payee */}
                            ${amountTwoDecimals}
                        </div>
                        <div className="flex items-center justify-center">
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

                        <div className="flex items-center justify-center col-start-4 ml-10">
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
