import React from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import Loading from "../SharedPage/Loading";

const PasswordReset = ({ password }) => {
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  if (sending) {
    return <Loading />;
  }

  let signInError;
  if (error) {
    signInError = (
      <p className=" text-red-500">
        <small>{error?.message}</small>
      </p>
    );
  }
  const onSubmit = async (data) => {
    const email = data.resetPass;
    await sendPasswordResetEmail(email);
    toast.info(" Password Reset Link send to your provided Email account", {
      position: "top-center",
    });
    reset();
  };

  return (
    <div>
      <input type="checkbox" id="reset" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="reset"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" form-control w-full max-w-xs ">
              <input
                placeholder="Please Put your email ID "
                className="input input-bordered w-full max-w-xs mx-2 "
                {...register("resetPass", {
                  required: {
                    value: true,
                    message: " Email ID is required",
                  },
                })}
              />
              <label className="label">
                {errors.resetPass?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.resetPass.message}
                  </span>
                )}
              </label>

              <input
                type="submit"
                value="Confirm"
                className="btn btn-warning"
              />
            </div>
          </form>
          {signInError}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
