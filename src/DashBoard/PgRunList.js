import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import Loading from "../Pages/SharedPage/Loading";
import PgRunRows from "./PgRunRows";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DeletePgRun from "./DeletePgRun";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const PgRunList = () => {
  const [searchPgRun, setSearchPgRun] = useState("");
  const [filter, setFilter] = useState([]);
  const [delPg, setDelPg] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [receiveFuel, setReceiveFuel] = useState([]);
  useEffect(() => {
    const url = ` https://backend.bloperation.com/fuelList?email=${user.email}`;
    //console.log(url)
    fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          //  toast.error("Unauthorize Access")
          signOut(auth);
          localStorage.removeItem("accessToken");
          navigate("/Login");
        }
        return res.json();
      })
      .then((data) => setReceiveFuel(data));
  });

  const {
    data: pgRunData,
    isLoading,
    refetch,
  } = useQuery(["list"], () =>
    fetch(
      `  https://backend.bloperation.com/pgRunAllList?email=${user.email}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    ).then((res) => res.json())
  );

  if (isLoading) {
    return <Loading />;
  }

  const approveConsume = pgRunData?.filter((ap) => ap.status === "Approved");

  const totalFuel = approveConsume?.map((C) => {
    const consume = C.fuelConsume;
    return consume;
  });
  // console.log(totalFuel)
  // console.log(approveConsume);
  /* if (receiveFuel) {
   setLoading(false);
 } */
  const totalConsume = totalFuel?.reduce(
    (previous, current) => previous + parseFloat(current),
    0
  );
  const totalApprovedConsume = totalConsume?.toFixed(2);
  const Fuel = receiveFuel?.map((C) => {
    const fuelReceive = C.fuelQuantity;
    return fuelReceive;
  });

  //console.log(Fuel);
  const receivedFuel = Fuel?.reduce(
    (previous, current) => previous + parseFloat(current),
    0
  );

  const balance = (receivedFuel - totalConsume).toFixed(2);

  /* For filtering purpose */
  const handlesearch = (e) => {
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
    <div>
      <div className="text-center  text-2xl mt-12 mb-8">
        <div className="stats bg-[#001f3f] stats-vertical lg:stats-horizontal shadow-xl">
          <div className="stat text-[#FFF]">
            <div className="stat-title">Total Received Fuel</div>
            <div className="stat-value">{receivedFuel}</div>
            <div className="stat-desc">Liter</div>
          </div>

          <div className="stat text-[#FFF]">
            <div className="stat-title">Total Approved Consume</div>
            <div className="stat-value">{totalApprovedConsume}</div>
            <div className="stat-desc">Liter</div>
          </div>

          <div className="stat text-[#FFCB24]">
            <div className="stat-title">Balance</div>
            <div className="stat-value ">{balance}</div>
            <div className="stat-desc"> Liter</div>
          </div>
        </div>
        <div className="grid h-12 card bg-[#34aaef] rounded-box place-items-center mt-12">
          <h2 className="text-white font-bold ">Your All PG Run Record</h2>
        </div>
      </div>
      <div className="flex  justify-between flex-wrap mb-4 px-2">
        <input
          type="text"
          className="input input-bordered border-sky-400 w-full max-w-xs flex-auto "
          placeholder="Enter search Keyword"
          onChange={(e) => {
            handlesearch(e);
          }}
        />
      </div>
      <div className="overflow-x-auto px-2">
        <table className="table table-compact w-full">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400 text-center">
              <th>SN</th>
              <th>Date</th>
              <th>Site ID</th>
              <th>
                <div>Rectifier</div>
                <div>Module Capacity</div>
              </th>
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
              <th>
                <div>Approval</div>
                <div>Status</div>
              </th>
              <th>Action</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {searchPgRun.length > 0
              ? filter.map((pgRun, index) => (
                  <PgRunRows
                    key={pgRun._id}
                    pgRun={pgRun}
                    index={index}
                    setDelPg={setDelPg}
                    //fuelConsume={fuelConsume}
                  ></PgRunRows>
                ))
              : pgRunData.map((pgRun, index) => (
                  <PgRunRows
                    key={pgRun._id}
                    pgRun={pgRun}
                    index={index}
                    setDelPg={setDelPg}
                    //fuelConsume={fuelConsume}
                  ></PgRunRows>
                ))}
          </tbody>
        </table>
      </div>
      {delPg && (
        <DeletePgRun
          delPg={delPg}
          setDelPg={setDelPg}
          refetch={refetch}
        ></DeletePgRun>
      )}
    </div>
  );
};

export default PgRunList;
