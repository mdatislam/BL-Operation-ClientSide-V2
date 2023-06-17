import React from 'react';

const DgServicePlanRows = ({dgInfo,index }) => {
  const { siteId, airFilter, date, remark, rhReading, nextPlanDate } = dgInfo;

  /*  difference calculation */

  let dateObject = new Date(date).toDateString();
  let serviceDateMsec = Date.parse(dateObject);
  let date2 = new Date();
  let todayMsec = Date.parse(date2);
  const dayDifference = todayMsec - serviceDateMsec;
  const day = (dayDifference / (1000 * 3600 * 24)).toFixed(0);
   // console.log(day);
    
  return (
    <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
      <td className='w-12'>{index + 1}</td>
      <td>{siteId}</td>

      <td className=" ">{date}</td>
      <td className=" ">{rhReading} </td>
      <td className=" ">{airFilter}</td>
      <td className=" ">{day}</td>
      <td className="text-[#e41fe4f6] font-bold">{nextPlanDate}</td>
      <td>{remark}</td>
    </tr>
  );
};

export default DgServicePlanRows;