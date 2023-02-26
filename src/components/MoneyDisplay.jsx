import React, { useEffect, useState } from 'react';

const MoneyDisplay = ({total}) => {
    const [dollars, setDollars] = useState(0);
    const [cents, setCents] = useState(0);

    useEffect(() => {
        setDollars(Math.floor(total))
        setCents(total * 100 % 100)
    }, [total]);

    return (
    <>
        <div>${dollars}.{cents}</div>
    </>
)};

export default MoneyDisplay;