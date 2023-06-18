import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../firebase.init";
import Loading from "../Pages/SharedPage/Loading";

const FuelUpdateOncall = () => {
  const [user] = useAuthState(auth);
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
  /*  today find code */
  let date = new Date();
  date.setDate(date.getDate());
  let today = date.toLocaleDateString("en-CA");

  const availableUser = users?.filter((u) => u.name !== user.displayName);

  const onSubmit = (data) => {
    const receive = users?.filter((x) => x.name === data.fuelReceiver);

    const fuelData = {
      date: data.date,
      slipNo: data.slipNo,
      fuelQuantity: data.fuel,
      fuelIssuer: user.displayName,
      fuelIssuerEmail: user.email,
      fuelReceiverName: data.fuelReceiver,
      fuelReceiverEmail: receive[0].email,
      remark: data.remark,
    };

    //console.log(receive);
    fetch("http://localhost:5000/fuelDataOncall", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(fuelData),
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          toast.error("Unauthorize access");
          signOut(auth);
          localStorage.removeItem("accessToken");
          navigate("/Login");
        }

        return res.json();
      })
      .then((fuelData) => {
        //console.log(fuelData)
        if (fuelData.insertedId) {
          toast.success("Fuel Data Successfully Update");
        } else if (fuelData.msg) {
          toast.error(`Warning: ${fuelData.msg}`);
        }
        reset();

        //console.log(pgData)
      });
  };

  return (
    <div className="flex  justify-center justify-items-center mt-8">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="text-center text-accent text-2xl font-bold mb-3">
            Update Issued Fuel Info!
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
            {/*  Slip No */}
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                placeholder=" Fuel Slip No"
                className="input input-bordered w-full max-w-xs"
                {...register("slipNo", {
                  required: {
                    value: true,
                    message: " Slip No is required",
                  },
                })}
              />
              <label className="label">
                {errors.slipNo?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.slipNo.message}
                  </span>
                )}
              </label>
            </div>

            {/*  Fuel Quantity*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder="Fuel Quantity"
                className="input input-bordered w-full max-w-xs"
                {...register("fuel", {
                  required: {
                    value: true,
                    message: " Fuel Quantity required",
                  },
                })}
              />
              <label className="label">
                {errors.fuel?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.fuel.message}
                  </span>
                )}
              </label>
            </div>

            {/*  Fuel Receiver  Name */}
            <div className="form-control w-full max-w-xs">
              <select
                type="text"
                placeholder=" Fuel Issuer Name"
                className="input input-bordered w-full max-w-xs"
                {...register("fuelReceiver", {
                  required: {
                    value: true,
                    message: " Fuel Receiver Name required",
                  },
                })}
              >
                <option value="">
                  {" "}
                  -------- Select Fuel Receiver Name-------{" "}
                </option>
                {availableUser.map((user) => (
                  <option value={user.name}>{user.name} </option>
                ))}
              </select>
              <label className="label">
                {errors.fuelReceiver?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.fuelReceiver.message}
                  </span>
                )}
              </label>
            </div>
            {/* Remarks */}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder=" Write Remark if have"
                className="input input-bordered w-full max-w-xs"
                {...register("remark")}
              />
              <label className="label"></label>
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

export default FuelUpdateOncall;
