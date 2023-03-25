import MoneyRequestRow from "@/pages/request/components/MoneyRequestRow";
import React, { useState, useEffect, useContext } from "react";
import type { User } from "@/types";
import MoneyDisplay from "@/components/MoneyDisplay";
import Button from "@/components/Button";
import { Page, RequestContext } from "./requestContext";
import { ActionType } from "./requestContext";
import { useAuth } from "@/components/AuthProvider";

const SelectDebtors = () => {
  const [unselectedUser, setUnselectedUser] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<Array<User>>([]);
  const [total, setTotal] = useState<number>(0);
  const { state, dispatch } = useContext(RequestContext);
  const authContext = useAuth();
  const currentUser = authContext.user;

  useEffect(() => {
    if (!state.moneyRequests.length) {
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
    const unselectedUsers = state.moneyRequests.filter(
      (request) => request.amount === 0
    );
    setUnselectedUser(unselectedUsers.map((request) => request.user));
    const selectedUsers = state.moneyRequests.filter(
      (request) => request.amount > 0
    );
    setSelectedUser(selectedUsers.map((request) => request.user));
    setTotal(selectedUsers.reduce((acc, request) => acc + request.amount, 0));
  }, [state]);

  const onClickDebtors = (user: User) => {
    dispatch({ type: ActionType.EDIT_MONEY_REQ, payload: user });
  };

  const onClickNavigateToPage = (page) => {
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: page });
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <MoneyDisplay total={total}></MoneyDisplay>
      </div>
      <div className="flex justify-center my-10">
        <Button size="large" backgroundColor="bg-positive-green" onClick={() => onClickNavigateToPage(Page.Confirmation)}>
          Confirm
        </Button>
      </div>
      <div className="flex justify-center my-10">
        <Button size="large" backgroundColor="bg-positive-green" onClick={() => onClickNavigateToPage(Page.SelectAmount)}>
          Next
        </Button>
      </div>
      <div className="text-xl font-semibold my-3">Selected</div>
      {selectedUser.map((user: User) => (
        <div
          key={user.id}
          className="py-2"
          onClick={() => onClickDebtors(user)}
        >
          {/* Optimize */}
          <MoneyRequestRow moneyRequest={state.moneyRequests.find((mr) => mr.user.id === user.id)} />
        </div>
      ))}
      <div className="text-xl font-semibold my-3">Not Selected</div>
      {unselectedUser.map((user: User) => (
        <div
          key={user.id}
          className="py-2"
          onClick={() => onClickDebtors(user)}
        >
          {/* Optimize */}
          <MoneyRequestRow moneyRequest={state.moneyRequests.find((mr) => mr.user.id === user.id)} />
        </div>
      ))}
    </>
  );
};

export default SelectDebtors;
