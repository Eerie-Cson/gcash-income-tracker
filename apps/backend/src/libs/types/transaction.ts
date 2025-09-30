import { Node } from './node';
export type Transaction = Node & {
  description?: string;
  amount: number;
  accountId: string;
  transactionType: TransactionType;
  referenceNumber?: string;
  transactionDate: Date;
  profit: number;
  transactionCode: string;
  customerName?: string;
  customerPhone?: string;
  createdAt: Date;
  updatedAt: Date;
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
  | 'profit'
> &
  (
    | {
        transactionType: TransactionType.CASH_IN;
      }
    | {
        transactionType: TransactionType.CASH_OUT;
        separateFee: boolean;
      }
  );
