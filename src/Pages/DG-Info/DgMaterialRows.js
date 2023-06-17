import React from 'react';

const DgMaterialRows = ({ dgInfo, index }) => {
    const {
      siteId,
        date,
        material,
      other,
      oldBatterySerialNo,
      newBatterySerialNo,

      remark,
      rhReading,
      updaterName,
    } = dgInfo;
  return (
    <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
      <td>{index + 1}</td>
      <td>{siteId}</td>
      <td>{date}</td>
          <td>{material} { other}</td>
      <td>{rhReading} </td>
      <td>{oldBatterySerialNo}</td>
      <td>{newBatterySerialNo} </td>
      <td>{updaterName} </td>

      <td>{remark}</td>
    </tr>
  );
};

export default DgMaterialRows;