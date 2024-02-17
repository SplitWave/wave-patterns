import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard/Dashboard';
import Sidebar from '@/components/Sidebar';

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
      <body className={inter.className}>
        <div>
          <Header />
          <div className=" w-screen  flex flex-row">
            <div className=" lg:w-1/6    ">
              <Sidebar />
            </div>
            <div className=" lg:w-5/6  ">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
