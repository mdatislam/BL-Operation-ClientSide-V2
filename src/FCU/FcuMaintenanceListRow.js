import React from "react";

const FcuMaintenanceListRow = ({ fcuInfo, index }) => {
  const {
    siteId,
    latestFilterChangeDate,
    fcuBrand,
    nextPlanDate,
    preFilterChangeDate,
    fcuFilterStatus,
    fcuCtrl,
    updaterName,
    url,
    remark,
  } = fcuInfo;
  return (
    <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
      <td className="w-12">{index + 1}</td>
      <td>{siteId}</td>
      <td className=" ">{fcuBrand} </td>
      <td className=" ">{preFilterChangeDate}</td>
      <td className=" ">{latestFilterChangeDate}</td>
      <td className="text-[#e41fe4f6] font-bold">{nextPlanDate}</td>
      <td className=" ">{fcuFilterStatus}</td>
      <td className=" ">{fcuCtrl}</td>
      <td className=" ">{updaterName}</td>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <a
              href={url}
              className="mask mask-squircle w-12 h-12 "
              target="_blank"
              rel="noReferrer"
            >
              <img src={url} alt="pic of fcu Filter" />
            </a>
          </div>
        </div>
      </td>
      <td>{remark}</td>
    </tr>
  );
};

export default FcuMaintenanceListRow;
