import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

function StakedAccountTable({ datas }: { datas: any }) {
  const { isDarkMode } = useTheme();
  const [solPrice, setSolPrice] = useState<number>(0);
  async function getCurrentSolanaPrice() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      );

      // Extract SOL price from the response data
      const solPrice = response.data.solana.usd;
      setSolPrice(solPrice);

      //console.log('Current Solana Price (USD):', solPrice);
      return solPrice;
    } catch (error: any) {
      console.error('Error fetching Solana price:', error.message);
    }
  }

  useEffect(() => {
    getCurrentSolanaPrice();
  });

  const mappedStakes = datas.StakedAccounts.map((stakeAccount: any) => {
    const stakeAuthorityAddress = stakeAccount.stake_authority_address;

    let mappedValue = '';
    let icon = null;

    // Check if stakeAuthorityAddress starts with 'stWirq'
    if (stakeAuthorityAddress.startsWith('stWirq')) {
      mappedValue = 'mSOL';
      icon = (
        <Image
          src="/assets/mSOL.png"
          alt=""
          width={24}
          height={24}
        />
      );
    }
    // Check if stakeAuthorityAddress starts with 'solb2w9'
    else if (stakeAuthorityAddress.startsWith('solb2w9')) {
      mappedValue = 'bSOL';
      icon = (
        <Image
          src="/assets/bSOL.png"
          alt=""
          width={24}
          height={24}
          className=" rounded-[2.5rem] "
        />
      );
    }

    // Check if stakeAuthorityAddress starts with 'solb2w9'
    else if (stakeAuthorityAddress.startsWith('J1toso1')) {
      mappedValue = 'jitoSOL';
      icon = (
        <Image
          src="/assets/JitoSOL.webp"
          alt=""
          width={24}
          height={24}
          className=" rounded-[2.5rem] "
        />
      );
    }

    // Return stake account object with mapped value and icon
    return { ...stakeAccount, mappedValue, icon };
  });

  return (
    <div className="overflow-x-auto">
      <div className={` ${isDarkMode ? ' ' : 'text-gray-600'} rounded-lg  `}>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center w-40">Asset</th>
              <th className="px-4 py-2 text-center w-45">Total Amount (SOL)</th>
              <th className="px-4 py-2 text-center w-45">
                Current Amount (SOL)
              </th>
              <th className="px-4 py-2 text-center w-45">Active Stake (SOL)</th>
              <th className="px-4 py-2 text-center w-45">Status</th>
            </tr>
          </thead>
          <tbody
            className={`border-t ${isDarkMode ? 'border-neutral-800  ' : ''} `}>
            {mappedStakes.map((stakeAccount: any, index: any) => (
              <tr key={index}>
                <td className="px-4 py-2 w-40 flex items-center justify-center">
                  {stakeAccount.icon}
                  <h1 className=" ml-2 ">{stakeAccount.mappedValue}</h1>
                </td>
                <td className="px-4 py-2 w-45 text-center">
                  {stakeAccount.total_amount.toFixed(2)}
                </td>
                <td className="px-4 py-2 w-45 text-center">
                  {`$${(stakeAccount.total_amount * solPrice).toFixed(2)}`}
                </td>
                <td className="px-4 py-2 w-45 text-center">
                  {stakeAccount.active_amount.toFixed(2)}
                </td>
                <td className="px-4 py-2 w-45 text-center">
                  {stakeAccount.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StakedAccountTable;
