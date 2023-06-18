import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import background from "../../src/images/bb.jpg";
import { signOut } from "firebase/auth";
import auth from "../firebase.init";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import useSiteList from "./../Pages/Hook/useSiteList";

const DgUseMaterial = () => {
  const [user] = useAuthState(auth);
  const [siteList] = useSiteList();
  const [search, setSearch] = useState("");
  const [isBattery, setIsBattery] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [material, setMaterial] = useState("");
  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleMaterialUpdate = (event) => {
    setIsBattery(null);
    setIsOther(null);
    event.preventDefault();
    const MaterialName = event.target.value;
    if (MaterialName === "DG Battery") {
      setIsBattery(true);
    } else if (MaterialName === " ") {
      setIsOther(true);
    } else {
      setIsBattery(false);
      setIsOther(false);
    }
    //console.log(MaterialName)
    setMaterial(MaterialName);
  };

  const onSubmit = (data) => {
    const useDgMaterial = {
      siteId: search,
      date: data.date2,
      material: material,
      oldBatterySerialNo: data.oldBatteryNo,
      newBatterySerialNo: data.newBatteryNo,
      other: data.other,
      rhReading: data.rhReading,
      updaterName: user.displayName,
      updaterEmail: user.email,
      remark: data.remark,
    };

    fetch(
      `http://localhost:5000/

dgMaterialInfo/`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(useDgMaterial),
      }
    )
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          toast.error("Unauthorize access");
          signOut(auth);
          localStorage.removeItem("accessToken");
          navigate("/Login");
        }
        return res.json();
      })
      .then((dgData) => {
        console.log(dgData);
        if (dgData.insertedId) {
          toast.success("Data Successfully Update");
        }
        setMaterial("");
        reset();
        setSearch("");
      });
  };

  /*  today find code */
  let date = new Date();
  date.setDate(date.getDate());
  let today = date.toLocaleDateString("en-CA");

  /*  For site list auto suggestion */
  const handleSiteSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchItem = (searchItem) => {
    setSearch(searchItem);
  };

  return (
    <div
      className="flex justify-center justify-items-center bg-no-repeat bg-bottom bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="card  lg:w-96 bg-base-100 shadow-2xl my-8">
        <div className="card-body">
          <Link
            to="/DgMaterial"
            className="btn  btn-primary font-semiBold text-xl mb-2"
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
            &nbsp; Back to Materials List
          </Link>
          <h2 className="text-center text-secondary-focus text-2xl font-bold mb-3">
            Update Use DG Material
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Date input field */}

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Date:</span>
              </label>
              <input
                type="date"
                // disabled
                defaultValue={today}
                className="input input-bordered w-full max-w-xs"
                {...register("date2", {
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

            {/* Name of Use Materials */}
            <div className="form-control w-full max-w-xs">
              <select
                className="input input-bordered w-full max-w-xs"
                type="text"
                name="material"
                placeholder=" select Use material "
                onChange={handleMaterialUpdate}
              >
                <option value="MC-100A">MC-100A</option>
                <option value="MC-80A">MC-80A</option>
                <option value="MC-60A">MC-60A</option>
                <option value="Timer">Timer</option>
                <option value="DG Battery">DG Battery</option>
                <option value="RVD Timer">RVD Timer</option>
                <option value="Relay">Relay</option>
                <option value=" ">Other</option>
              </select>
              <label className="label"></label>
            </div>

            {/*  DG new Battery serial No */}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                hidden={!isBattery}
                placeholder=" New DG Battery Serial No"
                className="input input-bordered input-secondary w-full max-w-xs"
                {...register("newBatteryNo")}
              />
              <label className="label"></label>
            </div>
            {/*  DG old Battery serial No */}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                hidden={!isBattery}
                placeholder=" Old DG Battery Serial No"
                className="input input-bordered input-secondary w-full max-w-xs"
                {...register("oldBatteryNo")}
              />
              <label className="label"></label>
            </div>
            {/*  Other type Material */}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                hidden={!isOther}
                placeholder=" Write Material Name "
                className="input input-bordered input-secondary w-full max-w-xs"
                {...register("other")}
              />
              <label className="label"></label>
            </div>

            {/*  DG RH Reading*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder=" If applicable, present DG RunHour,  "
                className="input input-bordered w-full max-w-xs"
                {...register("rhReading", {
                  required: {
                    value: true,
                    message: " DG servicing RH Required",
                  },
                })}
              />
              <label className="label">
                {errors.rhReading?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.rhReading.message}
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
                placeholder="Write purpose of using"
                className="input input-bordered w-full max-w-xs"
                {...register("remark")}
              />
            </div>

            <input
              type="submit"
              className="btn btn-accent w-full max-w-xs m-2"
              value="Submit-Data"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default DgUseMaterial;
