import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { IoCopyOutline } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PublicKeyBar({ showPubKey, setShowPubKey, walletAddress }: any) {
  const { isDarkMode } = useTheme();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={` w-full h-5 mb-2 ${isDarkMode ? '' : 'text-black'} `}>
      <Menu>
        <div className=" flex flex-row items-center ">
          <Menu.Button
            className="  flex flex-row items-center "
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
              {showPubKey ? walletAddress.slice(0, 5) : '****'}
            </h1>
          </Menu.Button>
          <button
            onClick={handleCopyToClipboard}
            className=" ml-2 ">
            <IoCopyOutline />
          </button>
        </div>
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
  );
}

export default PublicKeyBar;
