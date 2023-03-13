import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import MoneyDisplay from './MoneyDisplay';


const Wallet = () => {
    const { user } = useAuth()

    return (
        <div>
            <div className="flex flex-row justify-between m-10 ">
                <h1>B1</h1>
                <h1 className="text-md">My Wallet</h1>
                <h1>B2</h1>
            </div>
            <div className="flex flex-row justify-start bg-[url('/balance-bg.png')] bg-no-repeat bg-cover rounded-md m-10 py-5">
                <div className="pl-5 py-5">
                    <h1 className="text-md text-stone-500">Wallet</h1>
                    <MoneyDisplay total={user.balance} />
                </div>
            </div>
            <div className="flex flex-row justify-between m-10 ">
                <h1>B1</h1>
                <h1>B2</h1>
                <h1>B3</h1>
                <h1>B4</h1>
            </div>
        </div>
)};

export default Wallet;