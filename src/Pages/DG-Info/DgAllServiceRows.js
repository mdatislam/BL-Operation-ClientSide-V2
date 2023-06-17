import React from 'react';

const DgAllServiceRows = ({ dgInfo, index, setIsChecked, isChecked }) => {
  const {
    _id,
    siteId,
    airFilter,
    batterySerialNo,
    batteryPreSerialNo,
    date,
    remark,
    rhReading,
    updaterName,
    nextPlanDate,
    url,
    preRhReading,
    previousDate,
  } = dgInfo;

  const handleCheck = (e) => {
    const { value, checked } = e.target;
    //console.log(value, checked)

    if (checked) {
      setIsChecked([...isChecked, value]);
    } else {
      setIsChecked(isChecked.filter((e) => e !== value));
    }
  };

  return (
    <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
      <td>
        <input
          type="checkbox"
          className="checkbox"
          value={siteId}
          onChange={(e) => handleCheck(e)}
        />
      </td>
      <td>{index + 1}</td>
      <td>{siteId}</td>
      <td>{previousDate} </td>
      <td>{preRhReading} </td>
      <td>{batteryPreSerialNo} </td>
      <td className="text-[#798fcb] font-bold">{date}</td>
      <td className="text-[#3d6ae8] font-bold">{rhReading} </td>
      <td className="text-[#3d6ae8] font-bold">{batterySerialNo}</td>
      <td className="text-[#3d6ae8] font-bold">{airFilter}</td>
     
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <a
              target="_blank"
              rel="noreferrer"
              href={url}
              className="mask mask-squircle w-12 h-12 "
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

export default DgAllServiceRows;