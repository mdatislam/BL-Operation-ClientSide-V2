import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Pages/SharedPage/Loading";
import AllPgRunRows from "./AllPgRunRows";
import { CSVLink } from "react-csv";
import { useState } from "react";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import auth from "../firebase.init";
import useAdmin from "../Pages/Hook/useAdmin";
import { useAuthState } from "react-firebase-hooks/auth";

const AllPgRunList = () => {
  const [user] = useAuthState(auth);
  const [admin] = useAdmin(user);
  const [searchPgRun, setSearchPgRun] = useState("");
  const [filter, setFilter] = useState([]);
  const navigate = useNavigate();
  const { data: pgRunData, isLoading } = useQuery(["list"], () =>
    fetch("https://backend.bloperation.com/ApprovedAllPgRun", {
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

  /* For filtering purpose */
  const handleSearch = (e) => {
    const search = e.target.value;
    setSearchPgRun(search);

    if (search !== "") {
      const filterData = pgRunData.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
      setFilter(filterData);
    } else {
      setFilter(pgRunData);
    }
  };

  return (
    <div className="px-2 lg:px-16 mt-12 mb-8">
      <div className="grid grid-cols-4 lg:grid-cols-8 h-12 gap-x-3 card bg-[#6934e3] rounded-lg justify-self-start mb-8">
        <Link to="/PgFuel" className="btn btn-secondary">
          Go BACK
        </Link>
        <h2 className="text-white  lg:card-title font-bold col-start-2 col-span-2 lg:col-span-6 justify-self-center self-center">
          All Approved <p>PG-Run List</p>
        </h2>
        <Link to="/Dashboard/PgRunUpdate" className="btn btn-secondary">
          GO PG RUN UPDATE
        </Link>
      </div>
      {/* For filter input box */}
      <div className="flex  justify-between flex-wrap gap-4">
        <input
          type="text"
          className="input input-bordered border-sky-400 w-full max-w-xs flex-auto"
          placeholder="Enter search Keyword"
          onChange={(e) => {
            handleSearch(e);
          }}
        />

        {admin && (
          <div>
            <CSVLink
              data={pgRunData}
              filename="PgRunData"
              className="btn btn-outline btn-info mb-2 flex-auto"
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
        )}
      </div>
      <div className="overflow-x-auto  mt-4">
        <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400 text-center">
              <th>SN</th>

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
            </tr>
          </thead>
          <tbody>
            {searchPgRun.length > 1
              ? filter.map((pgRun, index) => (
                  <AllPgRunRows
                    key={pgRun._id}
                    pgRun={pgRun}
                    index={index}
                  ></AllPgRunRows>
                ))
              : pgRunData?.map((pgRun, index) => (
                  <AllPgRunRows
                    key={pgRun._id}
                    pgRun={pgRun}
                    index={index}
                  ></AllPgRunRows>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPgRunList;
