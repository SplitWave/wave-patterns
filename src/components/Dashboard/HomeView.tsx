import React, { useEffect, useState } from 'react';
import { Tab, Menu } from '@headlessui/react';
import { classNames } from './Dashboard';
import { fetchAllTokensBalance, getMultipleTokenPrice } from '@/utils/helpers';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';
import { useWallet } from '@/context/WalletContext';
import { BeatLoader } from 'react-spinners';

function HomeView() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPubKey, setShowPubKey] = useState<boolean>(false);
  const { walletAddress } = useWallet();
  let [categories, setCategories] = useState<any>({
    Assets: [],
    Analytics: [],
    Notifications: [],
  });

  const fetchData = async () => {
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

        //console.log('token prices', tokenPrices);

        // Merge token balances with prices
        const assetsWithPrices = tokenBalances.map((token: any) => {
          // Find the price corresponding to the token address
          const tokenPriceInfo = tokenPrices[token.address];

          // Extract the price value from the token price info
          const tokenPrice = tokenPriceInfo ? tokenPriceInfo.value : null;

          return {
            ...token,
            price: tokenPrice,
            // Update other properties as needed
          };
        });

        setCategories((prevCategories: any) => ({
          ...prevCategories,
          Assets: assetsWithPrices,
        }));
        setIsLoading(false);
      } else {
        console.error(
          'Error fetching token balances:',
          tokenBalanceResponse.message
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching token balances:', error);
      setIsLoading(false);
    }
  };

  // async function fetchBorrowingUserMetadata() {
  //   const publicKey = '7Bi8CQX7sV2wWSP4wCeE2rpHD8PdcQ3L99N8J2sKGSRT'; // Example publicKey
  //   try {
  //     const metadata = await getFarmsUserState(publicKey);
  //     console.log('farm User state:', metadata);
  //   } catch (error) {
  //     console.error('Error fetching farm user state:', error);
  //   }
  // }

  useEffect(() => {
    //fetchBorrowingUserMetadata();
    fetchData();
  }, [walletAddress]);

  //console.log('Assets:', categories.Assets);

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
      <Tab.Group
        className="w-full h-full"
        as="div">
        <Tab.List className="flex  p-1 lg:w-1/3  bg-white/[0.12] rounded-md ">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100',
                  'focus:outline-none',
                  selected
                    ? 'bg-black  shadow'
                    : 'text-blue-100  hover:text-white'
                )
              }>
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {Object.keys(categories).map((category, idx) => (
            <div key={idx}>
              {category === 'Assets' && (
                <Tab.Panel className=" flex flex-row justify-between space-x-6 ">
                  {/**Assets Box */}
                  <div className="focus:outline-none mt-4 p-4 border border-neutral-800 rounded-lg lg:w-2/4 ">
                    {isLoading ? (
                      <div className="w-full h-full flex justify-center items-center ">
                        <BeatLoader color="white" />
                      </div>
                    ) : (
                      <div className=" ">
                        {categories[category].length > 0 ? (
                          <>
                            <div className="overflow-x-auto">
                              <div className="border border-neutral-800 rounded-lg">
                                <div className="grid grid-cols-6 text-md text-left">
                                  <div className="p-2">Asset</div>
                                  <div className="p-2 col-span-2">
                                    Token Name
                                  </div>
                                  <div className="p-2">Current Price</div>
                                  <div className="p-2">Balance</div>
                                </div>
                                <div className="border-t border-neutral-800">
                                  {categories[category]
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
                                        <div className="p-2 col-span-2 ">
                                          {token.info.name}
                                        </div>
                                        <div className="p-2">
                                          {token.price
                                            ? `$${token.price
                                                .toString()
                                                .substring(0, 6)}`
                                            : '-'}
                                        </div>
                                        <div className="p-2">
                                          {token.balance
                                            .toString()
                                            .substring(0, 6)}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p>No {category} found</p>
                        )}
                      </div>
                    )}
                  </div>
                  {/**Assets Box */}
                  {/**Staked info Box */}
                  <div className="focus:outline-none mt-4 p-4 border border-neutral-800 rounded-lg lg:w-2/4  ">
                    {isLoading ? (
                      <div className="w-full h-full flex justify-center items-center ">
                        <BeatLoader color="white" />
                      </div>
                    ) : (
                      <div>
                        {categories[category].length > 0 ? (
                          <></>
                        ) : (
                          <p>No {category} found</p>
                        )}
                      </div>
                    )}
                  </div>
                  {/**Staked info Box */}
                </Tab.Panel>
              )}
            </div>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default HomeView;
