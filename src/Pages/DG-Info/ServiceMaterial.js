import React, { useState } from "react";

import ServiceMaterialRow from "./ServiceMaterialRow";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "./../../firebase.init";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../SharedPage/Loading";

const ServiceMaterial = () => {
  const [user] = useAuthState(auth);
  const [visible, setVisible] = useState(false);
  const [lubOilDel, setLubOilDel] = useState([]);
  //const [admin] = useAdmin(user);
  const navigate = useNavigate();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  let date = new Date();
  date.setDate(date.getDate());
  let today = date.toLocaleDateString("en-CA");

  const onSubmit = (data) => {
    const lubOil = {
      receivingDate: data.receiveDate,
      receivingQuantity: data.receiveQuantity,
      requisitionDate: data.requiDate,
      requisitionQuantity: data.requiQuantity,
      remark: data.remark,
      updaterName: user.displayName,
      updaterEmail: user.email,
      date: today,
    };

    fetch(`https://backend.bloperation.com/lubOil`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(lubOil),
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
      .then((lubOil) => {
        //console.log(lubOil);
        if (lubOil.insertedCount) {
          toast.success("Data Successfully Update");
        }
        reset();
        setVisible(null);
        refetch();
      });
  };

  const {
    data: LubOilRecord,
    isLoading,
    refetch,
  } = useQuery(["LubOilRecord"], () =>
    fetch(" https://backend.bloperation.com/lubOil", {
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
  //console.log(LubOilRecord);

  /*  All DG service record */
  const { data: dgAllServiceInfo, isLoading2 } = useQuery(
    ["DgAllInfoList"],
    () =>
      fetch(" https://backend.bloperation.com/dgAllServiceInfo", {
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
  if (isLoading || isLoading2) {
    return <Loading />;
  }

  const LubOil = LubOilRecord?.map((quantity) => quantity.receivingQuantity);
  const totalLubOil = LubOil?.reduce(
    (previous, current) => previous + parseFloat(current),
    0
  );

  /*   const max = Math.max(...LubOilRecord);
 const index = LubOilRecord.indexOf(max);
 console.log(index); */

  const totalServicing = dgAllServiceInfo?.length;
  const totalConsumeLubOil = parseInt(totalServicing * 10);
  const Balance = (totalLubOil - totalConsumeLubOil) / 5;

  return (
    <div className="px-2 lg:px-4 my-4">
      <div className="grid grid-cols-1  md:grid-cols-3 gap-x-4">
        <div className=" col-span-2 overflow-x-auto mt-8 px-2">
          <div className="grid h-12 card bg-[#6495ED] rounded-box place-items-center mb-4">
            <h2 className="text-[#FFFFFF] card-title font-bold ">
              Lub-Oil Receiving Record.
            </h2>
          </div>
          <table className="table table-compact w-full ">
            <thead className="border-2 border-[#aef688]">
              <tr className="divide-x divide-blue-400 text-center">
                <th>S/N</th>
                <th>Action</th>
                <th>
                  <div>Mailing</div>
                  <div> Date</div>
                </th>
                <th>
                  <div>Requisition</div>
                  <div> Quantity</div>
                </th>
                <th>
                  <div>Receiving</div>
                  <div> Date</div>
                </th>
                <th>
                  <div>Receiving</div>
                  <div> Quantity</div>
                </th>

                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {LubOilRecord.map((lubOil, index) => (
                <ServiceMaterialRow
                  key={lubOil._id}
                  lubOil={lubOil}
                  index={index}
                  setLubOilDel={setLubOilDel}
                />
              ))}
            </tbody>
          </table>
          {/* {lubOilDel && (
            <LubOilDel
              lubOilDel={lubOilDel}
              setLubOilDel={setLubOilDel}
              refetch={refetch}
            />
          )} */}
        </div>
        {/* 2nd Part */}
        <div className="mt-8 order-first md:order-last">
          <div className="grid h-12 card bg-[#c264ed] rounded-box place-items-center mb-4">
            <h2 className="text-[#FFFFFF] card-title font-bold ">
              Service Material Calculation
            </h2>
          </div>
          <div className="stat-actions">
            <button
              className="btn btn-sm btn-outline btn-primary"
              onClick={() => setVisible(true)}
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Lub-Oil
            </button>
          </div>

          {visible && (
            <div>
              <div className="card w-full bg-base-300 shadow-xl mt-2">
                <div className="card-body">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {/* 1st part of grid */}
                      <div>
                        {/* Receive Date input field */}

                        <div className="form-control w-full max-w-xs">
                          <label className="label">
                            <span className="label-text">Receiving Date:</span>
                          </label>
                          <input
                            type="date"
                            placeholder="Receive Date"
                            className="input input-bordered w-full max-w-xs"
                            {...register("receiveDate", {
                              required: {
                                value: true,
                                message: " Receive Date required",
                              },
                            })}
                          />
                          <label className="label">
                            {errors.receiveDate?.type === "required" && (
                              <span className="label-text-alt text-red-500">
                                {errors.receiveDate.message}
                              </span>
                            )}
                          </label>
                        </div>
                        {/*  Receive Quantity */}
                        <div className="form-control w-full max-w-xs">
                          <input
                            type="text"
                            placeholder="Receive quantity"
                            className="input input-bordered w-full max-w-xs"
                            {...register("receiveQuantity", {
                              required: {
                                value: true,
                                message: " Receive Quantity is required",
                              },
                            })}
                          />
                          <label className="label">
                            {errors.receiveQuantity?.type === "required" && (
                              <span className="label-text-alt text-red-500">
                                {errors.receiveQuantity.message}
                              </span>
                            )}
                          </label>
                        </div>
                      </div>
                      {/* 2nd part of grid */}
                      <div>
                        {/* Requisition Date input field */}

                        <div className="form-control w-full max-w-xs">
                          <label className="label">
                            <span className="label-text">
                              Requisition Date:
                            </span>
                          </label>
                          <input
                            type="date"
                            placeholder="Requisition Date"
                            className="input input-bordered w-full max-w-xs"
                            {...register("requiDate")}
                          />
                          <label className="label"></label>
                        </div>
                        {/*  email Quantity */}
                        <div className="form-control w-full max-w-xs">
                          <input
                            type="text"
                            placeholder="Requi quantity"
                            className="input input-bordered w-full max-w-xs"
                            {...register("requiQuantity")}
                          />
                          <label className="label"></label>
                        </div>
                      </div>
                    </div>
                    {/* Remark part */}
                    <div className="form-control w-full max-w-xs">
                      <textarea
                        type="text"
                        placeholder="Remarks if have"
                        className="input input-bordered w-full max-w-xs"
                        {...register("remark")}
                      />
                      <label className="label"></label>
                    </div>

                    <div className="flex gap-x-4 justify-items-center">
                      <input
                        type="submit"
                        className="btn btn-sm btn-outline btn-info w-24 "
                        value="ADD"
                      />
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => setVisible(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* calculation part */}
          <div className="text-center">
            <div className=" mt-3 bg-primary text-primary-content stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Total Lub-Oil</div>
                <div className="stat-value">{totalLubOil}</div>
                <div className="stat-desc">Liter</div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Service</div>
                <div className="stat-value">{totalServicing}</div>
                <div className="stat-desc">sites</div>
              </div>

              <div className="stat">
                <div className="stat-title">Balance</div>
                <div className="stat-value">{Balance}</div>
                <div className="stat-desc">Can</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMaterial;
