import { Transaction, User } from "@/types";

export interface TransactionDetails {
  id: number;
  userId: number;
  type: string;
  name: string;
  createdAt: Date;
  state: string;
  avatarUrl: string;
}

const transactionDetailsSerializer = (transaction: Transaction, user: User): TransactionDetails => {
  return {
    id: transaction.id,
    userId: transaction.user_id,
    type: transaction.type,
    name: user.first_name + ' ' + user.last_name,
    createdAt: transaction.created_at,
    state: transaction.state,
    avatarUrl: user.avatar_url,
  }
}

export default transactionDetailsSerializer;