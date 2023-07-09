import React, { useEffect, useState } from "react";

const setDisplay = (value, inputValue) => {
  // regex match cases: . | .0 | .00, prepends 0 in front of decimal
  const regex = /^\./;
  var display = value.toString();
  if(regex.test(display)) {
    display = "0" + display;
  }
  return display;
}

const MoneyInput = ({ value, ...props }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [prefix, setPrefix] = useState("$");
  const display = setDisplay(value, inputValue);

  useEffect(() => {
    if (value < 0) {
      setPrefix("-$");
    }
    setInputValue(Math.abs(value));
  }, [value]);

  return (
    <div className="flex flex-row justify-center text-5xl items-center">
      <span className="pb-3 border-b-2 border-money-grey min-w-[150px] text-center">
        &nbsp;{display && "$"}
        {display}&nbsp;
      </span>
    </div>
  );
};

export default MoneyInput;
