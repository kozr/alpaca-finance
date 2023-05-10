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

  return (
    <Page title="Feed">
      <div onClick={signOut}> Log out </div>
      <div className="font-bold text-20xl">{user?.email}</div>
      <Wallet />
      <ActionRow />
      <InvolvedPaymentTable />
      <OpenTransactionTable />
    </Page>
  );
};

export default Feed;
