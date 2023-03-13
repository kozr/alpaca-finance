import { useAuth } from "@/components/AuthProvider";
import Wallet from "@/components/Wallet";
import supabase from "@/utilities/supabase/frontend";
import FriendRow from "@/components/FriendRow";
import DestinationButton from "@/components/DestinationButton";
import Page from "@/components/Page";

const Feed = () => {
  const { user } = useAuth();
  const signOut = () => supabase.auth.signOut();

  return (
    <Page title="Feed">
      <div className="font-bold text-10xl">FEED</div>
      <div onClick={signOut}> Log out </div>
      <div className="font-bold text-20xl">{user?.email}</div>
      <Wallet />
      <div className="flex flex-row justify-between">
        <DestinationButton
          size="small"
          iconLink="/request.svg"
          backgroundColor="bg-button-grey"
          destination="/request"
          buttonName="Request"
        />
        <DestinationButton
          size="small"
          iconLink="/send.svg"
          backgroundColor="bg-button-grey"
          destination="/"
          buttonName="Send"
        />
        <DestinationButton
          size="small"
          iconLink="/deposit.svg"
          backgroundColor="bg-button-grey"
          destination="/"
          buttonName="Deposit"
        />
        <DestinationButton
          size="small"
          iconLink="/withdrawal.svg"
          backgroundColor="bg-button-grey"
          destination="/"
          buttonName="Withdraw"
        />
      </div>
      <FriendRow user={user} />
    </Page>
  );
};

export default Feed;
