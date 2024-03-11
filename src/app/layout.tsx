import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { WalletProvider } from '@/context/WalletContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { DataProvider } from '@/context/DataContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wave-patterns',
  description: 'Your on chain spending habits...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <WalletProvider>
        <body className={inter.className}>
          <ThemeProvider>
            <DataProvider>
              <div>
                <Header />
                <div className=" w-screen  flex flex-row">
                  <div className=" lg:w-1/6  h-[125rem] ">
                    <Sidebar />
                  </div>
                  <div className=" lg:w-5/6  ">{children}</div>
                </div>
              </div>
            </DataProvider>
          </ThemeProvider>
        </body>
      </WalletProvider>
    </html>
  );
}
