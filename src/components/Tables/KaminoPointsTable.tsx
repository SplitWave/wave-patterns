import React from 'react';

function KaminoPointsTable({ datas }: { datas: any }) {
  return (
    <div className="overflow-x-auto">
      <div className="border border-neutral-800 rounded-lg  ">
        <div className="grid grid-rows-6 text-md text-left">
          <div className="p-2 flex flex-row ">
            Leaderboard Rank{' '}
            <span className=" text-blue-300 ml-6 ">
              {datas.KaminoPoints.leaderboardRank}
            </span>
          </div>
          <div className="p-2 flex flex-row ">
            Total Points Earned{' '}
            <span className=" text-blue-300 ml-6 ">
              {datas.KaminoPoints.totalPointsEarned.toString().slice(0, 10)}
            </span>
          </div>
          <div className="p-2 flex flex-row ">
            pointsEarnedBorrowLend{' '}
            <span className=" text-blue-300 ml-6 ">
              {datas.KaminoPoints.pointsEarnedBorrowLend
                .toString()
                .slice(0, 10)}
            </span>{' '}
          </div>
          <div className="p-2 flex flex-row ">
            pointsEarnedLeverage{' '}
            <span className=" text-blue-300 ml-6 ">
              {datas.KaminoPoints.pointsEarnedLeverage}
            </span>
          </div>
          <div className="p-2 flex flex-row ">
            pointsEarnedMultiply{' '}
            <span className=" text-blue-300 ml-6 ">
              {datas.KaminoPoints.pointsEarnedMultiply}
            </span>
          </div>
          <div className="p-2 flex flex-row ">
            pointsEarnedStrategies{' '}
            <span className=" text-blue-300 ml-6 ">
              {datas.KaminoPoints.pointsEarnedStrategies
                .toString()
                .slice(0, 10)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KaminoPointsTable;
