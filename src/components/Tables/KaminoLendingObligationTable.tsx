import React from 'react';
import { Disclosure } from '@headlessui/react';
import { FaChevronUp } from 'react-icons/fa6';

function KaminoLendingObligationTable({ datas }: { datas: any }) {
  //console.log('lending', datas.KaminoLendingObligation);
  return (
    <div className="overflow-x-auto">
      {datas.KaminoLendingObligation.map((data: any, index: any) => (
        <Disclosure
          as="div"
          className="border border-neutral-800 rounded-lg  "
          key={index}>
          {({ open }) => (
            <>
              <Disclosure.Button className=" flex flex-row w-full justify-between items-center pr-10 ">
                <div className=" px-10 py-5 ">
                  Lending market:{' '}
                  <a
                    className=" text-blue-400 "
                    href={`https://solscan.io/account/${data.lendingMarket}`}>
                    {`${data.lendingMarket}`}
                  </a>
                </div>
                <FaChevronUp
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `}
                />
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-6 text-md text-left px-2  border-t border-neutral-800 ">
                  <div className="p-2 col-span-4 ">Deposit Reserve</div>
                  <div className="p-2  ">Deposited Amount</div>
                </div>
                <div className="border-t border-neutral-800 p-2">
                  {data.deposits
                    .filter(
                      (deposit: any) => Number(deposit.depositedAmount) !== 0
                    )
                    .map((deposit: any, index: any) => (
                      <div
                        key={index}
                        className="grid grid-cols-6 text-sm">
                        <div className="p-2 text-blue-300 col-span-4">
                          <a
                            href={`https://solscan.io/account/${deposit.depositReserve}`}>
                            {`${deposit.depositReserve
                              .toString()
                              .slice(0, 30)}...`}
                          </a>
                        </div>
                        <div className="p-2">
                          {deposit.depositedAmount.toString().slice(0, 12)}
                        </div>
                      </div>
                    ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}

export default KaminoLendingObligationTable;
