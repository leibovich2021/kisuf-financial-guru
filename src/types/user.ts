
export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  createdAt: string;
}

export interface UserData {
  transactions: Transaction[];
  budgets: Budget[];
  settings?: any;
}

import { Transaction, Budget } from './index';
