
import React, { createContext, useContext, ReactNode } from 'react';
import { FinancialContextType } from '@/types/financial';
import { useFinancialOperations } from '@/hooks/useFinancialOperations';

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancialContext = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancialContext must be used within a FinancialProvider');
  }
  return context;
};

interface FinancialProviderProps {
  children: ReactNode;
}

export const FinancialProvider = ({ children }: FinancialProviderProps) => {
  const financialOperations = useFinancialOperations();

  return (
    <FinancialContext.Provider value={financialOperations}>
      {children}
    </FinancialContext.Provider>
  );
};
