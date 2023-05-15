import React, { useContext } from "react";
import MoneyInput from "../components/MoneyInput";
import NumPad from "../components/Numpad";
import { RequestContext, ActionType, Page } from "../../../contexts/request/requestContext";
import Image from "next/image";
import Button from "@/components/Button";

export default function SelectAmount({ existingReason }) {
  const [amount, setAmount] = React.useState("");
  const [reason, setReason] = React.useState(existingReason || "");
  const { state, dispatch } = useContext(RequestContext);

  const {
    selectedPaymentRequest: { amount: _selectedAmount, user: selectedUser },
  } = state;

  const handleChange = (value) => {
    setAmount(value);
  };

  const onClick = () => {
    dispatch({
      type: ActionType.SET_PAYMENT_REQ_AMOUNT,
      payload: {
        id: selectedUser.id,
        amount: amount,
        reason: reason,
      },
    });
    dispatch({
      type: ActionType.SET_CURRENT_PAGE,
      payload: Page.SelectPayees,
    })
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-row justify-evenly my-5">
        <Image
          src={state.selectedPaymentRequest.user.avatar_url}
          className="rounded-xl"
          width={75}
          height={75}
          alt={`${selectedUser.first_name}'s avatar`}
        />
        <Image
          src="/right-arrow.svg"
          width={20}
          height={20}
          alt="right arrow"
        />
        <MoneyInput value={amount} />
      </div>
      <div className="flex justify-center my-10">
        <input
            className="p-2 border-2 border-gray-300 rounded"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason"
        />
      </div>
      <div className="flex flex-row justify-evenly my-5">
        <Button
          onClick={onClick}
          size="large"
          backgroundColor="bg-positive-green"
        >
          Next
        </Button>
      </div>
      <NumPad onChange={handleChange} customClass='my-5'/>
    </div>
  );
}
