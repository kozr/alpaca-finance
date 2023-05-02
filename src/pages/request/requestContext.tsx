import { createContext, useReducer } from 'react';
import type { User } from '@/types';

// need to type Payload

export type PaymentRequest = {
  user: User;
  amount: number;
};

export enum Page {
  SelectPayees = 0,
  SelectAmount = 1,
  Confirmation = 2,
}

type State = {
  paymentRequests: Array<PaymentRequest>;
  selectedPaymentRequest: PaymentRequest | null;
  currentPage: Page;
};

type Payload = {
  type: ActionType;
  payload: any;
};

export enum ActionType {
  SET_PAYMENT_REQ_AMOUNT = "SET_PAYMENT_REQ_AMOUNT",
  ADD_USER = "ADD_USER",
  RESET = "RESET",
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  EDIT_PAYMENT_REQ = "EDIT_PAYMENT_REQ",
}

export const requestReducer = (state: State, action: Payload = null): State => {
  switch (action.type) {
    case ActionType.SET_PAYMENT_REQ_AMOUNT:
      const requests = state.paymentRequests.map((request) => {
        if (request.user.id === action.payload.id) {
          request.amount = Number(action.payload.amount);
        }
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
        selectedPaymentRequest: null,
        currentPage: action.payload,
      };
    case ActionType.EDIT_PAYMENT_REQ:
      for (const request of state.paymentRequests) {
        if (request.user.id === action.payload.id) {
          return {
            ...state,
            selectedPaymentRequest: request,
            currentPage: Page.SelectAmount,
          };
        }
      }
      return state
    default:
      return state;
  }
};

export const requestInitState = {
  paymentRequests: [],
  selectedPaymentRequest: null,
  currentPage: Page.SelectPayees,
};

const RequestContext = createContext<{
  state: State;
  dispatch: React.Dispatch<any>;
}>({
  state: requestInitState,
  dispatch: () => null
});

type RequestProviderProps = {
  children: React.ReactNode;
}

const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(requestReducer, requestInitState);

  return (
    <RequestContext.Provider value={{state, dispatch}}>
      {children}
    </RequestContext.Provider>
  )
}

export { RequestContext, RequestProvider };
