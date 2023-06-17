import { useQuery } from "@tanstack/react-query";
import React from "react";
import { signOut } from "firebase/auth";
import auth from "./../firebase.init";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./../Pages/SharedPage/Loading";
import FcuAllDataRecordRow from "./FcuAllDataRecordRow";
import { CSVLink } from "react-csv";

const FcuAllDataRecord = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const { data: fcuAllData, isLoading } = useQuery(["fcuAllData"], () =>
    fetch(" https://backend.bloperation.com/fcuFilterChangeAllRecord", {
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
    <div className="px-2">
      <div className=" flex flex-col md:flex-row justify-between px-2 gap-y-2 mb-2 rounded-lg border-2 py-4 mt-2">
        <Link
          to="/FcuMaintenance"
          className="flex btn btn-outline btn-primary btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
        </Link>

        {/* For Data Export */}

        <div>
          <CSVLink
            data={fcuAllData}
            filename="fcuFilterChangeAllRecord"
            className="flex btn btn-outline btn-primary btn-sm"
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </CSVLink>
        </div>
      </div>
      <h2 className="flex rounded-lg  text-white bg-[#746bd8] mb-4 mt-4 h-12 justify-center items-center text-2xl">
        FCU Filter Changing All Records
      </h2>
      <div className="overflow-x-auto  mt-4">
        <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400 text-center">
              <th>SNo</th>
              <th>Site ID</th>
              <th>Office</th>
              <th>Site Type</th>
              <th>
                <div>Cooling</div>
                <div>System</div>
              </th>
              <th>FCU Brand</th>
              <th>
                <div>Installation</div>
                <div>Date</div>
              </th>
              <th>
                <div>Pre Filter</div>
                <div>Change Date</div>
              </th>
              <th>
                <div>Latest Filter</div>
                <div>Change Date</div>
              </th>
              <th>
                <div>Next Plan</div>
                <div>Date</div>
              </th>
              <th>
                <div>Latest </div>
                <div>Action</div>
              </th>
              <th>
                <div>Setting</div>
                <div>Check?</div>
              </th>
              <th>
                <div>Updated</div>
                <div>By</div>
              </th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {fcuAllData?.map((data, index) => (
              <FcuAllDataRecordRow key={index} data={data} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FcuAllDataRecord;
