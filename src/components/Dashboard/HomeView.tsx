import React, { useEffect, useState } from 'react';
import { Tab, Menu } from '@headlessui/react';
import { classNames } from './Dashboard';
import {
  AllTokensBalanceResponse,
  fetchAllTokensBalance,
  getFarmsUserState,
} from '@/utils/helpers';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';

function HomeView() {
  const [showPubKey, setShowPubKey] = useState<boolean>(false);
  const [examplePubKey, setExamplePubKey] = useState<string>(
    'E6HqfDLnE8Jk1BtGWFRWj8TsrceCJhkQoCcFmqZRmtAV'
  );
  let [categories, setCategories] = useState<any>({
    Assets: [],
    Analytics: [],
    Notifications: [],
  });

  const fetchData = async () => {
    try {
      const response: any = await fetchAllTokensBalance(
        'E6HqfDLnE8Jk1BtGWFRWj8TsrceCJhkQoCcFmqZRmtAV'
      ); // Fetch token balances
      if (response.success) {
        // If the response is successful, update the state
        setCategories((prevCategories: any) => ({
          ...prevCategories,
          Assets: response.result, // Update the Assets array with token balances
        }));
      } else {
        console.error('Error fetching token balances:', response.message);
      }
    } catch (error) {
      console.error('Error fetching token balances:', error);
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
  }, []);

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
              {showPubKey ? examplePubKey.slice(0, 5) : '*********'}
            </h1>
          </Menu.Button>
          <Menu.Items className=" pl-4 rounded-md bg-white/[0.12] w-2/5 p-1 text-sm font-medium ">
            <Menu.Item>
              {({ active }) => (
                <p>
                  {showPubKey
                    ? examplePubKey
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
        <Tab.Panels className="mt-4 p-4 border border-neutral-800 rounded-lg w-full ">
          {Object.keys(categories).map((category, idx) => (
            <Tab.Panel
              key={idx}
              className="focus:outline-none  ">
              {categories[category].length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="border border-neutral-800 rounded-lg">
                    <div className="grid grid-cols-9 text-md text-left">
                      <div className="p-2">Asset</div>
                      <div className="p-2 col-span-2">Token Name</div>
                      <div className="p-2">Symbol</div>
                      <div className="p-2">Balance</div>
                      <div className="p-2 col-span-3">
                        Associated Account
                      </div>{' '}
                      {/* Adjusted column span */}
                    </div>
                    <div className="border-t border-neutral-800">
                      {categories[category]
                        .slice(0, 7)
                        .map((token: any, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-9 text-sm">
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
                            <div className="p-2">{token.info.symbol}</div>
                            <div className="p-2">{token.balance}</div>
                            <div className="p-2 col-span-3 font-medium">
                              {' '}
                              {/* Adjusted column span */}
                              {token.associated_account}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p>No {category} found</p>
              )}
              <div className=" text-center text-sm mt-2 ">
                Click here to see more
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default HomeView;
