import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import auth from "../../firebase.init";
import Loading from "../SharedPage/Loading";
import useAdmin from "../Hook/useAdmin";
import { useAuthState } from "react-firebase-hooks/auth";

import "./SiteDataInfo.css";
import SiteDataInfoRows from "./SiteDataInfoRows";
import EditSiteData from "./EditSiteData";
import { CSVLink } from "react-csv";

const SiteDataInfo = () => {
  const [user] = useAuthState(auth);
  const [admin] = useAdmin(user);
  const [siteDataEdit, setSiteDataEdit] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50);
  //const [count,setCount]= useState(1)

  const navigate = useNavigate();

  // For Existing site upload
  const {
    data: siteData,
    isLoading,
    refetch,
  } = useQuery(["siteInfo", [page, size]], () =>
    fetch(
      `https://backend.bloperation.com/siteData?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    ).then((res) => {
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
  //console.log(siteData)

  const pages = Math.ceil(siteData.count / size);
  //console.log(siteDataEdit)

  //console.log(selectSite)

  return (
    <>
      <div className="px-3 mb-2">
        <h5 className="flex justify-center items-center text-white text-xl font-bold h-12 mt-2 p-4 rounded-lg bg-[#6e3790] px-2">
          Existing Site Data Record
        </h5>
        <div className="flex flex-col justify-start lg:justify-end  lg:items-center lg:flex-row  gap-2 mt-1">
          <div className="flex flex-cols justify-between lg:gap-x-4 lg:justify-start mt-2">
            <NavLink
              to="/siteDataHome"
              className="btn btn-secondary  btn-outline btn-sm mt-3"
            >
              Back
            </NavLink>

            {/* For Data Export */}
            {admin && (
              <div className="mt-3">
                <CSVLink
                  data={siteData.result}
                  filename="SiteDataInfo"
                  className="btn btn-outline btn-accent btn-sm mb-2"
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
                    csv
                  </svg>
                </CSVLink>
              </div>
            )}
          </div>
          <div className="font-bold text-lg pagination  rounded-lg mt-2 px-2">
            <div className="">
              Pages: &nbsp;
              {[...Array(pages).keys()]?.map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={
                    page === number
                      ? " btn btn-active text-lg btn-accent text-white"
                      : ""
                  }
                >
                  {number + 1}
                </button>
              ))}
            </div>
            <div>
              <span className="text-pink-700">Size: &nbsp; </span>
              {
                <select onChange={(e) => setSize(e.target.value)}>
                  <option value="50">50</option>
                  <option value="10">10</option>
                  <option value="100">100</option>
                  <option value="1000">All</option>
                </select>
              }
            </div>
          </div>
        </div>

        <div className="overflow-x-scroll">
          <table className="table table-compact w- border-spacing-2 border border-3 border-slate-600">
            <thead className="border-2 border-[#FFCB24]">
              <tr className="divide-x divide-blue-400 text-center">
                <th>SNo</th>
                <th>Action</th>
                <th>Site ID</th>
                <th>
                  <div>Share Site</div>
                  <div>Code</div>
                </th>

                <th>
                  <div>Connected</div>
                  <div>Site</div>
                </th>
                <th>
                  <div>Battery</div>
                  <div>Info</div>
                </th>
                <th>
                  <div>Battery</div>
                  <div>Backup(hr)</div>
                </th>
                <th>
                  <div>Rectifier</div>
                  <div>Info</div>
                </th>
                <th>Key Status</th>
                <th>MobileNo-1</th>
                <th>MobileNo-2</th>
                <th>Date</th>
                <th>Updater Name</th>

                {/* <th className="w-12 text-start">Address</th> */}
              </tr>
            </thead>
            <tbody>
              {siteData.result?.map((data, index) => (
                <SiteDataInfoRows
                  key={index._id}
                  data={data}
                  setSiteDataEdit={setSiteDataEdit}
                  admin={admin}
                  index={index}
                />
              ))}
            </tbody>
          </table>
          {siteDataEdit && (
            <EditSiteData
              siteDataEdit={siteDataEdit}
              refetch={refetch}
              setSiteDataEdit={setSiteDataEdit}
            ></EditSiteData>
          )}
        </div>
      </div>
    </>
  );
};

export default SiteDataInfo;
