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
    //'CstHMD3QYcv4r9RM2dzWwLcAVekgJW7z2gNqcBhhneac'
    'CCoSKkgPWC1CSBki4LM9cCp9hM9zURQyfgY6h3UtNitR'
    //'7Bi8CQX7sV2wWSP4wCeE2rpHD8PdcQ3L99N8J2sKGSRT'
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
