import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Wallet from "@/components/Wallet";
import supabase from "@/utilities/supabase/frontend";
import Page from "@/components/Page";
import ActionRow from "./components/ActionRow";
import OpenTransactionTable from "./components/OpenTransactionTable";
import InvolvedPaymentTable from "./components/InvolvedPaymentTable";
import ActivePaymentTable from "./components/ActivePaymentTable";

const Feed = () => {
  const { user } = useAuth();
  const signOut = () => supabase.auth.signOut();

  const [visibleSection, setVisibleSection] = useState("activePayments");

  const renderSection = () => {
    switch (visibleSection) {
      case "activePayments":
        return <ActivePaymentTable />;
      case "involvedPayments":
        return <InvolvedPaymentTable />;
      case "openTransactions":
        return <OpenTransactionTable />;
      default:
        return null;
    }
  };

  return (
    <Page title="Feed">
      <div onClick={signOut}> Log out </div>
      <div className="font-bold text-20xl">{user?.email}</div>
      <Wallet />
      <ActionRow />

      {/* Buttons to toggle sections */}
      <div className="flex flex-row justify-center space-x-4 my-8">
        <button
          onClick={() => setVisibleSection("activePayments")}
          className={`px-4 py-3 text-sm rounded-lg shadow-md transition-transform transform hover:scale-105 ${
            visibleSection === "activePayments"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Active Payments
        </button>
        <button
          onClick={() => setVisibleSection("involvedPayments")}
          className={`px-4 py-3 text-sm rounded-lg shadow-md transition-transform transform hover:scale-105 ${
            visibleSection === "involvedPayments"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Payments Record
        </button>
        <button
          onClick={() => setVisibleSection("openTransactions")}
          className={`px-4 py-3 text-sm rounded-lg shadow-md transition-transform transform hover:scale-105 ${
            visibleSection === "openTransactions"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Open Transactions
        </button>
      </div>

      {/* Render the selected section */}
      <div className="px-0">{renderSection()}</div>
    </Page>
  );
};

export default Feed;
