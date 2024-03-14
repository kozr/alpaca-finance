import React, { useContext, useReducer } from "react";
import { default as PageWrapper } from "@/components/Page";
import { WithdrawPage } from "../../contexts/withdraw/withdrawContext";
import SelectAmount from "./components/SelectWithdrawalAmount";
import Confirm from "../withdraw/components/WithdrawalConfirmation";

import { WithdrawProvider, WithdrawContext } from "../../contexts/withdraw/withdrawContext";
const CurrentPage = () => {
    const { state } = React.useContext(WithdrawContext);
    // Assuming there's only one step in the withdrawal process for simplicity
    switch (state.currentPage) {
        case WithdrawPage.InputAmount:
            return <SelectAmount />;
        case WithdrawPage.Confirmation:
            return <Confirm />;
    }
}

const Withdraw = () => {
    return (
        <PageWrapper title="Withdraw">
            <WithdrawProvider>
                <CurrentPage />
            </WithdrawProvider>
        </PageWrapper>
    );
};

export default Withdraw;
