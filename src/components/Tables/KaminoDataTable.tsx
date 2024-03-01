import React from 'react';

function KaminoDataTable({ datas }: { datas: any }) {
  //console.log('kamino data', datas.KaminoData);
  return (
    <div className="overflow-x-auto">
      <div className="border border-neutral-800 rounded-lg  ">
        <div className="grid grid-cols-6 text-md text-left p-2">
          <div className="p-2 col-span-2 ">Token</div>
          <div className="p-2 col-span-2 ">Total Staked Amount</div>
          <div className="p-2">Num of Reward Tokens</div>
          <div className="p-2">Num of Users</div>
        </div>
        <div className="border-t border-neutral-800 p-2">
          {/* Iterate over KaminoData and render each data */}
          {datas.KaminoData.filter(
            (data: any) => !data.FarmState.token.mint.includes('11111111111111')
          ).map((data: any, index: any) => (
            <div
              key={index}
              className="grid grid-cols-6 text-sm">
              <div className="p-2 text-blue-300 col-span-2">
                <a
                  href={`https://solscan.io/account/${data.FarmState.token.mint}`}>
                  {`${data.FarmState.token.mint.toString().slice(0, 12)}...`}
                </a>
              </div>
              <div className="p-2 col-span-2">
                {data.FarmState.totalStakedAmount.toString().slice(0, 12)}
              </div>
              <div className="p-2">{data.FarmState.numRewardTokens}</div>
              <div className="p-2">{data.FarmState.numUsers}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KaminoDataTable;
