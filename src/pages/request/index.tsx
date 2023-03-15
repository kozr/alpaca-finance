import React, { useContext, useReducer } from "react";
import {default as PageWrapper }from "@/components/Page";
import { Page } from "./requestContext";
import SelectDebtors from "./SelectDebtors";
import SelectAmount from "./SelectAmount";
import Confirm from "./Confirm";
import { RequestProvider, RequestContext } from "./requestContext";

const CurrentPage = () => {
  const { state } = useContext(RequestContext);
  switch (state.currentPage) {
    case Page.SelectDebtors:
      return <SelectDebtors />;
    case Page.SelectAmount:
      return <SelectAmount />;
    case Page.Confirm:
      return <Confirm />;
  }
}

const Request = () => {
  return (
    <PageWrapper title="Request">
      <RequestProvider>
        <CurrentPage />
      </RequestProvider>
    </PageWrapper>
  );
};

export default Request;
