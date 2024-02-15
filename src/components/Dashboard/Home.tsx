import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { classNames } from './Dashboard';
import {
  getBorrowingUserMetadata,
  getLendingObligation,
} from '@/utils/helpers';

function Home() {
  let [categories] = useState({
    Overview: [],
    Analytics: [],
    Notifications: [],
  });
  const [lendingObligations, setLendingObligations] = useState<any>([]);


  const fetchLendingObligations = async () => {
    try {
      const ownerPublicKey = 'B4P4miyudoJTSpiuchDJs4HvxhSvyStni49LtEVoYVM'; // Replace with your owner's public key
      const obligations = await getLendingObligation(ownerPublicKey);
      console.log(' Lending obligations:', obligations);
      //setLendingObligations(obligations);
    } catch (error) {
      console.error('Error fetching lending obligations:', error);
    }
  };

  async function fetchBorrowingUserMetadata() {
    const publicKey = 'B4P4miyudoJTSpiuchDJs4HvxhSvyStni49LtEVoYVM'; // Example publicKey
    try {
      const metadata = await getBorrowingUserMetadata(publicKey);
      console.log('Borrowing User Metadata:', metadata);
    } catch (error) {
      console.error('Error fetching borrowing user metadata:', error);
    }
  }

  useEffect(() => {
    fetchBorrowingUserMetadata();
    fetchLendingObligations();
 
  }, []);

  return (
    <div className=" w-full h-full lg:p-10 ">
      <Tab.Group>
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
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames('', ' focus:outline-none')}>
              <ul></ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default Home;
