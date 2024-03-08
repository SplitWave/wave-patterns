'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaXTwitter, FaGithub } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineModeNight } from 'react-icons/md';
import { PiSunLight } from 'react-icons/pi';
import { useWallet } from '@/context/WalletContext';
import { useTheme } from '@/context/ThemeContext';

function Header() {
  const { setWalletAddress } = useWallet();
  const [searchValue, setSearchValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSearch = () => {
    if (!searchValue) {
      setError('Please enter a wallet address');
      return;
    }
    setWalletAddress(searchValue);
    setError('');
    setSearchValue('');
  };
  return (
    <div
      className={` w-full h-full lg:flex items-center lg:flex-row lg:justify-between border-b p-4  ${
        isDarkMode
          ? 'bg-white/[0.12] border-neutral-800 '
          : 'bg-white text-black '
      } `}>
      <div className=" sm:w-full lg:w-1/3 flex flex-row lg:justify-center items-center ">
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          className="dark:invert"
          width={50}
          height={24}
          priority
        />
        <h1 className=" ml-2 font-bold text-xl ">WavePatterns</h1>
      </div>
      <div onClick={toggleTheme}>
        {isDarkMode ? (
          <PiSunLight
            color="white"
            size={24}
          />
        ) : (
          <MdOutlineModeNight
            className=" text-gray-300 "
            size={24}
          />
        )}
      </div>
      <div className=" w-full lg:w-2/3 flex flex-col lg:flex-row lg:justify-center lg:items-center mt-3  ">
        <div
          className={` lg:w-2/4 flex px-2 items-center border rounded-lg overflow-hidden ${
            isDarkMode
              ? 'bg-gray-200  bg-gradient-to-b from-zinc-200  border-neutral-800  dark:from-inherit dark:bg-zinc-800/30 text-white'
              : 'bg-white text-gray-300 shadow-md '
          } `}>
          <FaSearch
            className=" w-4 h-4 "
            onClick={handleSearch}
          />
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Paste any wallet address or .sol address here."
            className={`py-2 px-4 flex-1 outline-none ${
              isDarkMode
                ? 'bg-gradient-to-b from-zinc-200  border-neutral-800  dark:from-inherit   dark:bg-zinc-800/5'
                : 'bg-white'
            } `}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs ">{error}</p>}
        </div>
        <div className=" mt-3 lg:mt-0 ml-3 flex flex-row items-center ">
          <FaGithub size={30} />
          <FaXTwitter
            size={30}
            className=" ml-2 "
          />
          <h1 className=" ml-2 ">Follow us</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
