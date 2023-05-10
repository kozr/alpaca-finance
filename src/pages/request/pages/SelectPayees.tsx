import PaymentRequestRow from "@/pages/request/components/PaymentRequestRow";
import React, { useState, useEffect, useContext } from "react";
import type { User } from "@/types";
import MoneyDisplay from "@/components/MoneyDisplay";
import Button from "@/components/Button";
import { Page, RequestContext } from "../context/requestContext";
import { ActionType } from "../context/requestContext";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utilities/api";

const SelectPayees = () => {
  const [unselectedUser, setUnselectedUser] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<Array<User>>([]);
  const [total, setTotal] = useState<number>(0);
  const { state, dispatch } = useContext(RequestContext);
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

  const onClickProcessRequest = async () => {
    try {
      const response = await api.fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          payee: currentUser,
          type: 'request',
          paymentRequests: state.paymentRequests.filter((request) => request.amount > 0),
        }),
      });
      const { data, error } = await response.json();
      if (error) console.error(`error: ${JSON.stringify(error)}`);

      onClickNavigateToPage(Page.Confirmation);
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  return (
    <>
      <div className="flex justify-center my-10">
        <MoneyDisplay total={total}></MoneyDisplay>
      </div>
      <div className="flex justify-center my-10">
        <Button size="large" backgroundColor="bg-positive-green" onClick={() => onClickProcessRequest()}>
          Confirm
        </Button>
      </div>
      <div className="text-xl font-semibold my-3">Selected</div>
      {selectedUser.map((user: User) => (
        <div
          key={user.id}
          className="py-2"
          onClick={() => onClickPayees(user)}
        >
          {/* Optimize */}
          <PaymentRequestRow paymentRequest={state.paymentRequests.find((mr) => mr.user.id === user.id)} />
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
          <PaymentRequestRow paymentRequest={state.paymentRequests.find((mr) => mr.user.id === user.id)} />
        </div>
      ))}
    </>
  );
};

export default SelectPayees;
