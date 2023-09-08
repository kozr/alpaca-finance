import { Payment, User } from "@/types";

export interface PaymentDetails {
  id: number;
  amount: number;
  payeeName: string;
  payerName: string;
  payeeUserId: string;
  payerUserId: string;
  transactionId: number;
  createdAt: Date;
  state: string;
  payeeAvatarUrl: string;
  payerAvatarUrl: string;
  cancelToken: string;
  reason: string;
}

const paymentDetailsSerializer = (payment: Payment, payee: User, payer: User): PaymentDetails => {
  return {
    id: payment.id,
    amount: payment.amount,
    payeeName: `${payee.first_name} ${payee.last_name}`,
    payerName: `${payer.first_name} ${payer.last_name}`,
    payeeUserId: payee.id,
    payerUserId: payer.id,
    transactionId: payment.transaction_id,
    createdAt: payment.created_at,
    state: payment.state,
    payeeAvatarUrl: payee.avatar_url,
    payerAvatarUrl: payer.avatar_url,
    cancelToken: payment.cancel_token,
    reason: payment.reason,
  }
}

export default paymentDetailsSerializer;