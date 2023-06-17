import React from 'react';

const AllFuelListRow = ({ fuel, index, setDelFuel, admin  }) => {
     const {
       date,
       siteId,
       pgNo,
       vehicleNo,
       slipNo,
       fuelQuantity,
       fuelIssuer,
       fuelReceiverName,
     } = fuel;
    return (
      <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
        <th>{index + 1}</th>

        <td>{date}</td>
        <td>{slipNo}</td>
        <td>{pgNo}</td>
        <td>{vehicleNo}</td>
        <td>{siteId}</td>
        <td>{fuelQuantity}</td>
        <td>{fuelReceiverName}</td>
        <td>{fuelIssuer}</td>
        {admin && (
          <th className="">
            <label
              htmlFor="deleteFuel"
              className="btn btn-link text-red-500"
              onClick={() => setDelFuel(fuel)}
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
            </label>
          </th>
        )}
      </tr>
    );
};

export default AllFuelListRow;