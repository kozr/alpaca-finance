import React from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";

const RejectPayment = () => {
  const router = useRouter();
  const { cancel_token } = router.query;

  const onClickCancel = () => {
    router.push(`/api/payments/${cancel_token}`)
  };

  return (
    <Button
      size="large"
      onClick={onClickCancel}
      backgroundColor="bg-negative-red"
    >
      Reject Payment
    </Button>
  );
};

export default RejectPayment;
