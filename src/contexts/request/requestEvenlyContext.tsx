import { createContext, useReducer } from "react";
import type { User } from "@/types";

// need to type Payload

export type PaymentRequest = {
  user: User;
  amount: number;
  reason: string;
  selected: boolean;
};

export enum Page {
  SelectPayees = 0,
  SelectAmount = 1,
  Confirmation = 2,
}

type State = {
  paymentRequests: Array<PaymentRequest>;
  currentPage: Page;
  amountToSplit: number;
  defaultReason: string;
};

type Payload = {
  type: ActionType;
  payload: any;
};

export enum ActionType {
  CHANGE_TOTAL_AMOUNT = "CHANGE_TOTAL_AMOUNT",
  ADD_USER = "ADD_USER",
  RESET = "RESET",
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  CHANGE_PAYEE_SELECTION = "CHANGE_PAYEE_SELECTION",
  SET_DEFAULT_REASON = "SET_DEFAULT_REASON",
}

export const requestReducer = (state: State, action: Payload = null): State => {
  switch (action.type) {
    case ActionType.CHANGE_TOTAL_AMOUNT:
      const totalAmount = action.payload.amount;
      const amountOfPayees = state.paymentRequests.filter(
        (req) => req.selected
      ).length;
      const amountPerPayee =
        Math.round((totalAmount / amountOfPayees) * 100) / 100;
      const requests = state.paymentRequests.map((request) => {
        request.amount = Number(amountPerPayee);
        return request;
      });
      return {
        ...state,
        paymentRequests: requests,
      };
    case ActionType.ADD_USER:
      const newPaymentRequest = {
        user: action.payload,
        amount: 0,
        reason: "",
        selected: false,
      };
      return {
        ...state,
        paymentRequests: [...state.paymentRequests, newPaymentRequest],
      };
    case ActionType.RESET:
      return requestInitState;
    case ActionType.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case ActionType.CHANGE_PAYEE_SELECTION: {
      const newPaymentRequests = [];
      const totalAmount = action.payload.amount;
      const amountOfPayees = state.paymentRequests.filter(
        (req) => req.selected
      ).length;
      const amountPerPayee =
        Math.round((totalAmount / amountOfPayees) * 100) / 100;
      for (const request of state.paymentRequests) {
        if (request.user.id === action.payload.id) {
          request.selected = !request.selected
        }
        request.amount = amountPerPayee
        request.reason = state.defaultReason
        newPaymentRequests.push(request);
      }
      return {
        ...state,
        paymentRequests: newPaymentRequests,
      };
    }
    case ActionType.SET_DEFAULT_REASON:
      return {
        ...state,
        defaultReason: action.payload.reason,
      };
    default:
      return state;
  }
};

export const requestInitState = {
  paymentRequests: [],
  currentPage: Page.SelectAmount,
  amountToSplit: 0,
  defaultReason: "",
};

const RequestContext = createContext<{
  state: State;
  dispatch: React.Dispatch<any>;
}>({
  state: requestInitState,
  dispatch: () => null,
});

type RequestProviderProps = {
  children: React.ReactNode;
};

const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(requestReducer, requestInitState);

  return (
    <RequestContext.Provider value={{ state, dispatch }}>
      {children}
    </RequestContext.Provider>
  );
};

export { RequestContext, RequestProvider };
