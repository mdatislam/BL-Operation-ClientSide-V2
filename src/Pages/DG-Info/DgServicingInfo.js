import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../SharedPage/Loading";
import { CSVLink } from "react-csv";
import DgServicingInfoRow from "./DgServicingInfoRow";
import { signOut } from "firebase/auth";
import auth from "../../firebase.init";
import useAdmin from "../Hook/useAdmin";
import { useAuthState } from "react-firebase-hooks/auth";

const DgServicingInfo = () => {
  const [user] = useAuthState(auth);
  const [admin] = useAdmin(user);
  const [isChecked, setIsChecked] = useState("");
  const navigate = useNavigate();
  const {
    data: dgService,
    isLoading,
    refetch,
  } = useQuery(["DgInfoList"], () =>
    fetch(" https://backend.bloperation.com/dgServiceInfo", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        // toast.error("Unauthorize Access")
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

  const handleMultiDelete = () => {
    //console.log(isChecked)

    if (isChecked) {
      fetch(`https://backend.bloperation.com/dgServiceInfo/multiDelete`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(isChecked),
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          if (data.deletedCount > 0) {
            toast.success(
              ` ${data.deletedCount} Nos record delete successfully`
            );
          }
          refetch();
          setIsChecked(null);
        });
    } else {
      toast.error(" Please select min 1 row");
    }
  };

  //console.log(isChecked);
  return (
    <div className="mt-8 px-2 mb-4">
      <div className="flex flex-col flex-nowrap lg:flex-row justify-between items-center border-2 py-4">
        <div className="flex justify-between gap-2 px-2">
          <Link
            to="/DgAllServicing"
            className="btn  btn-sm btn-outline btn-info  mb-2"
          >
            All Service
          </Link>
          <Link
            to="/DgPlanServicing"
            className="btn  btn-sm btn-outline btn-info  mb-2"
          >
            Plan site
          </Link>

          <Link
            to="/Dashboard/DgServicingUpdate"
            className="btn  btn-sm btn-outline btn-info  mb-2"
          >
            Data UPDATE
          </Link>
        </div>

        <div className="flex flex-row justify-between items-center gap-x-3">
          <div>
            {admin && (
              <button
                className="btn btn-sm btn-error"
                onClick={handleMultiDelete}
              >
                Delete
              </button>
            )}
          </div>
          <div>
            {admin && (
              <Link
                to="/ServiceMaterial"
                className="btn  btn-sm btn-outline btn-info"
              >
                Service-Material
              </Link>
            )}
          </div>
          {/* For only last service Data Export */}
          {admin && (
            <div className="lg:px-4 ">
              <CSVLink
                data={dgService}
                filename="dgServiceInfo"
                className="btn btn-outline btn-sm btn-primary mb-2"
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
      </div>

      <h2 className="flex rounded-lg  text-white bg-[#575fec] mb-4 h-12 justify-center items-center text-xl mt-4">
        Latest DG Servicing Record
      </h2>

      <div className="overflow-x-auto  mt-4">
        <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400">
              <th>
                <input type="checkbox" className="checkbox"></input>
              </th>
              <th>SN</th>
              <th>Site ID</th>

              <th>
                <div>previous</div>
                <div>DG Service Date</div>
              </th>

              <th>
                <div>Previous </div>
                <div>DG RH</div>
              </th>
              <th>
                <div>Previous</div>
                <div>Battery SN</div>
              </th>

              <th>
                <div>Latest</div>
                <div>Service Date</div>
              </th>

              <th>
                <div>Latest </div>
                <div>DG RH</div>
              </th>
              <th>
                <div>Latest</div>
                <div>Battery SN</div>
              </th>
              <th>
                <div>Air Filter</div>
                <div>Use Status</div>
              </th>

              <th>
                <div>DG RH</div>
                <div>Picture</div>
              </th>
              <th>
                <div>DG Service</div>
                <div>Collector</div>
              </th>

              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {dgService?.map((dgInfo, index) => (
              <DgServicingInfoRow
                key={dgInfo._id}
                dgInfo={dgInfo}
                index={index}
                setIsChecked={setIsChecked}
                isChecked={isChecked}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DgServicingInfo;
