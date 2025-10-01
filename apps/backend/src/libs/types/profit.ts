import { Node } from './node';
export type ProfitTier = Node & {
  maxAmount: number;
  minAmount: number;
  accountId: string;
  profit: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTierRequest = Pick<
  ProfitTier,
  'maxAmount' | 'minAmount' | 'profit'
> & { fee: number };
