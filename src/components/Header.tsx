import React from 'react';
import Image from 'next/image';
import { FaXTwitter, FaGithub } from 'react-icons/fa6';
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
        <h1 className=" ml-2 font-bold text-xl ">Wavepatterns</h1>
      </div>
      <div className=" w-full lg:w-2/3 flex flex-col lg:flex-row lg:justify-center lg:items-center mt-3  ">
        <div className=" lg:w-2/4 text-white flex px-2 items-center border rounded-lg overflow-hidden bg-gray-200  bg-gradient-to-b from-zinc-200  border-neutral-800  dark:from-inherit   dark:bg-zinc-800/30 ">
          <FaSearch className="text-white" />
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Paste any wallet address or ENS here"
            className="py-2 px-4 flex-1 outline-none bg-gray-200  bg-gradient-to-b from-zinc-200 dark:from-inherit  dark:bg-zinc-800/5 "
          />
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
