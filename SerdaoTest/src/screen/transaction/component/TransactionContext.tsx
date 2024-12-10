import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

interface AccountDetails {
  name: string;
  iban: string;
}

interface Transaction {
  id: number;
  amount: number;
  account: AccountDetails;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (amount: number, account: AccountDetails) => void;
  balance: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps): JSX.Element => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(1000);

  const addTransaction = (amount: number, account: AccountDetails): void => {
    if (amount <= 0 || amount > balance) {
      Alert.alert("Invalid transaction amount");
      return;
    }
    const newTransaction: Transaction = { id: Date.now(), amount, account };
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    setBalance((prevBalance) => prevBalance - amount);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, balance }}>
      {children}
    </TransactionContext.Provider>
  );
};
