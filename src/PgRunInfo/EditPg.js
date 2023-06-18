import { signOut } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../firebase.init";

const EditPg = ({ pgEdit, setPgEdit, refetch }) => {
  const [user] = useAuthState(auth);
  const { pgNo } = pgEdit;
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  let date = new Date();
  date.setDate(date.getDate());
  let today = date.toLocaleDateString("en-CA");

  const onSubmit = (data) => {
    const PgData = {
      pgStatus: data.pgStatus,
      pgDetail: data.faultCause,
      updaterName: user.displayName,
      updaterEmail: user.email,
      date: today,
    };

    fetch(`http://localhost:5000/pgList/${pgNo}`, {
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
        //reset();
        setPgEdit(null);
        refetch();
      });
  };
  return (
    <div>
      <input type="checkbox" id="pgEdit" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="pgEdit"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className=" text-center font-bold text-pink-600 text-xl ">
            Mention Below Query!
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">PG Status:</span>
              </label>
              <select
                type="text"
                placeholder=" PG Status "
                className="input input-bordered w-full max-w-xs"
                {...register("pgStatus", {
                  required: {
                    value: true,
                    message: " PG Status Required",
                  },
                })}
              >
                <option value="Good">Good</option>
                <option value="Faulty">Faulty</option>
                <option value="Partial Faulty">Partial Faulty</option>
              </select>
              <label className="label">
                {errors.pgStatus?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.pgStatus.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control w-full max-w-xs">
              <textarea
                placeholder="Please mention specific faulty Name/part! "
                className="input input-bordered w-full max-w-xs mx-2 "
                {...register("faultCause", {
                  required: {
                    value: true,
                    message: " Fault specific  is required",
                  },
                })}
              />
              <label className="label">
                {errors.rejectMsg?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.rejectMsg.message}
                  </span>
                )}
              </label>
            </div>
            <input
              type="submit"
              className="btn btn-accent w-full max-w-xs m-2"
              /* onClick={() => handlePgEdit(pgEdit)} */
              value="Update-Status"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPg;
