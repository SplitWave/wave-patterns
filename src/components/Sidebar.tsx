'use client';
import React from 'react';
import { Tab } from '@headlessui/react';
import { TbSearch } from 'react-icons/tb';
import { BsPeople } from 'react-icons/bs';
import { TiHomeOutline } from 'react-icons/ti';
import { MdOutlineFeedback } from 'react-icons/md';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export function classNames(
  ...classes: Array<string | boolean | undefined | null>
): string {
  return classes
    .filter((value) => typeof value === 'string' && Boolean(value))
    .join(' ');
}

function Sidebar() {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`flex focus:outline-none w-full h-full ${
        isDarkMode
          ? 'bg-white/[0.12]  border-neutral-800  '
          : 'bg-white text-gray-500 font-semibold'
      }  `}>
      <Tab.Group vertical>
        <Tab.List
          className={`flex flex-col lg:items-center w-full h-full p-4 border-r ${
            isDarkMode && 'border-neutral-800'
          } `}>
          <Link href="/">
            <Tab
              className={({ selected }) =>
                classNames(
                  ' focus:outline-none my-4 p-2 flex flex-row ',
                  selected && isDarkMode && ' bg-white/[0.12]  rounded-md ',
                  selected &&
                    !isDarkMode &&
                    ' rounded-md bg-gray-200 text-black font-medium'
                )
              }>
              <TiHomeOutline size={25} />
              <h1 className=" ml-2 ">Home</h1>
            </Tab>
          </Link>
          <Link href="/assets">
            <Tab
              className={({ selected }) =>
                classNames(
                  ' focus:outline-none my-4 p-2 flex flex-row ',
                  selected && isDarkMode && ' bg-white/[0.12]  rounded-md ',
                  selected &&
                    !isDarkMode &&
                    ' rounded-md bg-gray-200 text-black font-medium'
                )
              }>
              <BsPeople size={25} />
              <h1 className=" ml-2 ">Following</h1>
            </Tab>
          </Link>
          <Tab
            className={({ selected }) =>
              classNames(
                ' focus:outline-none my-4 p-2 flex flex-row ',
                selected && isDarkMode && ' bg-white/[0.12] rounded-md ',
                selected &&
                  !isDarkMode &&
                  ' rounded-md bg-gray-200 text-black font-medium'
              )
            }>
            <TbSearch size={25} />
            <h1 className=" ml-2 ">Search</h1>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                ' focus:outline-none my-4 p-2 flex flex-row ',
                selected && isDarkMode && ' bg-white/[0.12] rounded-md ',
                selected &&
                  !isDarkMode &&
                  ' rounded-md bg-gray-200 text-black font-medium '
              )
            }>
            <MdOutlineFeedback size={25} />
            <h1 className=" ml-2 ">Feedback</h1>
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
}

export default Sidebar;
