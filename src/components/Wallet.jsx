import React, { useEffect, useState } from 'react';
import MoneyDisplay from './MoneyDisplay';

const Wallet = ({balance}) => {

    return (
    <div className='container mx-auto bg-slate-400'>
        <h3>Balance</h3>
        <MoneyDisplay total={balance} />
    </div>
)};

export default Wallet;