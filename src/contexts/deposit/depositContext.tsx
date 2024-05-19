import { createContext, useReducer } from 'react';
import type { User } from '@/types';

export type DepositRequest = {
    user: User;
    amount: number;
};

export enum DepositPage {
    InputAmount = 0,
    Confirmation = 1,
}

// Defining the state structure and actions for deposits
type DepositState = {
    depositAmount: number;
    currentPage: DepositPage; // Add this line
};

type DepositAction =
    | { type: "SET_DEPOSIT_AMOUNT"; amount: number }
    | { type: "SET_CURRENT_PAGE"; page: DepositPage }
    | { type: "RESET_DEPOSIT" };

const initialState: DepositState = {
    depositAmount: 0,
    currentPage: DepositPage.InputAmount, // Set default page
};

function depositReducer(state: DepositState, action: DepositAction): DepositState {
    switch (action.type) {
        case "SET_DEPOSIT_AMOUNT":
            return { ...state, depositAmount: action.amount };
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.page }; // Handle setting the current page
        case "RESET_DEPOSIT":
            return initialState; // Resets to initial state, including the currentPage
        default:
            return state;
    }
}

const DepositContext = createContext<{
    state: DepositState;
    dispatch: React.Dispatch<DepositAction>;
}>({
    state: initialState,
    dispatch: () => null, // Placeholder function
});

type DepositProviderProps = {
    children: React.ReactNode;
};

const DepositProvider: React.FC<DepositProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(depositReducer, initialState);

    return (
        <DepositContext.Provider value={{ state, dispatch }}>
            {children}
        </DepositContext.Provider>
    );
};

export { DepositContext, DepositProvider };