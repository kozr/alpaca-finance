import FriendRow from "@/components/FriendRow";
import React, { useState, useEffect, useReducer } from "react";
import type { User } from "@/types";
import Page from "@/components/Page";
import { request } from "https";
import MoneyDisplay from "@/components/MoneyDisplay";
import Button from "@/components/DestinationButton";

type MoneyRequest = {
  user: User;
  amount: number;
};

type State = {
  moneyRequests: Array<MoneyRequest>;
};

type Payload = {
  type: ActionType;
  payload: any;
};

enum ActionType {
  SET_MONEY_REQ_AMOUNT = "SET_MONEY_REQ_AMOUNT",
  ADD_USER = "ADD_USER",
  RESET = "RESET",
}

const reducer = (state: State, action: Payload): State => {
  switch (action.type) {
    case ActionType.SET_MONEY_REQ_AMOUNT:
      const requests = state.moneyRequests.map((request) => {
        if (request.user.id === action.payload.user.id) {
          request.amount = action.payload.amount;
        }
        return request;
      });
      return {
        moneyRequests: requests,
      };
    case ActionType.ADD_USER:
      const newMoneyRequest = {
        user: action.payload,
        amount: 0,
      };
      return {
        moneyRequests: [...state.moneyRequests, newMoneyRequest],
      };
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  moneyRequests: [],
};

const Request = () => {
  const [unselectedUser, setUnselectedUser] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<Array<User>>([]);
  const [total, setTotal] = useState<number>(0);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch("/api/users", { method: "GET" });
      const { data, error } = await response.json();
      if (error) console.error(`error: ${JSON.stringify(error)}`);
      data.forEach((user: User) => {
        dispatch({ type: ActionType.ADD_USER, payload: user });
      });
    };
    getUsers();

    return () => {
      dispatch({ type: ActionType.RESET, payload: null });
    }
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

  const onClickSelectedUser = (user: User) => {
    dispatch({
      type: ActionType.SET_MONEY_REQ_AMOUNT,
      payload: { user, amount: 0 },
    });
  };

  const onClickUnselectedUser = (user: User) => {
    dispatch({
      type: ActionType.SET_MONEY_REQ_AMOUNT,
      payload: { user, amount: 1 },
    });
  };


  return (
    <Page title="Request">
      <div className="flex justify-center my-10">
        <MoneyDisplay total={total}></MoneyDisplay>
      </div>
      <div className="flex justify-center my-10">
        <Button size="large" backgroundColor="bg-positive-green" >Confirm</Button>
      </div>
      <div className="text-xl font-semibold my-3">Selected</div>
      {selectedUser.map((user: User) => (
        <div key={user.id} className="py-2" onClick={() => onClickSelectedUser(user)}>
          <FriendRow user={user} />
        </div>
      ))}
      <div className="text-xl font-semibold my-3">Not Selected</div>
      {unselectedUser.map((user: User) => (
        <div key={user.id} className="py-2" onClick={() => onClickUnselectedUser(user)}>
          <FriendRow user={user} />
        </div>
      ))}
    </Page>
  );
};

export default Request;
