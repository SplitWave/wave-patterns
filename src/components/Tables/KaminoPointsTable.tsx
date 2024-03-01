import React from 'react';

function KaminoPointsTable({ datas }: { datas: any }) {
  return (
    <div className="overflow-x-auto">
      <div className="border border-neutral-800 rounded-lg  ">
        <div className="grid grid-cols-2 text-md text-left px-10 ">
          <div className="p-2 flex flex-col border-r border-neutral-800 ">
            <h1 className="">Leaderboard Rank</h1>
            <span className=" font-semibold text-[1.875rem] ">
              {datas.KaminoPoints.leaderboardRank}
            </span>
          </div>
          <div className="p-2 flex flex-col pl-10 ">
            <h1>Total Points Earned</h1>
            <span className=" font-semibold text-[1.875rem] ">
              {datas.KaminoPoints.totalPointsEarned.toString().slice(0, 10)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KaminoPointsTable;
