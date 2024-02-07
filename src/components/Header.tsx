import React from 'react';
import Image from 'next/image';
import { FaXTwitter } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';

function Header() {
  return (
    <div className=" w-full h-full lg:flex  lg:flex-row lg:justify-between border-b p-4  bg-gray-200  bg-gradient-to-b from-zinc-200  border-neutral-800  dark:from-inherit   dark:bg-zinc-800/30 ">
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
      <div className=" w-full lg:w-2/3 flex flex-row lg:justify-center items-center mt-3 ">
        <div className=" w-2/4 text-black flex px-2 bg-white items-center border rounded-lg overflow-hidden">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Paste any wallet address or .sol address here."
            className="py-2 px-4 flex-1 outline-none"
          />
        </div>
        <div className=" ml-3 flex flex-row items-center ">
          <FaXTwitter size={30} />
          <h1 className=" ml-2 ">Follow us</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
