import Button from "@/components/Button";

const ActionRow = () => (
  <div className="flex flex-row justify-between">
    <Button
      size="small"
      iconLink="/request.svg"
      backgroundColor="bg-button-grey"
      destination="/request"
      buttonName="Request"
    />
    <Button
      disabled
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
      destination="/deposit"
      buttonName="Deposit"
    />
    <Button
      size="small"
      iconLink="/withdrawal.svg"
      backgroundColor="bg-button-grey"
      destination="/withdraw"
      buttonName="Withdraw"
    />
  </div>
);

export default ActionRow;
