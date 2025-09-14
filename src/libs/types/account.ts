import { Node } from './node';
export type Account = Node & {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAccountRequest = Omit<
  Partial<Account>,
  'id' | 'createdAt' | 'updatedAt'
>;
