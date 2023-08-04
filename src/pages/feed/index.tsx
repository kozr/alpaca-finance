import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Wallet from "@/components/Wallet";
import supabase from "@/utilities/supabase/frontend";
import Page from "@/components/Page";
import ActionRow from "./components/ActionRow";
import OpenTransactionTable from "./components/OpenTransactionTable";
import InvolvedPaymentTable from "./components/InvolvedPaymentTable";

const Feed = () => {
  const { user } = useAuth();
  const signOut = () => supabase.auth.signOut();
  const [selectedTab, setSelectedTab] = useState("requests");

  return (
    <Page title="Feed">
      <div onClick={signOut}> Log out </div>
      <div className="font-bold text-20xl">{user?.email}</div>
      <Wallet />
      <ActionRow />

      <div className="tabs">
        <div 
          className={`tab ${selectedTab === 'requests' ? 'selected' : ''}`} 
          onClick={() => setSelectedTab('requests')}>
          Requests
        </div>
        <div 
          className={`tab ${selectedTab === 'transactions' ? 'selected' : ''}`} 
          onClick={() => setSelectedTab('transactions')}>
          Transactions
        </div>
        <div 
          className={`tab ${selectedTab === 'history' ? 'selected' : ''}`} 
          onClick={() => setSelectedTab('history')}>
          History
        </div>
      </div>

      <div className="tab-underline"></div>

      {selectedTab === "requests" && <InvolvedPaymentTable />}
      {selectedTab === "transactions" && <OpenTransactionTable />}
    </Page>
  );
};

export default Feed;