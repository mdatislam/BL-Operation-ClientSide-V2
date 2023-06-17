import React from "react";


const PgStatusRows = ({ pg, index, refetch, setPgEdit,setPgDel,admin }) => {
  
  const { pgNo, date, pgStatus, updaterName, pgDetail } = pg;
  refetch();
  return (
    <>
      <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
        <th>{index + 1}</th>
        <td className="flex justify-items-center gap-x-2 text-center">
          {/* Edit button */}
          <label
            htmlFor="pgEdit"
            className=" text-red-500"
            onClick={() => setPgEdit(pg)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </label>
          {/*  Or button */}
          {admin && <span className="font-bold">|</span>}

          {/* cancel button */}

          {admin && (
            <label
              htmlFor="pgDel"
              className=" text-red-500"
              onClick={() => setPgDel(pg)}
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
          )}
        </td>
        <td>{pgNo}</td>
        <td>{date}</td>
        <td className="text-start">{pgStatus}</td>
        <td className=" px-2 text-start break-all ">{pgDetail}</td>
        <td>{updaterName}</td>
      </tr>
    </>
  );
};

export default PgStatusRows;
