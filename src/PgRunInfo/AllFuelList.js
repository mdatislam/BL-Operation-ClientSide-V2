import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteReceiveFuel from "../DashBoard/DeleteReceiveFuel";
import auth from "../firebase.init";
import useAdmin from "../Pages/Hook/useAdmin";
import Loading from "../Pages/SharedPage/Loading";
import AllFuelListRow from "./AllFuelListRow";
import { CSVLink } from "react-csv";
import { signOut } from "firebase/auth";

const AllFuelList = () => {
  const [searchFuel, setSearchFuel] = useState("");
  const [filter, setFilter] = useState([]);
  const [user] = useAuthState(auth);

  const [admin] = useAdmin(user);
  const navigate = useNavigate();
  const [delFuel, setDelFuel] = useState("");
  const {
    data: receiveFuel,
    isLoading,
    refetch,
  } = useQuery(["fuel"], () =>
    fetch(" https://backend.bloperation.com/fuelListAll", {
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
  const handlesearch = (e) => {
    const search = e.target.value;
    setSearchFuel(search);

    if (search !== "") {
      const filterData = receiveFuel.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
      setFilter(filterData);
    } else {
      setFilter(receiveFuel);
    }
  };
  return (
    <div className="px-2 lg:px-16 mt-12 mb-8">
      <div className="grid gap-x-2 grid-cols-4 lg:grid-cols-8 h-12 card bg-[#5a23d9] rounded-lg justify-self-start mb-8">
        <Link to="/PgFuel" className="btn btn-secondary">
          Go BACK
        </Link>
        <h2 className="text-white lg:card-title font-bold col-start-2 col-span-2 lg:col-span-6 justify-self-center self-center">
          All Issued <p>Fuel Record</p>
        </h2>
        <Link to="/Dashboard/FuelUpdate" className="btn btn-secondary">
          GO FUEL UPDATE
        </Link>
      </div>
      <div className="flex justify-between">
        <input
          type="text"
          className="input input-bordered border-sky-400 w-full max-w-xs"
          placeholder="Enter search Keyword"
          onChange={(e) => {
            handlesearch(e);
          }}
        />
        <div>
          <CSVLink
            data={receiveFuel}
            filename="receiveFuel"
            className="btn btn-outline btn-accent mb-2"
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
      </div>
      <div className="overflow-x-auto  mt-4">
        <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400 text-center">
              <th>SN</th>

              <th>Date</th>
              <th>Slip No</th>
              <th>PG No </th>
              <th>Vehicle No</th>
              <th>Site ID</th>
              <th>
                <div>Fuel</div>
                <div>Quantity</div>
              </th>
              <th>
                <div>Fuel</div>
                <div>Receiver</div>
              </th>
              <th>
                <div>Fuel</div>
                <div>Issuer</div>
              </th>
              {admin && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {searchFuel.length > 1
              ? filter?.map((fuel, index) => (
                  <AllFuelListRow
                    key={fuel._id}
                    fuel={fuel}
                    index={index}
                    setDelFuel={setDelFuel}
                    admin={admin}
                  ></AllFuelListRow>
                ))
              : receiveFuel.map((fuel, index) => (
                  <AllFuelListRow
                    key={fuel._id}
                    fuel={fuel}
                    index={index}
                    setDelFuel={setDelFuel}
                    admin={admin}
                  ></AllFuelListRow>
                ))}
          </tbody>
        </table>
      </div>
      {delFuel && (
        <DeleteReceiveFuel
          delFuel={delFuel}
          setDelFuel={setDelFuel}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default AllFuelList;
