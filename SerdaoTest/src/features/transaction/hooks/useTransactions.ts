import { useContext } from "react";
import { TransactionContextType } from "../types/transactionTypes";
import { TransactionContext } from "../../../context/TransactionContext";

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
