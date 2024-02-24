import Image from 'next/image';
import React from 'react';

function AssetsTable({ datas }: { datas: any }) {
  return (
    <div className="overflow-x-auto">
      <div className="border border-neutral-800 rounded-lg">
        <div className="grid grid-cols-6 text-md text-left">
          <div className="p-2">Asset</div>
          <div className="p-2 col-span-2">Token Name</div>
          <div className="p-2">Current Price</div>
          <div className="p-2">Balance</div>
          <div className="p-2">Current Value</div>
        </div>
        <div className="border-t border-neutral-800">
          {datas.Assets
            //.slice(0, 10)
            .filter((token: any) => token.balance !== 0)
            .map((token: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-6 text-sm">
                {/* Adjusted width for the image column */}
                <div className="p-2">
                  <Image
                    loader={({ src }) => src}
                    src={token.info.image}
                    alt=""
                    width={30}
                    height={30}
                    className="rounded-md"
                  />
                </div>
                <div className="p-2 col-span-2 ">{token.info.name}</div>
                <div className="p-2">
                  {token.price ? `$${token.price.toFixed(2)}` : '-'}
                </div>
                <div className="p-2">
                  {token.balance.toString().substring(0, 8)}
                </div>
                <div className="p-2">
                  {token.price && token.balance
                    ? `$${(token.price * token.balance).toFixed(2)}`
                    : '-'}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AssetsTable;
