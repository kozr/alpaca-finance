import { useAuth } from "@/components/AuthProvider";
import Wallet from "@/components/Wallet";
import supabase from "@/utilities/supabase/frontend";
import FriendRow from "@/components/FriendRow";
import Button from "@/components/Button";
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
      <div className="flex flex-row justify-between m-10 ">
        <Button
          size="small"
          iconLink="/request.svg"
          backgroundColor="bg-button-grey"
          destination="/request"
          buttonName="Request"
        />
        <Button
          size="small"
          iconLink="/send.svg"
          backgroundColor="bg-button-grey"
          destination="/"
          buttonName="Send"
        />
        <Button
          size="small"
          iconLink="/deposit.svg"
          backgroundColor="bg-button-grey"
          destination="/"
          buttonName="Deposit"
        />
        <Button
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
