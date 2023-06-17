import React from "react";

const FcuMaterialRow = ({ filter, index, setFcuFilterDel }) => {
  //console.log(lubOil);
  const { receivingDate, receivingQuantity, remark } = filter;

  return (
    <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
      <td>{index + 1}</td>

      <td>{receivingDate} </td>
      <td>{receivingQuantity}</td>
      <td className=" text-center">
        {/* cancel button */}
        <label
          htmlFor="fcuFilterDel"
          className=" text-red-500"
          onClick={() => setFcuFilterDel(filter)}
        >
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
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </label>
      </td>
      <td>{remark}</td>
    </tr>
  );
};

export default FcuMaterialRow;
