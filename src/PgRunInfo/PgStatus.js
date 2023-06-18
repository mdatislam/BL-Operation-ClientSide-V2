import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Pages/SharedPage/Loading";
import PgStatusRows from "./PgStatusRows";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import { signOut } from "firebase/auth";
import PgDel from "./PgDel";
import EditPg from "./EditPg";
import useAdmin from "../Pages/Hook/useAdmin";

const PgStatus = () => {
  const [user] = useAuthState(auth);
  const [admin] = useAdmin(user);
  const [visible, setVisible] = useState(false);
  const [pgDel, setPgDel] = useState("");
  const [pgEdit, setPgEdit] = useState("");
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
    const PgData = {
      pgNo: data.pgno,
      pgStatus: data.pgCondition,
      pgDetail: data.pgFault,
      updaterName: user.displayName,
      updaterEmail: user.email,
      date: today,
    };

    fetch(`http://localhost:5000/pgList/${data.pgno}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(PgData),
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
      .then((pgData) => {
        //console.log(pgData);
        if (pgData.upsertedCount || pgData.modifiedCount) {
          toast.success("Data Successfully Update");
        }
        reset();
        setVisible(null);
        refetch();
      });
  };
  const {
    data: pgList,
    isLoading,
    refetch,
  } = useQuery(["pgList"], () =>
    fetch(" http://localhost:5000/pgList", {
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

  const goodCondition = pgList?.filter((good) => good.pgStatus === "Good");
  const goodPg = goodCondition?.length;
  const faultyPg = pgList?.length - goodPg;

  return (
    <div className="mt-8 px-4 mb-4">
      <h2 className="grow  bg-[#7fed64] rounded-lg text-center h-12 py-2 align-text-bottom text-lg font-bold text-white">
        Available PG Status.
      </h2>
      {/*  Status Summary */}
      <div className="text-center">
        <div className="stats shadow-lg bg-base-300 mt-4 mb-2">
          <div className="stat text-center">
            <div className="stat-title font-bold">Good Condition</div>
            <div className="stat-value text-primary ">{goodPg}</div>
            <div className="stat-desc">nos</div>
          </div>
          <div className="stat text-center">
            <div className="stat-title font-bold">Faulty</div>
            <div className="stat-value text-error">{faultyPg}</div>
            <div className="stat-desc">nos</div>
          </div>
        </div>
      </div>

      {/* PG Add Part */}
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
          Add PG
        </button>
      </div>
      {visible && (
        <div>
          <div className="card w-full bg-base-300 shadow-xl mt-2">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                {/* PgNo input field */}

                <div className="form-control w-full max-w-xs">
                  <input
                    type="text"
                    placeholder="PG No"
                    className="input input-bordered w-full max-w-xs"
                    {...register("pgno", {
                      required: {
                        value: true,
                        message: " PG NO  is required",
                      },
                    })}
                  />
                  <label className="label">
                    {errors.pgno?.type === "required" && (
                      <span className="label-text-alt text-red-500">
                        {errors.pgno.message}
                      </span>
                    )}
                  </label>
                </div>
                {/*  PG condition */}
                <div className="form-control w-full max-w-xs">
                  <input
                    type="text"
                    placeholder="PG Status good/Faulty"
                    className="input input-bordered w-full max-w-xs"
                    {...register("pgCondition", {
                      required: {
                        value: true,
                        message: " PG condition is required",
                      },
                    })}
                  />
                  <label className="label">
                    {errors.pgCondition?.type === "required" && (
                      <span className="label-text-alt text-red-500">
                        {errors.pgCondition.message}
                      </span>
                    )}
                  </label>
                </div>
                {/* Detail part */}
                <div className="form-control w-full max-w-xs">
                  <textarea
                    type="text"
                    placeholder="Remarks if have"
                    className="input input-bordered w-full max-w-xs"
                    {...register("pgFault")}
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
      <div className="overflow-x-auto  mt-4">
        <table className=" table table-compact  border-spacing-2  border border-3 border-slate-600 ">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400">
              <th className="w-8">SN</th>
              <th className="w-20">Action</th>
              <th className=" w-20">PG NO</th>
              <th className="w-24">Date</th>
              <th className="">Condition</th>

              <th className="w-48">Fault Detail</th>

              <th className="">
                <div>Updated By</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {pgList?.map((pg, index) => (
              <PgStatusRows
                key={pg._id}
                pg={pg}
                index={index}
                refetch={refetch}
                setPgDel={setPgDel}
                setPgEdit={setPgEdit}
                admin={admin}
              />
            ))}
          </tbody>
        </table>
      </div>
      {pgDel && <PgDel pgDel={pgDel} setPgDel={setPgDel} refetch={refetch} />}
      {pgEdit && (
        <EditPg pgEdit={pgEdit} setPgEdit={setPgEdit} refetch={refetch} />
      )}
    </div>
  );
};

export default PgStatus;
