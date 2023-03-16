import React, { useEffect, useState } from "react";

const MoneyInput = ({ value, ...props }) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="flex flex-row justify-center text-5xl font-normal">
      <span className="border-b-2 border-money-grey pb-2 min-w-[150px] text-center">
        &nbsp;{inputValue && "$"}
        {inputValue}&nbsp;
      </span>
    </div>
  );
};

export default MoneyInput;
