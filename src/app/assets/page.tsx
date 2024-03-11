'use client';
import { useDataContext } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import React from 'react';

function Page() {
  const { data } = useDataContext();
  const { isDarkMode } = useTheme();

  //console.log('data:', data);
  return (
    <div
      className={`w-full h-full p-10 ${
        isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-black '
      }`}>
      <h1 className=" text-[1.5rem] font-semibold ">Assets</h1>
      <h1 className=" text-gray-300 ">
        Understand your unrealized profit and loss per token
      </h1>
      <div
        className={`border mt-5 ${
          isDarkMode
            ? 'border-neutral-800 bg-white/[0.12] '
            : 'text-gray-700 bg-white'
        } rounded-lg overflow-x-auto `}>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-4 text-center w-40">Asset</th>
              <th className="px-4 py-4 text-center w-40">Token Name</th>
              <th className="px-4 py-4 text-center w-40">Current Price</th>
              <th className="px-4 py-4 text-center w-40">Balance</th>
              <th className="px-4 py-4 text-center w-40">Current Value</th>
            </tr>
          </thead>
          <tbody
            className={`border-t ${isDarkMode ? 'border-neutral-800  ' : ''} `}>
            {data
              .filter((token: any) => token.balance !== 0)
              .map((token: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2 w-40 flex items-center justify-center">
                    <Image
                      loader={({ src }) => src}
                      src={token.info.image}
                      alt=""
                      width={30}
                      height={30}
                      className="rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2 w-40 text-center">
                    {token.info.name}
                  </td>
                  <td className="px-4 py-2 w-40 text-center">
                    {token.currentPrice
                      ? `$${token.currentPrice.toFixed(2)}`
                      : '-'}
                  </td>
                  <td className="px-4 py-2 w-40 text-center">
                    {token.balance.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 w-40 text-center">
                    {token.currentPrice && token.balance
                      ? `$${(token.currentPrice * token.balance).toFixed(2)}`
                      : '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
