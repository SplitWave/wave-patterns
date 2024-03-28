import { useTheme } from '@/context/ThemeContext';
import React from 'react';

function KaminoDataTable({ datas }: { datas: any }) {
  console.log('kamino data', datas.KaminoData);
  const { isDarkMode } = useTheme();
  return (
    <div
      className={` text-[0.875rem] ${
        isDarkMode ? ' ' : 'text-gray-700'
      } rounded-lg overflow-x-auto `}>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center w-40">Token</th>
            <th className="px-4 py-2 text-center w-40">Amount</th>
          </tr>
        </thead>
        <tbody
          className={`border-t ${isDarkMode ? 'border-neutral-800  ' : ''} `}>
          {datas.map((token: any, index: number) => (
            <tr key={index}>
              {/* <td className="px-4 py-2 w-40 flex items-center justify-center">
                  <Image
                    loader={({ src }) => src}
                    src={token.info.image}
                    alt=""
                    width={30}
                    height={30}
                    className="rounded-md"
                  />
                </td> */}
              <td className="px-4 py-2 w-40 text-center">
                {token.tokenAddress}
              </td>
              <td className="px-4 py-2 w-40 text-center">
                {token.amount ? `$${token.amount.toFixed(2)}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KaminoDataTable;
