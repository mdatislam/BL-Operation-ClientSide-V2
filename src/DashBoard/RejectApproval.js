import { signOut } from "firebase/auth";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../firebase.init";

const RejectApproval = ({ reject, setReject, refetch }) => {
  const { _id } = reject;
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data, id) => {
    fetch(`https://backend.bloperation.com/pgRunList/${_id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        status: "Reject",
        remark: data.rejectMsg,
      }),
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
      .then((approveData) => {
        console.log(approveData);
        if (approveData.modifiedCount > 0) {
          toast.info(" Data has been Rejected");
        }
      });

    reset();
    setReject(null);
    refetch();
  };

  return (
    <div>
      <input type="checkbox" id="rejectApproval" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label
            htmlFor="rejectApproval"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center">
              <textarea
                placeholder="Please Put Here Rejection Comment! "
                className="input input-bordered w-full max-w-xs mx-2 "
                {...register("rejectMsg", {
                  required: {
                    value: true,
                    message: " Rejection Cause is required",
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

              <input
                type="submit"
                value="confirm"
                htmlFor="rejectApproval"
                className="btn btn-warning"
                /* onClick={() => handleReject(_id)} */
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RejectApproval;
