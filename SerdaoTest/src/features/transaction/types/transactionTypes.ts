export interface AccountDetails {
  name: string;
  iban: string;
}

export interface Transaction {
  id: number;
  amount: number;
  account: AccountDetails;
}

export interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (amount: number, account: AccountDetails) => void;
  balance: number;
}
