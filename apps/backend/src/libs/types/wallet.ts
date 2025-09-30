import { Node } from './node';

export type Wallet = Node & {
  accountId: string;
  balance: number;
  type: WalletType;
  createdAt: Date;
  updatedAt: Date;
};

export enum WalletType {
  GCASH = 'Gcash',
  CASH = 'Cash',
}

export type CreateWalletRequest = Omit<
  Partial<Wallet>,
  'createdAt' | 'updatedAt' | 'id' | 'accountId' | 'type'
>;

export type UpdateWalletRequest = Pick<Wallet, 'balance' | 'type'>;
