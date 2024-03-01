import React, { useEffect, useState } from 'react';
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

function HomeView() {
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

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const tokenBalanceResponse: any = await fetchAllTokensBalance(
        walletAddress
      );

      // console.log(
      //   'token balance response',
      //   tokenBalanceResponse.result[0].associated_account
      // );

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

          // Fetch transactions data for the token
          // const transactionsData = await fetchTransaction(
          //   token.associated_account,
          //   walletAddress
          // );

          // // Process transactions data
          // const tokenData: any[] = [];

          // for (const transaction of transactionsData) {
          //   const { timestamp, amountTransferred } = transaction;

          //   // Fetch historical prices for the timestamp
          //   const historicalPrices: any = await getHistoricalTokenPrice(
          //     token.address,
          //     timestamp * 1000,
          //     Math.floor(Date.now() / 1000)
          //   );

          //   // Store the necessary information
          //   const tokenInfo = {
          //     timestamp: timestamp,
          //     amountTransferred: amountTransferred,
          //     historicalPrices: historicalPrices.data, // Assuming this returns the price history
          //   };

          //   tokenData.push(tokenInfo);
          // }

          const tokenWithPrices = {
            ...token,
            currentPrice: tokenCurrentPrice,
            //tokenData: tokenData,
          };

          assetsWithPrices.push(tokenWithPrices);
        }

        setDatas((prevDatas: any) => ({
          ...prevDatas,
          Assets: assetsWithPrices,
        }));
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
      const filteredTransactions = response.data.filter((transaction: any) => {
        // Access the type property of each transaction object
        const type = transaction.type;

        // Check if the type is either "SWAP" or "TRANSFER"
        return type === 'SWAP' || type === 'TRANSFER';
      });

      console.log('filtered descriptions', filteredTransactions);

      // Extract timestamp and amount transferred
      const transactionsData = filteredTransactions.map((transaction: any) => {
        // Find the relevant tokenBalanceChanges object
        const tokenBalanceChange = transaction.accountData.find(
          (data: any) => data.tokenBalanceChanges.length > 0
        );

        //console.log('token balance', tokenBalanceChange);
        // Extract tokenAmount and decimals
        const { tokenAmount, decimals } =
          tokenBalanceChange.tokenBalanceChanges[0].rawTokenAmount;

        // Convert tokenAmount to a number and calculate the actual value
        let tokenAmountNumber = parseFloat(tokenAmount.replace(/,/g, ''));
        if (tokenAmountNumber < 0) {
          tokenAmountNumber *= -1; // Convert negative numbers to positive
        }
        const actualValue = tokenAmountNumber / Math.pow(10, decimals);

        return {
          timestamp: transaction.timestamp,
          amountTransferred: actualValue,
        };
      });
      //console.log('transactionsData', transactionsData);
      return transactionsData;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // const url = 'https://rest-api.hellomoon.io/v0/defi/staking/accounts';

  // async function getAccounts() {
  //   const { data } = await axios.post(
  //     url,
  //     {
  //       stakeAuthority: 'so1b2w9fpMdqgzHR2UvW4iqkkc8nig6xTeBjU5HMbjG',
  //     },
  //     {
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer 581e79dc-5d3e-4404-8506-bee66e08eaf0',
  //       },
  //     }
  //   );

  //   console.log('data is', data);
  // }

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
    //getAccounts();
  }, [walletAddress]);

  //console.log('data :', datas.KaminoPoints);

  return (
    <div className=" w-full  lg:p-10  ">
      <div className=" w-full h-5 mb-10 ">
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
            <h1 className=" text-gray-200 text-sm font-medium ml-2 ">
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
                <div className="focus:outline-none mt-4 p-4 border border-neutral-800 rounded-lg   ">
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
                        Assets
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
                              <AssetsTable datas={datas} />
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
        <div className="focus:outline-none mt-4 p-4 border border-neutral-800 rounded-lg  ">
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
