import Button from '@/components/Button';
import MoneyDisplay from '@/components/MoneyDisplay';
import React, { useContext, useEffect } from 'react';
import { RequestContext } from './requestContext';

export default function Confirm() {
  const { state, dispatch } = useContext(RequestContext);
  const total = state.moneyRequests.reduce((acc, request) => {
    acc += request.amount;
    return acc;
  }, 0);

  return (
    <div className="flex flex-col h-[75vh] justify-between items-center">
      <div className="flex-none">
        <MoneyDisplay total></MoneyDisplay>
      </div>
      <div className="flex-grow flex items-center justify-center text-center">
        Request sent, transfer will be completed within 48 hours if nobody denies
      </div>
      <div className="flex-none">
        <Button size='large' destination='/feed' backgroundColor='bg-positive-green'>Home</Button>
      </div>  
    </div>
  );
}
