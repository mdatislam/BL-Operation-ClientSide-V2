import React from "react";

const UserListRows = ({ use,setProfile}) => {
  const { name, email, role } = use;

  return (
    <tr className="border-2 border-[#ffcb24] hover">
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>{name}</td>
      <td>{email} </td>
      <td>{role}</td>
      <td>
        <label
          htmlFor="profileChange"
          className="btn modal-button"
          onClick={() => setProfile(use)}
        >
          Change Profile
        </label>
       
      </td>
    </tr>
  );
};

export default UserListRows;
