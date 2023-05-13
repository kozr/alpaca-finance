import React from "react";
import { useRouter } from "next/router";
import Button from "@/components/Button";

const RejectPayment = () => {
  const router = useRouter();
  const { cancel_token } = router.query;

  return (
    <Button
      size="large"
      destination={`/api/reject-payment/${cancel_token}`}
      backgroundColor="bg-negative-red"
    >
      Reject Payment
    </Button>
  );
};

export default RejectPayment;
