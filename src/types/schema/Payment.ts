export type Payment = {
  id: number;
  created_at: Date;
  updated_at: Date;
  state: string;
  amount: number;
  currency: string;
  failure_reason: string;
  payer_user_id: string;
  payee_user_id: string;
  transaction_id: number;
}

export default Payment;