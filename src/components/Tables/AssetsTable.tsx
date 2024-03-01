import Image from 'next/image';
import React from 'react';

function AssetsTable({ datas }: { datas: any }) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-x-auto ">
      <div className="grid grid-flow-col auto-cols-auto  text-md text-center ">
        <div className="p-2 w-24">Asset</div>
        <div className="p-2 w-24">Token Name</div>
        <div className="p-2 w-24">Current Price</div>
        <div className="p-2 w-24">Balance</div>
        <div className="p-2 w-24">Current Value</div>
        {/* <div className="p-2 w-24">Unrealized gain</div>
        <div className="p-2 w-24">Avg Cost price</div>
        <div className="p-2 w-24">Cost basis</div>
        <div className="p-2 w-24">Return</div> */}
      </div>
      <div className="border-t border-neutral-800 ">
        {datas.Assets
          //.slice(0, 10)
          .filter((token: any) => token.balance !== 0)
          .map((token: any, index: number) => (
            <div
              key={index}
              className="grid grid-flow-col auto-cols-auto  text-sm text-center ">
              {/* Adjusted width for the image column */}
              <div className="p-2  w-24 flex items-center justify-center">
                <Image
                  loader={({ src }) => src}
                  src={token.info.image}
                  alt=""
                  width={30}
                  height={30}
                  className="rounded-md"
                />
              </div>
              <div className="p-2 w-24 ">{token.info.name}</div>
              <div className="p-2 w-24">
                {token.currentPrice ? `$${token.currentPrice.toFixed(2)}` : '-'}
              </div>
              <div className="p-2 w-24">{token.balance.toFixed(2)}</div>
              <div className="p-2 w-24">
                {token.currentPrice && token.balance
                  ? `$${(token.currentPrice * token.balance).toFixed(2)}`
                  : '-'}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AssetsTable;
