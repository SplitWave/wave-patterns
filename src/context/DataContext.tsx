'use client';
// context/DataContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the type for your data
export type Data = any;

// Create the context
const DataContext = createContext<{
  data: Data | null;
  setData: React.Dispatch<React.SetStateAction<Data | null>>;
}>({
  data: null,
  setData: () => null,
});

// Create a hook to use the context
export const useDataContext = () => useContext(DataContext);

// Create the context provider
export const DataProvider = ({ children }: any) => {
  const [data, setData] = useState<Data | null>(() => {
    // Load data from localStorage on component mount
    if (typeof window !== 'undefined') {
      // Load data from localStorage on component mount
      const storedData = localStorage.getItem('storedData');
      return storedData ? JSON.parse(storedData) : null;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save data to localStorage whenever it changes
      localStorage.setItem('storedData', JSON.stringify(data));
    }
  }, [data]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};
