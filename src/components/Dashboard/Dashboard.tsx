'use client';
import React from 'react';
import { Tab } from '@headlessui/react';
import { TbSearch } from 'react-icons/tb';
import { BsPeople } from 'react-icons/bs';
import { TiHomeOutline } from 'react-icons/ti';
import { MdOutlineFeedback } from 'react-icons/md';
import HomeView from './HomeView';

export function classNames(
  ...classes: Array<string | boolean | undefined | null>
): string {
  return classes
    .filter((value) => typeof value === 'string' && Boolean(value))
    .join(' ');
}

function Dashboard() {
  return (
    <div className="flex focus:outline-none ">
      <Tab.Group vertical>
        <Tab.List className="flex flex-col lg:justify-center lg:items-center lg:w-1/12 h-full p-4 border-r border-neutral-800 ">
          <Tab
            className={({ selected }) =>
              classNames(
                ' focus:outline-none my-4 p-2 ',
                selected && ' bg-gray-600  rounded-md '
              )
            }>
            <TiHomeOutline size={25} />
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                ' focus:outline-none my-4 p-2 ',
                selected && ' bg-gray-600  rounded-md '
              )
            }>
            <BsPeople size={25} />
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                ' focus:outline-none my-4 p-2 ',
                selected && ' bg-gray-600  rounded-md '
              )
            }>
            <TbSearch size={25} />
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                ' focus:outline-none my-4 p-2 ',
                selected && ' bg-gray-600  rounded-md '
              )
            }>
            <MdOutlineFeedback size={25} />
          </Tab>
        </Tab.List>
        <Tab.Panels className="lg:w-11/12">
          <Tab.Panel>
            <HomeView />
          </Tab.Panel>
          <Tab.Panel>Content 2</Tab.Panel>
          <Tab.Panel>Content 3</Tab.Panel>
          <Tab.Panel>Content 4</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default Dashboard;
