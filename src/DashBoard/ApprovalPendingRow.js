import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../firebase.init";

const ApprovalPendingRow = ({ pgRun, index, setReject, refetch }) => {
  const navigate = useNavigate();
  const {
    _id,
    date,
    site,
    pgNo,
    pgStartTime,
    pgStoptTime,
    pgRunDuration,
    fuelConsume,
    onCallName,
    status,
    pgRunnerName,
    remark,
  } = pgRun;

  const handleApprove = (id) => {
    fetch(
      `http://localhost:5000/

pgRunList/${id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          status: "Approved",
          remark: "OK",
        }),
      }
    )
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          toast.error("Unauthorize access");
          signOut(auth);
          localStorage.removeItem("accessToken");
          navigate("/Login");
        }
        return res.json();
      })
      .then((approveData) => {
        if (approveData.modifiedCount > 0) {
          toast.success("Approved successfully done");
        }
        refetch();
      });
    //console.log(id)
  };

  return (
    <tr className="border-2 border-[#F0D786]  hover divide-x divide-gray-300 text-center">
      <th>{index + 1}</th>
      <th>{status}</th>
      <td>{date}</td>
      <td>{site}</td>
      <td>{pgNo}</td>
      <td>{pgStartTime}</td>
      <td>{pgStoptTime}</td>
      <td>{pgRunDuration}</td>
      <td>{fuelConsume}</td>
      <td>{onCallName}</td>
      <td>{pgRunnerName}</td>
      <td>{remark}</td>

      <td>
        <label
          className="btn btn-secondary text-white btn-xs mx-2"
          onClick={() => handleApprove(_id)}
        >
          Approve
        </label>

        <label
          htmlFor="rejectApproval"
          className="btn btn-warning btn-xs"
          onClick={() => setReject(pgRun)}
        >
          Reject
        </label>
      </td>
    </tr>
  );
};

export default ApprovalPendingRow;
