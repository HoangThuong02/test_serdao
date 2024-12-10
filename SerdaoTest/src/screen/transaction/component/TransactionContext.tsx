import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
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
  const [balance, setBalance] = useState<number>(0);

  // Get transaction & amount if exists 😁
  useEffect(() => {
    const loadBalance = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('@amount');
        const storedTransactions = await AsyncStorage.getItem('@transactions');

        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
        if (storedBalance) {
          setBalance(parseFloat(storedBalance));
        } else {
          setBalance(1000);
          try {
            await AsyncStorage.setItem('@amount', balance.toString());
            console.log('Amount saved successfully');
          } catch (error) {
            console.error('Error saving data', error);
          }
        }
      } catch (error) {
        console.error('Error loading balance from AsyncStorage', error);
        setBalance(1000);
      }
    };

    loadBalance();
  }, []);

  const addTransaction = async (amount: number, account: AccountDetails): Promise<void> => {
    if (amount <= 0 || amount > balance) {
      Alert.alert("Invalid transaction amount");
      return;
    }

    const newTransaction: Transaction = { id: Date.now(), amount, account };
    const newBalance = balance - amount;
    const newTransactions = [...transactions, newTransaction];

    // Save transaction & amount 💋
    try {
      setTransactions(newTransactions);
      setBalance(newBalance);

      await AsyncStorage.setItem('@amount', newBalance.toString());
      await AsyncStorage.setItem('@transactions', JSON.stringify(newTransactions));

      console.log('Transactions and balance saved successfully');
    } catch (error) {
      console.error('Error saving data to AsyncStorage', error);
    }
  };


  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, balance }}>
      {children}
    </TransactionContext.Provider>
  );
};
