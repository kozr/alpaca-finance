import React, { useContext } from "react";
import MoneyInput from "../../components/MoneyInput";
import NumPad from "../../components/Numpad";
import { RequestContext, ActionType, Page } from "@/contexts/request/requestEvenlyContext";
import Image from "next/image";
import Button from "@/components/Button";

export default function SelectAmount({ existingReason }) {
  const [amount, setAmount] = React.useState("");
  const [reason, setReason] = React.useState(existingReason || "");
  const { dispatch } = useContext(RequestContext);

  const handleChange = (value) => {
    setAmount(value);
  };

  const onClick = () => {
    dispatch({
      type: ActionType.CHANGE_TOTAL_AMOUNT,
      payload: {
        amount: amount,
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
          src="/right-arrow.svg"
          width={20}
          height={20}
          alt="right arrow"
        />
        <MoneyInput value={amount} />
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
