import React, { useEffect, useState } from "react";

const MoneyDisplay = ({ total }) => {
  const [dollars, setDollars] = useState(0);
  const [cents, setCents] = useState(0);
  const [prefix, setPrefix] = useState("");

  useEffect(() => {
    setDollars(Math.abs(Math.trunc(total)));
    setCents(Math.trunc(Math.abs((total * 100) % 100)));
    setPrefix(total < 0 ? "-" : "")
  }, [total]);

  return (
    <>
      <h2 className="text-4xl pt-3">
        {prefix}${dollars.toLocaleString("en-US")}.{cents}
      </h2>
    </>
  );
};

export default MoneyDisplay;
