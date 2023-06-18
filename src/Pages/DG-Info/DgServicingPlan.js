import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../SharedPage/Loading";
import { CSVLink } from "react-csv";
import { signOut } from "firebase/auth";
import auth from "../../firebase.init";
import DgServicePlanRows from "./DgServicePlanRows";
import useAdmin from "../Hook/useAdmin";
import { useAuthState } from "react-firebase-hooks/auth";

const DgServicingPlan = () => {
  const [user] = useAuthState(auth);
  const [admin] = useAdmin(user);
  const navigate = useNavigate();
  const { data: dgServiceInfo, isLoading } = useQuery(["DgInfoList"], () =>
    fetch(" http://localhost:5000/dgServiceInfo", {
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
  // console.log(services)
  if (isLoading) {
    return <Loading />;
  }
  // console.log(dgServiceInfo);
  return (
    <div className="mt-8 px-4 mb-4 lg:w-3/4 mx-auto">
      <h2 className="flex rounded-lg  text-white bg-[#78e33f] mb-4 h-12 justify-center items-center">
        DG Servicing Plan Sites
      </h2>

      <div className=" flex justify-between  mb-2 rounded-lg border-2 p-4 ">
        <Link
          to="/DgServicing"
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

        <Link
          to="/Dashboard/DgServicingUpdate"
          className="flex btn btn-outline btn-primary btn-sm"
        >
          Data UPDATE
        </Link>
        {/* For Data Export */}
        {admin && (
          <div>
            <CSVLink
              data={dgServiceInfo}
              filename="dgServiceInfo"
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

      <div className="overflow-x-auto  mt-4">
        <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400 text-center">
              <th className="w-12">SN</th>
              <th>Site ID</th>
              <th>
                <div>Latest</div>
                <div>Service Date</div>
              </th>

              <th>
                <div>Latest </div>
                <div>DG RH</div>
              </th>

              <th>
                <div>Air Filter</div>
                <div>Use Status</div>
              </th>
              <th>Day Difference</th>
              <th className="bg-[#61ec4c]">
                <div>Next Plan</div>
                <div>Date</div>
              </th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {dgServiceInfo?.map((dgInfo, index) => (
              <DgServicePlanRows
                key={dgInfo._id}
                dgInfo={dgInfo}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DgServicingPlan;
