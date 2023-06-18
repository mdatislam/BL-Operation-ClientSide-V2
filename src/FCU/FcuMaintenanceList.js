import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { signOut } from "firebase/auth";
import auth from "./../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import useAdmin from "./../Pages/Hook/useAdmin";
import Loading from "./../Pages/SharedPage/Loading";
import FcuMaintenanceListRow from "./FcuMaintenanceListRow";

const FcuMaintenanceList = () => {
  const [user] = useAuthState(auth);
  const [admin] = useAdmin(user);
  const navigate = useNavigate();
  const { data: fcuFilter, isLoading } = useQuery(
    ["fcuFilterChangeRecord"],
    () =>
      fetch(" http://localhost:5000/fcuFilterChangeLatestRecord", {
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
  //console.log(fcuFilter);
  // console.log(dgServiceInfo);
  return (
    <div className="bg-teal-300 h-100 px-2">
      <div className="lg:w-3/4 mx-auto ">
        <div className=" flex flex-col md:flex-row justify-between px-2 gap-y-2 mb-2 rounded-lg border-2 py-4">
          <Link to="/Home" className="flex btn btn-outline btn-primary btn-sm">
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

          <Link
            to="/Dashboard/fcuFilterChange"
            className="flex btn btn-outline btn-primary btn-sm"
          >
            Data UPDATE
          </Link>

          {/* FCU filter calcultion */}

          <Link
            to="/fcuMaterial"
            className="flex btn btn-outline btn-primary btn-sm"
          >
            FCU Material
          </Link>

          {/* For Data upload button */}
          {admin && (
            <Link
              to="/FcuDataUpload"
              className="flex btn btn-outline btn-primary btn-sm"
            >
              Data Import
            </Link>
          )}

          {/* For Data Export */}
          {admin && (
            <div>
              <CSVLink
                data={fcuFilter}
                filename="fcuFilerChangeRecord"
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
          )}
        </div>

        <h2 className="flex rounded-lg  text-white bg-[#d16bd8] mb-4 h-12 justify-center items-center text-2xl">
          FCU Filter Changing Records
        </h2>

        <div className="overflow-x-auto  mt-4">
          <table className=" table table-compact  border-spacing-2  border border-3 border-slate-600 ">
            <thead className="border-2 border-[#FFCB24]">
              <tr className="divide-x divide-blue-400 text-center">
                <th className="w-12">SN</th>
                <th>Site ID</th>
                <th>
                  <div>FCU </div>
                  <div>Brand</div>
                </th>

                <th>
                  <div>Pre Filter</div>
                  <div>Changing Date</div>
                </th>
                <th>
                  <div>Latest Filter</div>
                  <div>Changing Date</div>
                </th>
                <th className="text-[#5d9655]">
                  <div>Next Plan</div>
                  <div>Date</div>
                </th>

                <th>
                  <div>Latest</div>
                  <div>Action</div>
                </th>
                <th>
                  <div>Setting</div>
                  <div>Check ?</div>
                </th>

                <th>
                  <div>Update</div>
                  <div>By</div>
                </th>
                <th>Picture</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {fcuFilter?.map((fcuInfo, index) => (
                <FcuMaintenanceListRow
                  key={fcuInfo._id}
                  fcuInfo={fcuInfo}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FcuMaintenanceList;
