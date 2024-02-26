import React from 'react';

function KaminoLendingObligationTable({ datas }: { datas: any }) {
  return (
    <div className="overflow-x-auto">
      {datas.KaminoLendingObligation.map((data: any, index: any) => (
        <div
          className="border border-neutral-800 rounded-lg  "
          key={index}>
          <div className=" p-2 ">
            Lending market:{' '}
            <a
              className=" text-blue-400 "
              href={`https://solscan.io/account/${data.lendingMarket}`}>
              {`${data.lendingMarket}`}
            </a>
          </div>
          <div className="grid grid-cols-6 text-md text-left px-2  border-t border-neutral-800 ">
            <div className="p-2 col-span-4 ">Deposit Reserve</div>
            <div className="p-2  ">Deposited Amount</div>
          </div>
          <div className="border-t border-neutral-800 p-2">
            {data.deposits.map((deposit: any, index: any) => (
              <div
                key={index}
                className="grid grid-cols-6 text-sm  ">
                <div className="p-2 text-blue-300 col-span-4 ">
                  <a
                    href={`https://solscan.io/account/${deposit.depositReserve}`}>
                    {`${deposit.depositReserve.toString().slice(0, 30)}...`}
                  </a>
                </div>
                <div className="p-2  ">
                  {deposit.depositedAmount.toString().slice(0, 12)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KaminoLendingObligationTable;
