import React, { useContext, useReducer } from "react";
import { default as PageWrapper } from "@/components/Page";
import { DepositPage } from "../../contexts/deposit/depositContext";
import SelectAmount from "./components/SelectDepositAmount";
import Confirm from "../deposit/components/DepositConfirmation";

import { DepositProvider, DepositContext } from "../../contexts/deposit/depositContext";
const CurrentPage = () => {
    const { state } = React.useContext(DepositContext);
    switch (state.currentPage) {
        case DepositPage.InputAmount:
            return <SelectAmount />;
        case DepositPage.Confirmation:
            return <Confirm />;
    }
}

const Deposit = () => {
    return (
        <PageWrapper title="Deposit">
            <DepositProvider>
                <CurrentPage />
            </DepositProvider>
        </PageWrapper>
    );
};

export default Deposit;