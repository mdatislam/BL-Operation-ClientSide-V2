import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../firebase.init";
import usePgList from "../Pages/Hook/usePgList";
import Loading from "../Pages/SharedPage/Loading";
import useSiteList from "./../Pages/Hook/useSiteList";

const PgRunUpdate = () => {
  const [user] = useAuthState(auth);
  const [siteList] = useSiteList();
  const [search, setSearch] = useState("");
  const [PgList] = usePgList();
  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { data: users, isLoading } = useQuery(["userList", user], () =>
    fetch("http://localhost:5000/userList", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        /*  toast.error("Unauthorize Access") */
        signOut(auth);
        localStorage.removeItem("accessToken");
        navigate("/Login");
      }
      return res.json();
    })
  );
  const { data: rectifiers, isLoading3 } = useQuery(["rectifierList"], () =>
    fetch("http://localhost:5000/rectifier", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => res.json())
  );

  // console.log(services)
  if (isLoading || isLoading3) {
    return <Loading />;
  }

  /* today & previous date calculation */

  let pre = new Date();
  pre.setDate(pre.getDate() - 2);
  let preYear = pre.getFullYear();
  let preMonth = pre.getMonth() + 1;
  if (preMonth < 10) {
    preMonth = "0" + preMonth;
  }
  let preDay = pre.getDate();
  if (preDay < 10) {
    preDay = "0" + preDay;
  }
  let preDate = preYear + "-" + preMonth + "-" + preDay;

  //console.log(preDate);

  let date = new Date();
  date.setDate(date.getDate());
  let today = date.toLocaleDateString("en-CA");
  //console.log(today);
  /* today & previous date calculation */

  const availableUser = users?.filter((u) => u.name !== user.displayName);

  const onSubmit = async (data) => {
    let mod = data.capacity;
    let consumeFuel = rectifiers?.filter((rec) => rec.capacity === mod);
    const consumePerModule = consumeFuel.map((ff) => ff.consumeFuel);
    // console.log(consumePerModule)

    const pgStart = data.startTime;
    const pgStop = data.stopTime;
    let start = pgStart.split(":");
    let stop = pgStop.split(":");
    let startTime = new Date(0, 0, 0, start[0], start[1], 0);
    let stopTime = new Date(0, 0, 0, stop[0], stop[1], 0);
    let diff = stopTime.getTime() - startTime.getTime();
    // console.log(diff)
    const hours = Math.floor(diff / 3600000);
    //console.log(hours);
    diff = diff - hours * 1000 * 3600;
    const minutes = Math.floor(diff / 60000);
    //console.log(minutes);
    const duration = `${hours}:${minutes}`;

    const time = duration.split(":");
    const timeValue = parseInt(time[0], 10) + parseInt(time[1], 10) / 60;

    const consume = parseFloat(timeValue * consumePerModule[0]).toFixed(2);

    const onCallerEmail = availableUser.filter(
      (x) => x.name === data.onCallName
    );

    const PgRunData = {
      site: search,
      date: data.date,
      moduleCapacity: data.capacity,
      pgStartTime: pgStart,
      pgStoptTime: pgStop,
      pgRunDuration: duration,
      fuelConsume: consume,
      pgNo: data.pgNo,
      onCallName: data.onCallName,
      onCallEmail: onCallerEmail[0].email,
      pgRunnerName: user.displayName,
      pgRunnerEmail: user.email,
      status: "Pending",
      remark: data.remark,
    };
    //console.log(PgRunData);
    fetch("  http://localhost:5000/pgRunData", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(PgRunData),
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          signOut(auth);
          localStorage.removeItem("accessToken");
          navigate("/Login");
        }
        return res.json();
      })
      .then((pgData) => {
        if (pgData.insertedId) {
          toast.success("Data Successfully Update");
        }
        reset();
        setSearch("");
        //console.log(pgData)
      });
  };

  /*  For site list auto suggestion */
  const handleSiteSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchItem = (searchItem) => {
    setSearch(searchItem);
  };

  return (
    <div className="flex  justify-center justify-items-center mt-8">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-3">
            Update PG Run Data!
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Date input field */}

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Date:</span>
              </label>
              <input
                type="date"
                placeholder="Date"
                min={preDate}
                max={today}
                defaultValue={today}
                className="input input-bordered w-full max-w-xs"
                {...register("date", {
                  required: {
                    value: true,
                    message: " Date is required",
                  },
                })}
              />
              <label className="label">
                {errors.date?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.date.message}
                  </span>
                )}
              </label>
            </div>
            {/*  Site ID */}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder="Site ID ( type only number )"
                onChange={handleSiteSearch}
                value={search}
                required
                className="input input-bordered w-full max-w-xs"
              />
              {/*  For site list auto suggestion */}

              <div className=" border-0 rounded-lg w-3/4 max-w-xs mt-2">
                {siteList
                  .filter((item) => {
                    const searchItem = search.toLowerCase();
                    const name1 = item.siteId.toLowerCase();
                    return (
                      searchItem &&
                      name1.includes(searchItem) &&
                      searchItem !== name1
                    );
                  })
                  .slice(0, 10)
                  .map((item, index) => (
                    <ul
                      className="menu p-2 w-52"
                      onClick={() => handleSearchItem(item.siteId)}
                      key={index}
                    >
                      <li className="text-blue-500 hover"> {item.siteId}</li>
                    </ul>
                  ))}
              </div>
              <label className="label"></label>
            </div>
            {/* Rectifier Module Capacity */}
            <div className="form-control w-full max-w-xs">
              {/* <label className="label">
                <span className="label-text">Rectifier Module Capacity:</span>
              </label> */}
              <select
                type="text"
                defaultValue="kw3"
                className="input input-bordered w-full max-w-xs"
                {...register("capacity", {
                  required: {
                    value: true,
                    message: " Module capacity is required",
                  },
                })}
              >
                <option value="">
                  {" "}
                  --------Rectifier's Per Module capacity-------{" "}
                </option>
                {rectifiers?.map((recti) => (
                  <option value={recti.capacity}>{recti.capacity} </option>
                ))}
              </select>
              <label className="label">
                {errors.capacity?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.capacity.message}
                  </span>
                )}
              </label>
            </div>

            {/*  PG Start Time */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">PG Start Time:</span>
              </label>
              <input
                type="time"
                placeholder="startTime"
                className="input input-bordered w-full max-w-xs"
                {...register("startTime", {
                  required: {
                    value: true,
                    message: " Start Time is required",
                  },
                })}
              />
              <label className="label">
                {errors.startTime?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.startTime.message}
                  </span>
                )}
              </label>
            </div>

            {/*  PG Stop Time */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">PG Stop Time:</span>
              </label>
              <input
                type="time"
                placeholder="stopTime"
                className="input input-bordered w-full max-w-xs"
                {...register("stopTime", {
                  required: {
                    value: true,
                    message: " stop Time is required",
                  },
                })}
              />
              <label className="label">
                {errors.stopTime?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.stopTime.message}
                  </span>
                )}
              </label>
            </div>
            {/*  PG NO*/}
            <div className="form-control w-full max-w-xs">
              {/* <label className="label">
                <span className="label-text">PG No:</span>
              </label> */}
              <select
                type="text"
                placeholder="PG Number"
                className="input input-bordered w-full max-w-xs"
                {...register("pgNo", {
                  required: {
                    value: true,
                    message: " PG Number is required",
                  },
                })}
              >
                <option value=""> -------- Select PG No------ </option>
                {PgList?.map((pg) => (
                  <option value={pg.pgNo}>{pg.pgNo}</option>
                ))}
              </select>
              <label className="label">
                {errors.pgNo?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.pgNo.message}
                  </span>
                )}
              </label>
            </div>
            {/*  On Call Engineer  Name */}
            <div className="form-control w-full max-w-xs">
              <select
                type="text"
                placeholder=" On Caller  Name"
                className="input input-bordered w-full max-w-xs"
                {...register("onCallName", {
                  required: {
                    value: true,
                    message: " onCall Name is required",
                  },
                })}
              >
                <option value="">
                  {" "}
                  -------- Select On Caller Name-------{" "}
                </option>
                {availableUser.map((user) => (
                  <option value={user.name}>{user.name} </option>
                ))}
              </select>
              <label className="label">
                {errors.onCallName?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.onCallName.message}
                  </span>
                )}
              </label>
            </div>
            {/* Remarks */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Remark:</span>
              </label>
              <textarea
                type="text"
                placeholder="Write  findings, if found "
                className="input input-bordered w-full max-w-xs"
                {...register("remark")}
              />
            </div>

            <input
              type="submit"
              className="btn btn-accent w-full max-w-xs m-2"
              value="Submit-Data"
              /*   <button className="btn btn-success">Success</button> */
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PgRunUpdate;
