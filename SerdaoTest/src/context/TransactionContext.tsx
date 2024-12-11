import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import { AccountDetails, Transaction, TransactionContextType } from '../features/transaction/types/transactionTypes';

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps): JSX.Element => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(1000);

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
            await AsyncStorage.setItem('@amount', '1000');
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
      ToastAndroid.show(`Invalid transaction amount`, ToastAndroid.SHORT);
      return;
    }

    const newTransaction: Transaction = { id: Date.now(), amount, account };
    const newBalance = balance - amount;
    const newTransactions = [...transactions, newTransaction];

    try {
      setTransactions(newTransactions);
      setBalance(newBalance);
      await AsyncStorage.setItem('@amount', newBalance.toString());
      await AsyncStorage.setItem('@transactions', JSON.stringify(newTransactions));
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
