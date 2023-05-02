import React, { useContext, useReducer } from "react";
import {default as PageWrapper }from "@/components/Page";
import { Page } from "./requestContext";
import SelectPayees from "./SelectPayees";
import SelectAmount from "./SelectAmount";
import Confirm from "./Confirmation";
import { RequestProvider, RequestContext } from "./requestContext";

const CurrentPage = () => {
  const { state } = useContext(RequestContext);
  switch (state.currentPage) {
    case Page.SelectPayees:
      return <SelectPayees />;
    case Page.SelectAmount:
      return <SelectAmount />;
    case Page.Confirmation:
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
