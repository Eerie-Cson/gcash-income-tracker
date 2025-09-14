export type Wallet = {
  id: string;
  balance: number;
  type: WalletType;
  createdAt: Date;
  updatedAt: Date;
  accountId?: string;
};

export enum WalletType {
  GCASH = 'Gcash',
  CASH = 'Cash',
}

export type CreateWalletRequest = Omit<
  Partial<Wallet>,
  'createdAt' | 'updatedAt' | 'id'
>;
