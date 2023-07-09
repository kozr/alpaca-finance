import React, { useState } from "react";

type NumPadProps = {
  onChange: (value: string) => void;
  customClass?: string;
};

enum NumPadValue {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  DECIMAL = ".",
  ZERO = "0",
  BACKSPACE = "⌫",
}

const NumPad = ({ onChange, customClass }: NumPadProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleClick = (value) => {
    handleNumpadClick(value);
  };

  const buttons = [
    { value: NumPadValue.ONE },
    { value: NumPadValue.TWO },
    { value: NumPadValue.THREE },
    { value: NumPadValue.FOUR },
    { value: NumPadValue.FIVE },
    { value: NumPadValue.SIX },
    { value: NumPadValue.SEVEN },
    { value: NumPadValue.EIGHT },
    { value: NumPadValue.NINE },
    { value: NumPadValue.DECIMAL },
    { value: NumPadValue.ZERO },
    { value: NumPadValue.BACKSPACE, className: "numpad-button--backspace" },
  ];

  const validInput = (value) => {
    const [numbers, decimals] = inputValue.split(".");
    if (value === NumPadValue.DECIMAL && inputValue.includes(".")) return false;
    if (inputValue.includes(NumPadValue.DECIMAL) && decimals.length >= 2)
      return false;
    if (
      numbers.length > 3 &&
      value !== NumPadValue.DECIMAL &&
      !(decimals?.length <= 2)
    )
      return false;
    if (inputValue === "0" && value === "0") return false;
    return true;
  };

  const adjustedInputValue = (value) => {
    if (inputValue === "0") return "";
    return inputValue;
  };

  const handleNumpadClick = (value) => {
    if (value === NumPadValue.BACKSPACE) {
      const newValue = inputValue.slice(0, -1);
      onChange(newValue);
      setInputValue(newValue);
    } else {
      if (!validInput(value)) return;
      const newValue = adjustedInputValue(inputValue) + value;
      onChange(newValue);
      setInputValue(newValue);
    }
  };

  return (
    <div className={`grid grid-cols-3 gap-x-4 gap-y-10 text-5xl font-light ${customClass}`}>
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`numpad-button ${button.className || ""} active:bg-gray-300`}
          onClick={() => handleClick(button.value)}
        >
          {button.value}
        </button>
      ))}
    </div>
  );
};

export default NumPad;
