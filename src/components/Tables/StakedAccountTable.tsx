import React from 'react';

function StakedAccountTable({ datas }: { datas: any }) {
  return (
    <div className="overflow-x-auto">
      <div className="border border-neutral-800 rounded-lg  ">
        <div className="grid grid-cols-6 text-md text-left p-2">
          <div className="p-2 col-span-2 ">Stake Account</div>
          <div className="p-2 col-span-2 ">Total Amount (SOL)</div>
          <div className="p-2">Status</div>
          <div className="p-2">Active Stake (SOL)</div>
        </div>
        <div className="border-t border-neutral-800 p-2">
          {/* Iterate over StakedAccounts and render each stake account */}
          {datas.StakedAccounts.map((stakeAccount: any, index: any) => (
            <div
              key={index}
              className="grid grid-cols-6 text-sm  ">
              <div className="p-2 text-blue-300 col-span-2 ">
                <a
                  href={`https://solscan.io/account/${stakeAccount.stake_account_address}`}>
                  {`${stakeAccount.stake_account_address
                    .toString()
                    .slice(0, 12)}...`}
                </a>
              </div>
              <div className="p-2 col-span-2 ">
                {stakeAccount.total_amount.toString().slice(0, 12)}
              </div>
              <div className="p-2">{stakeAccount.state}</div>
              <div className="p-2">
                {stakeAccount.active_amount.toString().slice(0, 8)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StakedAccountTable;
