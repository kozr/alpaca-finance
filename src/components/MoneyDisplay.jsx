import React, { useEffect, useState } from 'react';

const MoneyDisplay = ({total, customDollarsClass, customCentsClass}) => {
    const [dollars, setDollars] = useState(0);
    const [cents, setCents] = useState(0);

    useEffect(() => {
        setDollars(Math.floor(total))
        setCents(total * 100 % 100)
    }, [total]);

    return (
    <>
        <div {...customDollarsClass}>${dollars}</div>.<div {...customCentsClass}>{cents}</div>
    </>
)};

export default MoneyDisplay;