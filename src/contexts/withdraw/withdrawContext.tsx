import { createContext, useReducer } from 'react';
import type { User } from '@/types';

export type WithdrawRequest = {
    user: User;
    amount: number;
};

export enum WithdrawPage {
    InputAmount = 0,
    Confirmation = 1,
}

// Defining the state structure and actions for withdrawals
type WithdrawState = {
    withdrawAmount: number;
    currentPage: WithdrawPage; // Add this line
};

type WithdrawAction =
    | { type: "SET_WITHDRAW_AMOUNT"; amount: number }
    | { type: "SET_CURRENT_PAGE"; page: WithdrawPage }
    | { type: "RESET_WITHDRAWAL" };


const initialState: WithdrawState = {
    withdrawAmount: 0,
    currentPage: WithdrawPage.InputAmount, // Set default page
};

function withdrawReducer(state: WithdrawState, action: WithdrawAction): WithdrawState {
    switch (action.type) {
        case "SET_WITHDRAW_AMOUNT":
            return { ...state, withdrawAmount: action.amount };
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.page }; // Handle setting the current page
        case "RESET_WITHDRAWAL":
            return initialState; // Resets to initial state, including the currentPage
        default:
            return state;
    }
}

const WithdrawContext = createContext<{
    state: WithdrawState;
    dispatch: React.Dispatch<WithdrawAction>;
}>({
    state: initialState,
    dispatch: () => null, // Placeholder function
});

type WithdrawProviderProps = {
    children: React.ReactNode;
};

const WithdrawProvider: React.FC<WithdrawProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(withdrawReducer, initialState);

    return (
        <WithdrawContext.Provider value={{ state, dispatch }}>
            {children}
        </WithdrawContext.Provider>
    );
};

export { WithdrawContext, WithdrawProvider};