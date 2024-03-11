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
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';
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
    KaminoData: [],
    KaminoLendingObligation: [],
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

  async function fetchFarmUserState() {
    try {
      const farm_user_state = await getFarmsUserState(walletAddress);
      // Update the state with Kamino  data
      setDatas((prevDatas: any) => ({
        ...prevDatas,
        KaminoData: farm_user_state,
      }));
      //console.log('farm User state:', farm_user_state);
    } catch (error) {
      console.error('Error fetching farm user state:', error);
    }
  }

  async function fetchLendingObligation() {
    try {
      const lendingObligation = await getLendingObligation(walletAddress);
      // Update the state with lending obligation  data
      setDatas((prevDatas: any) => ({
        ...prevDatas,
        KaminoLendingObligation: lendingObligation,
      }));
      //console.log('lending obligation:', lendingObligation);
    } catch (error) {
      console.error('Error fetching farm user state:', error);
    }
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

  useEffect(() => {
    fetchAssets();
    fetchStakeAccounts();
    fetchKaminoPoints();
    fetchFarmUserState();
    fetchLendingObligation();
    // fetchTransaction(
    //   '4T2FJdnmfgykZgi4Noqb3DywGzjrwJsfRGCDzTNcJq2f',
    //   //'E5aGXX2oX8mJ7sqRe3ncRHuJo1tzqYNmeKM4oQLk11w6',
    //   walletAddress
    // );
    //getParsedTransactionHistory('4T2FJdnmfgykZgi4Noqb3DywGzjrwJsfRGCDzTNcJq2f');
  }, [walletAddress]);

  //console.log('data :', topFiveAssets);

  return (
    <div className=" w-full  lg:p-10  ">
      <div className={` w-full h-5 mb-2 ${isDarkMode ? '' : 'text-black'} `}>
        <Menu>
          <Menu.Button
            className=" ml-5 flex flex-row items-center "
            as="div">
            {showPubKey ? (
              <FiEye
                onClick={() => {
                  setShowPubKey(!showPubKey);
                }}
              />
            ) : (
              <FiEyeOff
                onClick={() => {
                  setShowPubKey(!showPubKey);
                }}
              />
            )}
            <h1
              className={` text-sm font-medium ml-2 ${
                isDarkMode ? 'text-gray-200' : ''
              } `}>
              {showPubKey ? walletAddress.slice(0, 5) : '*********'}
            </h1>
          </Menu.Button>
          <Menu.Items className=" pl-4 rounded-md bg-white/[0.12] w-2/5 p-1 text-sm font-medium ">
            <Menu.Item>
              {({ active }) => (
                <p>
                  {showPubKey
                    ? walletAddress
                    : '*************************************************'}
                </p>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
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
                            <BeatLoader color="white" />
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
                            <BeatLoader color="white" />
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
                      <BeatLoader color="white" />
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
        {/**Kamino */}
        <div
          className={`focus:outline-none mt-4 p-4 border ${
            isDarkMode ? 'border-neutral-800 bg-white/[0.12] ' : 'bg-white'
          } rounded-lg  `}>
          <div className=" mb-5 ">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center ">
                <BeatLoader color="white" />
              </div>
            ) : (
              <div className=" ">
                {datas.KaminoPoints &&
                Object.keys(datas.KaminoPoints).length > 0 ? (
                  <KaminoPointsTable datas={datas} />
                ) : (
                  <p></p>
                )}
              </div>
            )}
          </div>
          <Tab.Group
            as="div"
            className="w-full">
            <Tab.List className=" flex  p-1 w-full justify-between mb-2 bg-white/[0.12] rounded-md  ">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100',
                    'focus:outline-none',
                    selected
                      ? 'bg-black  shadow'
                      : 'text-blue-100  hover:text-white'
                  )
                }>
                Kamino Lend | Borrow
              </Tab>

              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100',
                    'focus:outline-none',
                    selected
                      ? 'bg-black  shadow'
                      : 'text-blue-100  hover:text-white'
                  )
                }>
                Kamino Liquidity
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
            <Tab.Panels className="mt-4 ">
              <Tab.Panel>
                {isLoading ? (
                  <div className="w-full h-full flex justify-center items-center ">
                    <BeatLoader color="white" />
                  </div>
                ) : (
                  <div>
                    {datas.KaminoLendingObligation.length > 0 ? (
                      <KaminoLendingObligationTable datas={datas} />
                    ) : (
                      <p>No data found</p>
                    )}
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel>
                {isLoading ? (
                  <div className="w-full h-full flex justify-center items-center ">
                    <BeatLoader color="white" />
                  </div>
                ) : (
                  <div>
                    {datas.KaminoData.length > 0 ? (
                      <KaminoDataTable datas={datas} />
                    ) : (
                      <p>No data found</p>
                    )}
                  </div>
                )}
              </Tab.Panel>
              {/* <Tab.Panel>
                {isLoading ? (
                  <div className="w-full h-full flex justify-center items-center ">
                    <BeatLoader color="white" />
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
