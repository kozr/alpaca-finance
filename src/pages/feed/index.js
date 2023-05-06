import { useAuth } from "@/components/AuthProvider";
import Wallet from "@/components/Wallet";
import supabase from "@/utilities/supabase/frontend";
import Page from "@/components/Page";
import ActionRow from "./components/ActionRow";

const Feed = () => {
  const { user } = useAuth();
  const signOut = () => supabase.auth.signOut();

  return (
    <Page title="Feed">
      <div onClick={signOut}> Log out </div>
      <div className="font-bold text-20xl">{user?.email}</div>
      <Wallet />
      <ActionRow />
    </Page>
  );
};

export default Feed;
