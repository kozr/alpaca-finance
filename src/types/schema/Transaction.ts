type Transaction = {
  id: number;
  created_at: Date;
  updated_at: Date;
  state: string;
  type: string;
  failure_reason: string;
  requester_user_id: number;
}

export default Transaction;