import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

function StakedAccountTable({ datas }: { datas: any }) {
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
      <div className="border border-neutral-800 rounded-lg  ">
        <div className="grid grid-flow-col auto-cols-auto  text-md text-left p-2">
          {/* <div className="p-2 col-span-2 ">Stake Account</div> */}
          <div className="p-2 w-24">Assets</div>
          <div className="p-2 w-24">Total Amount (SOL)</div>
          <div className="p-2 w-24">Current Amount (SOL)</div>
          <div className="p-2 w-24">Active Stake (SOL)</div>
          <div className="p-2 w-24">Status</div>
        </div>
        <div className="border-t border-neutral-800 p-2">
          {mappedStakes.map((stakeAccount: any, index: any) => (
            <div
              key={index}
              className="grid grid-flow-col auto-cols-auto text-sm">
              <div className="p-2 w-24 flex flex-row ">
                {stakeAccount.icon}
                <h1 className=" ml-2 ">{stakeAccount.mappedValue}</h1>
              </div>
              <div className="p-2 w-24">
                {stakeAccount.total_amount.toFixed(2)}
              </div>
              <div className="p-2 w-24">{`$${(
                stakeAccount.total_amount * solPrice
              ).toFixed(2)}`}</div>
              <div className="p-2 w-24">
                {stakeAccount.active_amount.toFixed(2)}
              </div>
              <div className="p-2 w-24">{stakeAccount.state}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StakedAccountTable;
