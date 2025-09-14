export type Transaction = {
  description?: string;
  amount: number;
  type: TransactionType;
  referenceNumber?: string;
  transactionDate: Date;
  transactionCode?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
};

export enum TransactionType {
  CASH_IN = 'Cash-in',
  CASH_OUT = 'Cash-out',
}

export type CreateTransactionRequest = Omit<
  Transaction,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'transactionCode'
>;
