import React, { useContext, useEffect, useState } from 'react';
import { Tab, Menu } from '@headlessui/react';
import { classNames } from './Dashboard';
import {
  KaminoPoints,
  fetchAllTokensBalance,
  getDateTokenWasRecievedInWallet,
  getFarmsUserState,
  getHistoricalTokenPrice,
  getKaminoPoints,
  getLendingObligation,
  getMultipleTokenPrice,
  getParsedTransactionHistory,
  getStakeAccounts,
} from '@/utils/helpers';

import { useWallet } from '@/context/WalletContext';
import { BeatLoader } from 'react-spinners';
import AssetsTable from '../Tables/AssetsTable';
import StakedAccountTable from '../Tables/StakedAccountTable';
import KaminoPointsTable from '../Tables/KaminoPointsTable';
import KaminoDataTable from '../Tables/KaminoDataTable';
import KaminoLendingObligationTable from '../Tables/KaminoLendingObligationTable';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';
import { useDataContext } from '@/context/DataContext';
import PublicKeyBar from './PublicKeyBar';
import { fetchMarginfiData } from '@/utils/marginfi';
import MarginFiTable from '../Tables/MarginFiTable';
import { getAllYourObligations } from '@/utils/kamino';

function HomeView() {
  const { setData } = useDataContext();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPubKey, setShowPubKey] = useState<boolean>(false);
  const { walletAddress } = useWallet();
  let [datas, setDatas] = useState<any>({
    Assets: [],
    StakedAccounts: [],
    KaminoPoints: [],
    KaminoBorrows: [],
    KaminoDeposits: [],
    MarginFiData: [],
  });
  const [topFiveAssets, setTopFiveAssets] = useState<any[]>([]);

  // Define a function to calculate the product of token.currentPrice * token.balance
  const calculateTokenCurrentValue = (token: any) => {
    const tokenCurrentPrice = token.currentPrice || 0;
    return tokenCurrentPrice * token.balance;
  };

  // Update the state and compute the top five assets separately
  const updateStateAndTopFiveAssets = (assetsWithPrices: any) => {
    // Set the state with all assets
    setDatas((prevDatas: any) => ({
      ...prevDatas,
      Assets: assetsWithPrices,
    }));

    // Sort assets based on calculated product in descending order
    const sortedAssets = [...assetsWithPrices].sort((a, b) => {
      return calculateTokenCurrentValue(b) - calculateTokenCurrentValue(a);
    });

    // Take the first five assets
    const topFiveAssets = sortedAssets.slice(0, 5);

    setData(sortedAssets);

    // Return the top five assets
    return topFiveAssets;
  };

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const tokenBalanceResponse: any = await fetchAllTokensBalance(
        walletAddress
      );

      if (tokenBalanceResponse.success) {
        const tokenBalances = tokenBalanceResponse.result;
        const tokenAddresses = tokenBalances.map((token: any) => token.address);

        // Fetch prices for multiple tokens
        const tokenPricesResponse: any = await getMultipleTokenPrice(
          tokenAddresses
        );

        // Extract the data object from the response
        const tokenPrices = tokenPricesResponse.data;

        // Fetch historical prices for each token
        const assetsWithPrices: any[] = [];

        for (const token of tokenBalances) {
          // Find the price corresponding to the token address
          const tokenPriceInfo = tokenPrices[token.address];

          // Extract the current price value from the token price info
          const tokenCurrentPrice = tokenPriceInfo
            ? tokenPriceInfo.value
            : null;

          const tokenWithPrices = {
            ...token,
            currentPrice: tokenCurrentPrice,
          };

          assetsWithPrices.push(tokenWithPrices);
        }
        // Update state and get top five assets
        const topFiveAssets = updateStateAndTopFiveAssets(assetsWithPrices);
        setDatas((prevDatas: any) => ({
          ...prevDatas,
          Assets: assetsWithPrices,
        }));

        // Set the state with the top five assets
        setTopFiveAssets(topFiveAssets);

        setIsLoading(false);
      } else {
        console.error(
          'Error fetching token balances:1',
          tokenBalanceResponse.message
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching token balances:2', error);
      setIsLoading(false);
    }
  };

  const fetchStakeAccounts = async () => {
    setIsLoading(true);
    try {
      const response: any = await getStakeAccounts(
        // 'CCoSKkgPWC1CSBki4LM9cCp9hM9zURQyfgY6h3UtNitR',
        walletAddress,
        4,
        5
      );
      if (response.success) {
        setDatas((prevState: any) => ({
          ...prevState,
          StakedAccounts: response.result.data,
        }));
      } else {
        console.error('Error fetching stake accounts:', response.message);
      }
    } catch (error) {
      console.error('Error fetching stake accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKaminoPoints = async () => {
    try {
      // Fetch Kamino points data
      const kaminoPointsData: KaminoPoints = await getKaminoPoints(
        walletAddress
      );

      // Update the state with Kamino points data
      setDatas((prevDatas: any) => ({
        ...prevDatas,
        KaminoPoints: kaminoPointsData,
      }));
    } catch (error) {
      console.error('Error fetching Kamino points:', error);
    }
  };

  async function fetchKaminoData() {
    const result = await getAllYourObligations(
      walletAddress
      //'HNqJtqudHDWiWHWg3RH7FPamf8dyXjFwJVPmfRDMDyjE'
    );

    if (!result) {
      console.error('Error: No data returned.');
      return;
    }

    const { depositedAssets, borrowedAssets } = result;
    // Update the state with Kamino points data
    setDatas((prevDatas: any) => ({
      ...prevDatas,
      KaminoBorrows: borrowedAssets,
      KaminoDeposits: depositedAssets,
    }));
  }

  async function fetchTransaction(tokenAddress: string, walletAddress: string) {
    const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables.');
    }
    const url = `https://api.helius.xyz/v0/addresses/${tokenAddress}/transactions?api-key=${apiKey}&limit=100`;

    try {
      const response = await axios.get(url);
      // Handle the response
      //console.log('response is', response.data);

      // Check if response data is empty
      if (response.data.length === 0) {
        console.log('No transactions found.');
        return []; // Return empty array
      }

      // Define patterns for matching transaction descriptions
      const transferredPattern = /transferred (\d+(\.\d+)?) (\w+) to (\w+)/i;
      const swappedPattern =
        /swapped (\d+(\.\d+)?) (\w+) for (\d+(\.\d+)?) (\w+)/i;

      // Filter transactions based on type and description pattern
      const filteredTransactions = response.data.filter((transaction: any) => {
        const type = transaction.type;
        const description = transaction.description;

        // Check if the type is either "SWAP" or "TRANSFER"
        return (
          (type === 'SWAP' || type === 'TRANSFER') &&
          (transferredPattern.test(description) ||
            swappedPattern.test(description))
        );
      });

      console.log('filtered descriptions', filteredTransactions);

      // Extract timestamp and amount transferred
      const transactionsData = filteredTransactions.map((transaction: any) => {
        const type = transaction.type;
        const description = transaction.description;

        let amountTransferred: number | undefined;
        if (transferredPattern.test(description)) {
          // Extract amount transferred in a transfer
          const [, amount, , asset, recipient] =
            description.match(transferredPattern)!;
          amountTransferred = parseFloat(amount);
        } else if (swappedPattern.test(description)) {
          // Extract amount transferred in a swap
          const [, amount, , asset] = description.match(swappedPattern)!;
          amountTransferred = parseFloat(amount);
        }

        return {
          timestamp: transaction.timestamp,
          amountTransferred: amountTransferred,
        };
      });
      //console.log('transactionsData', transactionsData);
      return transactionsData;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchMarginFiData() {
    try {
      const { userAccountsShaped } = await fetchMarginfiData(
        walletAddress
        //'2ZJz3sKxpUNrTcAdSbeR1HqXCutdCvT9Jd2hpVMK5jMU'
      );

      //console.log('useAccountsShaped', userAccountsShaped);
      setDatas((prevDatas: any) => ({
        ...prevDatas,
        MarginFiData: userAccountsShaped,
      }));
    } catch (error) {
      console.error('Error fetching marginfi data:', error);
    }
  }

  useEffect(() => {
    fetchAssets();
    fetchStakeAccounts();
    fetchKaminoPoints();
    fetchKaminoData();
    fetchMarginFiData();
  }, [walletAddress]);

  // console.log('data :', datas.KaminoBorrows);
  // console.log('data :', datas.KaminoDeposits);
  // 0: Object { amount: 8.79452111, tokenAddress: "So11111111111111111111111111111111111111112" }

  return (
    <div className=" w-full  lg:p-10  ">
      <PublicKeyBar
        walletAddress={walletAddress}
        showPubKey={showPubKey}
        setShowPubKey={setShowPubKey}
      />
      <div>
        {Object.keys(datas).map((data, idx) => (
          <div key={idx}>
            {data === 'Assets' && (
              <div className=" grid grid-cols-2  gap-7  ">
                {/**Assets Box */}
                <div
                  className={`focus:outline-none mt-4 p-4 border rounded-lg ${
                    isDarkMode
                      ? 'border-neutral-800 bg-white/[0.12]'
                      : 'bg-white text-black'
                  } `}>
                  <Tab.Group
                    as="div"
                    className="w-full">
                    <Tab.List
                      className={` flex  p-1 w-full justify-between mb-2 rounded-md ${
                        isDarkMode ? 'bg-white/[0.12]' : 'bg-gray-100'
                      } `}>
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-500 ${
                              isDarkMode && 'text-blue-100'
                            } ${!isDarkMode && 'text-black'} 
                            } `,
                            'focus:outline-none',
                            selected &&
                              isDarkMode &&
                              'bg-black  shadow text-white',

                            selected && !isDarkMode && 'bg-white text-gray-800'
                          )
                        }>
                        Assets
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-500 ${
                              isDarkMode && 'text-blue-100'
                            } ${!isDarkMode && 'text-black'} `,
                            'focus:outline-none',
                            selected &&
                              isDarkMode &&
                              'bg-black  shadow text-white',
                            selected && !isDarkMode && 'bg-white text-gray-800'
                          )
                        }>
                        Staked
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-4">
                      <Tab.Panel>
                        {isLoading ? (
                          <div className="w-full h-full flex justify-center items-center ">
                            <BeatLoader
                              color={isDarkMode ? 'white' : 'black'}
                            />
                          </div>
                        ) : (
                          <div className=" ">
                            {datas[data].length > 0 ? (
                              <AssetsTable
                                datas={datas}
                                topFiveAssets={topFiveAssets}
                              />
                            ) : (
                              <p>No {data} found</p>
                            )}
                          </div>
                        )}
                      </Tab.Panel>
                      <Tab.Panel>
                        {isLoading ? (
                          <div className="w-full h-full flex justify-center items-center ">
                            <BeatLoader
                              color={isDarkMode ? 'white' : 'black'}
                            />
                          </div>
                        ) : (
                          <div>
                            {datas.StakedAccounts.length > 0 ? (
                              <StakedAccountTable datas={datas} />
                            ) : (
                              <p>No stake accounts found</p>
                            )}
                          </div>
                        )}
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
                {/**Assets Box */}
                {/** */}
                <div className="focus:outline-none mt-4 p-4  w-full h-96 ">
                  {isLoading ? (
                    <div className="w-full h-full flex justify-center items-center ">
                      {/* <BeatLoader color="white" /> */}
                    </div>
                  ) : (
                    <div>{datas[data].length > 0 ? <></> : <p></p>}</div>
                  )}
                </div>
                {/** */}

                {/** */}
                {/* <div className="focus:outline-none mt-4 p-4 border border-neutral-800 rounded-lg  bg-white ">
                  {isLoading ? (
                    <div className="w-full h-full flex justify-center items-center ">
                    <BeatLoader
                              color={isDarkMode ? 'white' : 'black'}
                            />
                    </div>
                  ) : (
                    <div>
                      {datas[data].length > 0 ? <></> : <p>No {data} found</p>}
                    </div>
                  )}
                </div> */}
                {/** **/}
              </div>
            )}
          </div>
        ))}
        {/**marginFi */}
        <div
          className={`focus:outline-none mt-4 p-4 border ${
            isDarkMode
              ? 'border-neutral-800 bg-white/[0.12] '
              : 'bg-white text-black '
          } rounded-lg  `}>
          <h1 className=" ml-5  ">MarginFi</h1>
          <div className=" mb-5 ">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center ">
                <BeatLoader color={isDarkMode ? 'white' : 'black'} />
              </div>
            ) : (
              <div className="mt-2 ">
                {datas.MarginFiData &&
                Object.keys(datas.MarginFiData).length > 0 ? (
                  <MarginFiTable datas={datas} />
                ) : (
                  <p>No MarginFi data found</p>
                )}
              </div>
            )}
          </div>
        </div>
        {/**marginFi */}
        {/**Kamino */}
        <div
          className={`focus:outline-none mt-4 p-4 border ${
            isDarkMode ? 'border-neutral-800 bg-white/[0.12] ' : 'bg-white'
          } rounded-lg  `}>
          <div className=" mb-5 ">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center ">
                <BeatLoader color={isDarkMode ? 'white' : 'black'} />
              </div>
            ) : (
              <div className=" ">
                {datas.KaminoPoints &&
                Object.keys(datas.KaminoPoints).length > 0 ? (
                  <KaminoPointsTable datas={datas} />
                ) : (
                  <p>No Kamino points found</p>
                )}
              </div>
            )}
          </div>
          <Tab.Group
            as="div"
            className="w-full">
            <Tab.List
              className={` flex  p-1 w-full justify-between mb-2 rounded-md ${
                isDarkMode ? 'bg-white/[0.12]' : 'bg-gray-100'
              } `}>
              <Tab
                className={({ selected }) =>
                  classNames(
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-500 ${
                      isDarkMode && 'text-blue-100'
                    } ${!isDarkMode && 'text-black'} 
                  } `,
                    'focus:outline-none',
                    selected && isDarkMode && 'bg-black  shadow text-white',

                    selected && !isDarkMode && 'bg-white text-gray-800'
                  )
                }>
                Kamino Deposits
              </Tab>

              <Tab
                className={({ selected }) =>
                  classNames(
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-500 ${
                      isDarkMode && 'text-blue-100'
                    } ${!isDarkMode && 'text-black'} 
                  } `,
                    'focus:outline-none',
                    selected && isDarkMode && 'bg-black  shadow text-white',

                    selected && !isDarkMode && 'bg-white text-gray-800'
                  )
                }>
                Kamino Borrows
              </Tab>
              {/* <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100',
                    'focus:outline-none',
                    selected
                      ? 'bg-black  shadow'
                      : 'text-blue-100  hover:text-white'
                  )
                }>
                Points
              </Tab> */}
            </Tab.List>
            <Tab.Panels
              className={`mt-4 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              } `}>
              <Tab.Panel>
                {isLoading ? (
                  <div className="w-full h-full flex justify-center items-center ">
                    <BeatLoader color={isDarkMode ? 'white' : 'black'} />
                  </div>
                ) : (
                  <div>
                    {datas.KaminoDeposits.length > 0 ? (
                      <KaminoDataTable datas={datas.KaminoDeposits} />
                    ) : (
                      <p className=" text-center ">No data found</p>
                    )}
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel>
                {isLoading ? (
                  <div className="w-full h-full flex justify-center items-center ">
                    <BeatLoader color={isDarkMode ? 'white' : 'black'} />
                  </div>
                ) : (
                  <div>
                    {datas.KaminoBorrows.length > 0 ? (
                      <KaminoDataTable datas={datas.KaminoBorrows} />
                    ) : (
                      <p className=" text-center ">No data found</p>
                    )}
                  </div>
                )}
              </Tab.Panel>
              {/* <Tab.Panel>
                {isLoading ? (
                  <div className="w-full h-full flex justify-center items-center ">
                  <BeatLoader
                              color={isDarkMode ? 'white' : 'black'}
                            />
                  </div>
                ) : (
                  <div className=" ">
                    {datas.KaminoPoints &&
                    Object.keys(datas.KaminoPoints).length > 0 ? (
                      <KaminoPointsTable datas={datas} />
                    ) : (
                      <p>No points found</p>
                    )}
                  </div>
                )}
              </Tab.Panel> */}
            </Tab.Panels>
          </Tab.Group>
        </div>
        {/**Kamino **/}
      </div>
    </div>
  );
}

export default HomeView;
