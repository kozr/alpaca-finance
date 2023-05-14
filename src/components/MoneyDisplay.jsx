import React, { useEffect, useState } from "react";

const MoneyDisplay = ({ total }) => {
  const [dollars, setDollars] = useState(0);
  const [cents, setCents] = useState(0);

  useEffect(() => {
    setDollars(Math.trunc(total));
    setCents(Math.trunc(Math.abs((total * 100) % 100)));
  }, [total]);

  return (
    <>
      <h2 className="text-4xl pt-3">
        ${dollars.toLocaleString("en-US")}.{cents}
      </h2>
    </>
  );
};

export default MoneyDisplay;
