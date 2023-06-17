import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../SharedPage/Loading";
import DgRefuelingRow from "./DgRefuelingRow";
import { CSVLink } from "react-csv";
import { signOut } from "firebase/auth";
import auth from "../../firebase.init";

const DgRefuelingList = () => {
  const navigate = useNavigate();
  const { data: dgRefueling, isLoading } = useQuery(["DgRefueling"], () =>
    fetch(" https://backend.bloperation.com/dgRefuelingInfo", {
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
  return (
    <div className="mt-8 px-4 mb-4">
      <div className=" flex flex-col lg:flex-row gap-2  rounded-lg mb-4 ">
        <div className="flex flex-row lg:flex-col gap-2 justify-between">
          <Link
            to="/AllRefueling"
            className=" flex-1 order-first btn btn-secondary"
          >
            View All Refueling List
          </Link>
          <Link
            to="/Dashboard/DgRefuelingUpdate"
            className=" flex-1  btn btn-secondary"
          >
            GO DG Refueling Update
          </Link>
        </div>
        <h2 className="grow  bg-[#6495ED] rounded-lg text-center h-12 py-2 align-text-bottom text-xl font-bold text-white">
          Only Latest DG Refueling Record
        </h2>
      </div>
      {/* For Data export */}
      <div>
        <CSVLink
          data={dgRefueling}
          filename="PgRunData"
          className="btn btn-primary btn-sm mb-2"
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
          &nbsp; Download
        </CSVLink>
      </div>
      <div className="overflow-x-auto  mt-4">
        <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400">
              <th>SN</th>
              <th>Site ID</th>
              <th>
                <div>Latest</div>
                <div>Refueling Date</div>
              </th>

              <th>
                <div>Latest </div>
                <div>DG RH</div>
              </th>
              <th>
                <div>Previous</div>
                <div>Fuel Quantity</div>
              </th>

              <th>
                <div>Refueling</div>
                <div>Quantity</div>
              </th>
              <th className="text-[#e98811] font-bold">
                <div>previous</div>
                <div>Refueling Date</div>
              </th>

              <th className="text-[#e98811] font-bold">
                <div>Previous </div>
                <div>Refueling RH</div>
              </th>
              <th className="text-[#e98811] font-bold">
                <div>Total Fuel</div>
                <div>last Refueling</div>
              </th>
              <th>
                <div>Consumption</div>
              </th>
              <th>
                <div>Refueling</div>
                <div>By</div>
              </th>
              <th>
                <div>Refueling</div>
                <div>RH Photo</div>
              </th>

              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {dgRefueling?.map((refuel, index) => (
              <DgRefuelingRow key={refuel._id} refuel={refuel} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DgRefuelingList;
