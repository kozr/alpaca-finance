import Button from '@/components/Button';
import MoneyDisplay from '@/components/MoneyDisplay';
import React, { useContext } from 'react';
import { RequestContext } from '@/contexts/request/requestIndividuallyContext';

export default function Confirm() {
  const { state } = useContext(RequestContext);
  const total = state.paymentRequests.reduce((acc, request) => acc + request.amount, 0);
  
  return (
    <div className="flex flex-col h-[75vh] justify-between items-center">
      <div className="flex-none">
        <MoneyDisplay total={total}></MoneyDisplay>
      </div>
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
