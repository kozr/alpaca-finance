export type Payment = {
  id: number;
  created_at: Date;
  updated_at: Date;
  state: string;
  amount: number;
  currency: string;
  failure_reason: string;
  payer_user_id: number;
  payee_user_id: number;
  transaction_id: number;
}

export default Payment;