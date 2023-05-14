import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import MoneyDisplay from './MoneyDisplay';
import Page from './Page';


const Wallet = () => {
    const { user } = useAuth()

    return (
    <div className="flex flex-row justify-start bg-[url('/balance-bg.png')] bg-no-repeat bg-cover rounded-md my-10 py-5">
        <div className="pl-5 py-5">
            <h1 className="text-md text-neutral-grey">Wallet</h1>
            <MoneyDisplay total={user?.balance} />
        </div>
    </div>
)};

export default Wallet;