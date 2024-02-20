// WalletContext.tsx
'use client';
import React, { createContext, useState, useContext } from 'react';

interface WalletContextType {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: any) => {
  const [walletAddress, setWalletAddress] = useState(
    'E6HqfDLnE8Jk1BtGWFRWj8TsrceCJhkQoCcFmqZRmtAV'
  );

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};