import React from "react";

const SnagListRows = ({ data, index, admin, setSiteDataEdit }) => {
  const {
    siteId,
    lat,
    long,
    unUsed,
    snag,
    date,
    updaterName,
    remark,
  } = data;

  return (
    <>
      <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
        <td>{index + 1}</td>

        <td>{siteId}</td>
        <td>{lat}</td>
        <td>{long}</td>
        <td>{snag}</td>
        <td>{unUsed}</td>
        <td>{date}</td>
        <td>{updaterName}</td>
        <td>{remark}</td>

        {/*  <th className='w-12 text-start'>{address}</th> */}
      </tr>
    </>
  );
};

export default SnagListRows;
