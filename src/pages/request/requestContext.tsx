import { createContext, useReducer } from 'react';
import type { User } from '@/types';

type MoneyRequest = {
  user: User;
  amount: number;
};

export enum Page {
  SelectDebtors = 0,
  SelectAmount = 1,
  Confirm = 2,
}

type State = {
  moneyRequests: Array<MoneyRequest>;
  selectedMoneyRequest: MoneyRequest | null;
  currentPage: Page;
};

type Payload = {
  type: ActionType;
  payload: any;
};

export enum ActionType {
  SET_MONEY_REQ_AMOUNT = "SET_MONEY_REQ_AMOUNT",
  ADD_USER = "ADD_USER",
  RESET = "RESET",
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  EDIT_MONEY_REQ = "EDIT_MONEY_REQ",
}

export const requestReducer = (state: State, action: Payload): State => {
  switch (action.type) {
    case ActionType.SET_MONEY_REQ_AMOUNT:
      const requests = state.moneyRequests.map((request) => {
        if (request.user.id === action.payload.user.id) {
          request.amount = action.payload.amount;
        }
        return request;
      });
      return {
        ...state,
        moneyRequests: requests,
      };
    case ActionType.ADD_USER:
      const newMoneyRequest = {
        user: action.payload,
        amount: 0,
      };
      return {
        ...state,
        moneyRequests: [...state.moneyRequests, newMoneyRequest],
      };
    case ActionType.RESET:
      return requestInitState;
    case ActionType.SET_CURRENT_PAGE:
      return {
        ...state,
        selectedMoneyRequest: null,
        currentPage: action.payload,
      };
    case ActionType.EDIT_MONEY_REQ:
      for (const request of state.moneyRequests) {
        if (request.user.id === action.payload.id) {
          return {
            ...state,
            selectedMoneyRequest: request,
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
  moneyRequests: [],
  selectedMoneyRequest: null,
  currentPage: Page.SelectDebtors,
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
