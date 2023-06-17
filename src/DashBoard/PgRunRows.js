import React, { useState } from "react";

const PgRunRows = ({ pgRun, index, refetch, setDelPg }) => {
  const {
    date,
    site,
    moduleCapacity,
    pgNo,
    pgStartTime,
    pgStoptTime,
    pgRunDuration,
    fuelConsume,
    onCallName,
    status,
    pgRunnerName,
    remark,
  } = pgRun;
  // console.log(fuelConsume);
  // console.log(pgStartTime);
  /* let consume
  let duration
  if (pgStartTime && pgStoptTime) {
    let start = pgStartTime.split(":");
    let stop = pgStoptTime.split(":");
    let startTime = new Date(0, 0, 0, start[0], start[1], 0);
    let stopTime = new Date(0, 0, 0, stop[0], stop[1], 0);
    let diff = stopTime.getTime() - startTime.getTime();
    // console.log(diff)
    const hours = Math.floor(diff / 3600000);
    //console.log(hours);
    diff = diff - hours * 1000 * 3600;
    const minutes = Math.floor(diff / 60000);
    //console.log(minutes);
     duration = `${hours}:${minutes}`;

    const time = duration.split(":");
    const timeValue = parseInt(time[0], 10) + parseInt(time[1], 10) / 60;
     consume = (timeValue * 3).toFixed(2);
   
  }
  */
  /*  */
  return (
    <>
      <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
        <th>{index + 1}</th>

        <td>{date}</td>
        <td>{site}</td>
        <td>{moduleCapacity}</td>
        <td>{pgNo}</td>
        <td>{pgStartTime}</td>
        <td>{pgStoptTime}</td>
        <td>{pgRunDuration}</td>
        <td>{fuelConsume}</td>
        <td>{onCallName}</td>
        <td>{pgRunnerName}</td>
        <td>{status}</td>
        <th>
          {status !== "Approved" ?<label
            htmlFor="deletePgRun"
            className="btn btn-link text-red-500"
            onClick={() => setDelPg(pgRun)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </label>:""}

          {/* <label htmlFor="editPgRun" className="btn btn-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </label> */}
        </th>
        <td className="font-bold">{remark}</td>
      </tr>
    </>
  );
};

export default PgRunRows;
