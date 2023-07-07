export type Transaction = {
  id: number;
  created_at: Date;
  updated_at: Date;
  state: string;
  type: string;
  failure_reason: string;
  user_id: number;
  total_amount: number;
}

export default Transaction;