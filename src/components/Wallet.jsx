import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import Button from './Button';
import MoneyDisplay from './MoneyDisplay';


const Wallet = () => {
    const { user } = useAuth()

    return (
        <div>
            <div className="flex flex-row justify-center items-center content-center justify-between m-10 ">
                <Button
                size="small"
                iconLink="/vertical.svg" 
                backgroundColor="bg-button-grey"
                destination="/"
                />
                <h1 className="text-md">My Wallet</h1>
                <Button
                size="small"
                iconLink="/person.svg" 
                backgroundColor="bg-button-grey"
                destination="/"
                />
            </div>
            <div className="flex flex-row justify-start bg-[url('/balance-bg.png')] bg-no-repeat bg-cover rounded-md m-10 py-5">
                <div className="pl-5 py-5">
                    <h1 className="text-md text-neutral-grey">Wallet</h1>
                    <MoneyDisplay total={user.balance} />
                </div>
            </div>
            <div className="flex flex-row justify-between m-10 ">
                <Button
                size="small"
                iconLink="/request.svg" 
                backgroundColor="bg-button-grey"
                destination="/"
                buttonName="Request"
                />
                <Button
                size="small"
                iconLink="/send.svg" 
                backgroundColor="bg-button-grey"
                destination="/"
                buttonName="Send"
                />
                <Button
                size="small"
                iconLink="/deposit.svg" 
                backgroundColor="bg-button-grey"
                destination="/"
                buttonName="Deposit"
                />
                <Button
                size="small"
                iconLink="/withdrawal.svg" 
                backgroundColor="bg-button-grey"
                destination="/"
                buttonName="Withdraw"
                />
            </div>
        </div>
)};

export default Wallet;