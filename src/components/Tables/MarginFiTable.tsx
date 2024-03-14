import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { FaChevronUp } from 'react-icons/fa6';

function MarginFiTable({ datas }: { datas: any }) {
  const { isDarkMode } = useTheme();
  return (
    <div className="overflow-x-auto">
      {datas.MarginFiData.filter(
        (data: any) =>
          data.totalBorrowsUsdValue !== 0 || data.totalDepositsUsdValue !== 0
      ).map((data: any, index: any) => (
        <div
          key={index}
          className="mb-4">
          <div
            className={`w-full justify-evenly flex flex-row text-md border mb-4 ${
              isDarkMode ? 'border-neutral-800' : 'text-black'
            } rounded-lg   `}>
            <Disclosure
              as="div"
              className={`w-full flex flex-col justify-center border-r ${
                isDarkMode ? 'border-neutral-800' : ''
              } `}>
              <Disclosure.Button>
                {({ open }) => (
                  <div className="p-2 flex flex-row justify-center ">
                    <div className="flex flex-col  ">
                      Total Borrowed
                      <h1 className=" font-semibold text-[1.875rem] ">
                        ${Math.floor(data.totalBorrowsUsdValue)}
                      </h1>
                    </div>
                    <FaChevronUp
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 ml-2 `}
                    />
                  </div>
                )}
              </Disclosure.Button>

              <Disclosure.Panel>
                {data.positions.borrows.map((borrow: any, index: any) => (
                  <div
                    key={index}
                    className=" mx-6 my-2 flex flex-row items-center justify-between ">
                    <div>
                      token:{' '}
                      <span className=" font-bold ">{borrow.tokenSymbol}</span>
                    </div>
                    <div>
                      Amount:{' '}
                      <span className=" font-bold ">
                        ${Math.floor(borrow.usdValue)}
                      </span>
                    </div>
                  </div>
                ))}
              </Disclosure.Panel>
            </Disclosure>
            <Disclosure
              as="div"
              className=" w-full flex flex-col justify-center ">
              <Disclosure.Button>
                {({ open }) => (
                  <div className="p-2 flex flex-row justify-center ">
                    <div className="flex flex-col  ">
                      Total Deposited
                      <h1 className=" font-semibold text-[1.875rem] ">
                        ${Math.floor(data.totalDepositsUsdValue)}
                      </h1>
                    </div>
                    <FaChevronUp
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 ml-2 `}
                    />
                  </div>
                )}
              </Disclosure.Button>
              <Disclosure.Panel>
                {data.positions.deposits.map((deposit: any, index: any) => (
                  <div
                    key={index}
                    className=" mx-6 my-2 flex flex-row items-center justify-between ">
                    <div>
                      token:{' '}
                      <span className=" font-bold ">{deposit.tokenSymbol}</span>
                    </div>
                    <div>
                      Amount:{' '}
                      <span className=" font-bold ">
                        ${Math.floor(deposit.usdValue)}
                      </span>
                    </div>
                  </div>
                ))}
              </Disclosure.Panel>
            </Disclosure>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MarginFiTable;
