import React from 'react';

const AllPgRunRows = ({pgRun,index}) => {
    const {
      date,
      site,
      pgNo,
      pgStartTime,
      pgStoptTime,
      pgRunDuration,
      fuelConsume,
      onCallName,
      pgRunnerName,
     
    } = pgRun;
    return (
      <>
        <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
          <td>{index+1}</td>
          <td>{date}</td>
          <td>{site}</td>
          <td>{pgNo}</td>
          <td>{pgStartTime}</td>
          <td>{pgStoptTime}</td>
          <td>{pgRunDuration}</td>
          <td>{fuelConsume}</td>
          <td>{onCallName}</td>
          <td>{pgRunnerName}</td>
        </tr>
      </>
    );
};

export default AllPgRunRows;