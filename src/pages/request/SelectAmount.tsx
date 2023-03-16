import React, { useContext } from "react";
import MoneyInput from "./components/MoneyInput";
import NumPad from "./components/Numpad";
import { RequestContext } from "./requestContext";
import Image from "next/image";

export default function SelectAmount() {
  const [amount, setAmount] = React.useState("");
  const { state, dispatch } = useContext(RequestContext);

  const {
    selectedMoneyRequest: { amount: selectedAmount, user: selectedUser },
  } = state;

  const handleChange = (value) => {
    setAmount(value);
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-row justify-evenly">
        <Image
          src={state.selectedMoneyRequest.user.avatar_url}
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
      <NumPad onChange={handleChange} />
    </div>
  );
}
