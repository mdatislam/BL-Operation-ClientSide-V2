import React from "react";
import { Link } from "react-router-dom";

const EmInfoListRow = ({ emInfo, index }) => {
  const {
    siteId,
    date,
    preDate,
    EmPreSerialNo,
    EmPreReading,
    EmSerialNo,
    EmReading,
    peakReading,
    offPeakReading,
    loadCurrent,
    updaterName,
    url,
    remark,
  } = emInfo;
  return (
    <tr className="border-2 border-[#F0D786] hover divide-x divide-gray-300 text-center">
      <td>{index + 1}</td>
      <td>{siteId}</td>
      <td>{preDate} </td>
      <td>{EmPreSerialNo} </td>
      <td>{EmPreReading} </td>
      <td className="text-[#3d6ae8] font-bold">{date}</td>
      <td className="text-[#3d6ae8] font-bold">{EmSerialNo} </td>
      <td className="text-[#3d6ae8] font-bold">{EmReading}</td>
      <td className="text-[#3d6ae8] font-bold">{peakReading}</td>
      <td className="text-[#3d6ae8] font-bold">{offPeakReading}</td>
      <td>{loadCurrent} </td>
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
      <td>{updaterName} </td>

      <td>{remark}</td>
    </tr>
  );
};

export default EmInfoListRow;
