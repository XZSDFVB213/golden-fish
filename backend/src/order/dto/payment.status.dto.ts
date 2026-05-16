class AmountPayment {
  value!: string;
  currency!: string;
}

class ObjectPayment {
  id!: string;
  status!: string;
  amount!: AmountPayment;
  payment_methond!: {
    type: string;
    id: string;
    saved: boolean;
    title: string;
    card: object;
  };
  created_at!: string;
  updated_at!: string;
  description!: string;
}
export class PaymentStatusDto {
  event!:
    | 'payment.succeeded'
    | 'payment.canceled'
    | 'payment.waiting_for_capture'
    | 'refund.succeeded';
  type!: string;
  object!: ObjectPayment;
}
