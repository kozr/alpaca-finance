import Button from '@/components/Button';
import MoneyDisplay from '@/components/MoneyDisplay';
import React, { useContext } from 'react';


export default function Confirm() {

    return (
        <div className="flex flex-col h-[75vh] justify-between items-center">
            <div className="flex-grow flex items-center justify-center text-center px-4">
                <p className="font-medium text-lg">
                    Payment requests sent. Non-rejected payments will be processed in 48 hours.
                </p>
            </div>
            <div className="flex-none">
                <Button size='large' destination='/feed' backgroundColor='bg-positive-green'>Home</Button>
            </div>
        </div>
    );
}