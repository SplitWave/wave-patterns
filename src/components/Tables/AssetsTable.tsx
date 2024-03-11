import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

function AssetsTable({
  datas,
  topFiveAssets,
}: {
  datas: any;
  topFiveAssets: any;
}) {
  const { isDarkMode } = useTheme();
  return (
    <>
      <div
        className={` text-[0.875rem] ${
          isDarkMode ? ' ' : 'text-gray-700'
        } rounded-lg overflow-x-auto `}>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center w-40">Asset</th>
              <th className="px-4 py-2 text-center w-40">Token Name</th>
              <th className="px-4 py-2 text-center w-40">Current Price</th>
              <th className="px-4 py-2 text-center w-40">Balance</th>
              <th className="px-4 py-2 text-center w-40">Current Value</th>
            </tr>
          </thead>
          <tbody
            className={`border-t ${isDarkMode ? 'border-neutral-800  ' : ''} `}>
            {topFiveAssets.map((token: any, index: number) => (
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
      <Link href={{ pathname: '/assets' }}>
        <p className=" text-center mt-4 ">Click here to see more</p>
      </Link>
    </>
  );
}

export default AssetsTable;
