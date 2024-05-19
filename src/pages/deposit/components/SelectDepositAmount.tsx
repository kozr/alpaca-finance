import React, { useState, useContext } from "react";
import { DepositContext, DepositPage } from "../../../contexts/deposit/depositContext";
import MoneyInput from "@/components/transaction-components/MoneyInput";
import NumPad from "@/components/transaction-components/Numpad";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import api from "@/utilities/api";

const SelectAmount = () => {
    const [depositAmount, setAmount] = React.useState("");
    const { dispatch } = useContext(DepositContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const authContext = useAuth();
    const currentUser = authContext.user;

    const handleChange = (value) => {
        setAmount(value);
    };

    const onClickNavigateToPage = (page) => {
        dispatch({ type: "SET_CURRENT_PAGE", page: page });
    };

    const onClick = async () => {

        try {

            if (isLoading) return;
            setIsLoading(true);

            // also needs to check the users account balance, can go below 0
            /*if (withdrawalAmount !== "" && parseFloat(withdrawalAmount) > 0) {
                alert("Invalid amount");
                setIsLoading(false);
                return;
            }*/

            const response = await api.fetch("/api/transactions", {
                method: "POST",
                body: JSON.stringify({
                    payee: currentUser,
                    type: "deposit",
                    amount: depositAmount,
                }),
            });
            const { data, error } = await response.json();
            if (error) {
                alert("Something went wrong, please try again later.");
                console.error(`error: ${JSON.stringify(error)}`);
                setIsLoading(false);
                return;
            }

            onClickNavigateToPage(DepositPage.Confirmation);
        }
        catch (error) {
            alert(JSON.stringify(error));
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col justify-between">
            <div className="flex flex-row justify-center my-5">
                <MoneyInput value={depositAmount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="flex flex-row justify-center my-5">
                <Button onClick={onClick} size="large" backgroundColor="bg-positive-green">
                    Deposit
                </Button>
            </div>
            <NumPad onChange={handleChange} customClass='my-5' />
        </div>
    );

};

export default SelectAmount;