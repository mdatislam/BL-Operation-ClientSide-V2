import React from 'react';

const AllRefuelingRows = ({ refuel, index}) => {
  const {
    siteId,
    date,
    previousQuantity,
    reFuelQuantity,
    remark,
    rhReading,
    updaterName,
    preRhReading,
    previousDate,
    preTotalFuel,
    consumption,
    url,
  } = refuel;

  return (
    <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
      <td>{index + 1}</td>
      <td>{siteId}</td>
      <td>{previousDate} </td>
      <td>{preRhReading} </td>
      <td>{preTotalFuel} </td>
      <td className="text-[#3d6ae8] font-bold">{date}</td>
      <td className="text-[#3d6ae8] font-bold">{rhReading} </td>
      <td className="text-[#3d6ae8] font-bold">{previousQuantity}</td>
      <td className="text-[#3d6ae8] font-bold">{reFuelQuantity}</td>
      <td className="text-[#3d6ae8] font-bold">{consumption}</td>
      <td>{updaterName} </td>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <a
              href={url}
              className="mask mask-squircle w-12 h-12 "
              target="_blank"
            >
              <img src={url} alt="pic of EM Reading" />
            </a>
          </div>
        </div>
      </td>

      <td>{remark}</td>
    </tr>
  );
};

export default AllRefuelingRows;