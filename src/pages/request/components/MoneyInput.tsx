import React, { useEffect, useState } from "react";

const MoneyInput = ({ value, ...props }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [prefix, setPrefix] = useState("$");

  useEffect(() => {
    if (value < 0) {
      setPrefix("-$");
    }
    setInputValue(Math.abs(value));
  }, [value]);

  return (
    <div className="flex flex-row justify-center text-5xl items-center">
      <span className="pb-3 border-b-2 border-money-grey min-w-[150px] text-center">
        &nbsp;{inputValue && "$"}
        {inputValue}&nbsp;
      </span>
    </div>
  );
};

export default MoneyInput;
