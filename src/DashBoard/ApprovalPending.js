import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import Loading from "../Pages/SharedPage/Loading";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ApprovalPendingRow from "./ApprovalPendingRow";
import RejectApproval from "./RejectApproval";
import { toast } from "react-toastify";

const ApprovalPending = () => {
  const [user] = useAuthState(auth);
  const [reject, setReject] = useState(" ");
  const navigate = useNavigate();

  const {
    data: pgRunData,
    isLoading,
    refetch,
  } = useQuery(["list", user], () =>
    fetch(`http://localhost:5000/ApprovalList?email=${user.email}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        //  toast.error("Unauthorize Access")
        signOut(auth);
        localStorage.removeItem("accessToken");
        navigate("/Login");
      }
      return res.json();
    })
  );

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="text-center text-primary text-2xl mt-4 mb-8">
        <h2>Approval Pending List</h2>
      </div>
      <div className="overflow-x-auto  mt-4">
        <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400 text-center">
              <th>SN</th>
              <th>
                <div>Approval</div>
                <div>Status</div>
              </th>
              <th>Date</th>
              <th>Site ID</th>
              <th>PG No</th>
              <th>
                <div>PG Start</div>
                <div>Time</div>
              </th>
              <th>
                <div>PG Stop</div>
                <div>Time</div>
              </th>
              <th>Duration</th>
              <th>Consumption</th>
              <th>
                {" "}
                <div>Approval</div>
                <div>Responsible</div>
              </th>
              <th>PG Runner</th>
              <th>Remarks</th>
              <th>Verify Status</th>
            </tr>
          </thead>
          <tbody>
            {pgRunData.map((pgRun, index) => (
              <ApprovalPendingRow
                key={pgRun._id}
                pgRun={pgRun}
                index={index}
                setReject={setReject}
                refetch={refetch}
                pgRunner={user.displayName}
              ></ApprovalPendingRow>
            ))}
          </tbody>
        </table>
      </div>
      {reject && (
        <RejectApproval
          reject={reject}
          refetch={refetch}
          setReject={setReject}
        ></RejectApproval>
      )}
    </div>
  );
};

export default ApprovalPending;
