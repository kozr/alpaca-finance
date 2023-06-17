import PaymentRequestRow from "@/pages/request/components/PaymentRequestRow";
import React, { useState, useEffect, useContext } from "react";
import type { User } from "@/types";
import MoneyDisplay from "@/components/MoneyDisplay";
import Button from "@/components/Button";
import { Page, RequestContext } from "@/contexts/request/requestIndividuallyContext";
import { ActionType } from "@/contexts/request/requestIndividuallyContext";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utilities/api";

const SelectPayees = () => {
  const { state, dispatch } = useContext(RequestContext);
  const [unselectedUser, setUnselectedUser] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<Array<User>>([]);
  const [total, setTotal] = useState<number>(0);
  const [defaultReason, setDefaultReason] = useState<string>(state.defaultReason);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const authContext = useAuth();
  const currentUser = authContext.user;

  useEffect(() => {
    if (!state.paymentRequests.length) {
      const getUsers = async () => {
        const response = await fetch("/api/users", { method: "GET" });
        const { data, error } = await response.json();
        if (error) console.error(`error: ${JSON.stringify(error)}`);
        data.forEach((user: User) => {
          if (user.id !== currentUser.id)
            dispatch({ type: ActionType.ADD_USER, payload: user });
        });
      };
      getUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unselectedUsers = state.paymentRequests.filter(
      (request) => request.amount === 0
    );
    setUnselectedUser(unselectedUsers.map((request) => request.user));
    const selectedUsers = state.paymentRequests.filter(
      (request) => request.amount > 0
    );
    setSelectedUser(selectedUsers.map((request) => request.user));
    setTotal(selectedUsers.reduce((acc, request) => acc + request.amount, 0));
  }, [state]);

  const onClickPayees = async (user: User) => {
    await dispatch({ type: ActionType.EDIT_PAYMENT_REQ, payload: user });
  };

  const onClickNavigateToPage = (page) => {
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: page });
  };

  const onTextboxChange = (e) => {
    const reason = e.target.value
    setDefaultReason(reason)
    dispatch({
      type: ActionType.SET_DEFAULT_REASON, payload: {
      reason: reason
    }})
  }

  const onClickProcessRequest = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const activePaymentRequests = state.paymentRequests.filter(
        (request) => request.amount > 0
      )
      if (!activePaymentRequests.length) {
        alert("Please select at least one payee.");
        setIsLoading(false);
        return;
      }
      const response = await api.fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          payee: currentUser,
          type: "request",
          paymentRequests: activePaymentRequests,
        }),
      });
      const { data, error } = await response.json();
      if (error) {
        alert("Something went wrong, please try again later.");
        console.error(`error: ${JSON.stringify(error)}`);
        setIsLoading(false);
        return;
      }
      onClickNavigateToPage(Page.Confirmation);
    } catch (error) {
      alert(JSON.stringify(error));
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <MoneyDisplay total={total}></MoneyDisplay>
      </div>
      <div className="flex justify-center my-10">
        <input
            className="p-2 border-2 border-gray-300 rounded"
            type="text"
            value={defaultReason}
            onChange={onTextboxChange}
            placeholder="Enter default reason"
        />
      </div>
      <div className="flex justify-center my-10">
        <Button
          size="large"
          backgroundColor="bg-positive-green"
          onClick={() => onClickProcessRequest()}
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Confirm"
          )}
        </Button>
      </div>
      <div className="text-xl font-semibold my-3">Selected</div>
      {selectedUser.map((user: User) => (
        <div key={user.id} className="py-2" onClick={() => onClickPayees(user)}>
          {/* Optimize */}
          <PaymentRequestRow
            paymentRequest={state.paymentRequests.find(
              (mr) => mr.user.id === user.id
            )}
          />
        </div>
      ))}
      <div className="text-xl font-semibold my-3">Not Selected</div>
      {unselectedUser.map((user: User) => (
        <div
          key={user.id}
          className="py-2"
          onClick={async () => await onClickPayees(user)}
        >
          {/* Optimize */}
          <PaymentRequestRow
            paymentRequest={state.paymentRequests.find(
              (mr) => mr.user.id === user.id
            )}
          />
        </div>
      ))}
    </>
  );
};

export default SelectPayees;
