import React from 'react';

const RectifierInfoRows = ({ rec }) => {
    const {brand, capacity,consumeFuel}=rec
    return (
      <tr className="border-2 border-[#ffcb24] hover">
        <th>
          <label>
            <input type="checkbox" className="checkbox" />
          </label>
        </th>
        <td>{brand}</td>
        <td>{capacity} </td>
        <td>{consumeFuel}</td>
        
      </tr>
    );
};

export default RectifierInfoRows;