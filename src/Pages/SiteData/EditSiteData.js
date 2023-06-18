import { signOut } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";

const EditSiteData = ({ siteDataEdit, setSiteDataEdit, refetch }) => {
  const [user] = useAuthState(auth);
  const {
    siteId,
    keyStatus,
    rectifierInfo,
    batteryInfo,
    batteryBackup,
    mobileNo1,
    mobileNo2,
    unUsed,
    snag,
    remark,
  } = siteDataEdit;

  //console.log(siteDataEdit)
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  let date = new Date();
  date.setDate(date.getDate());
  let today = date.toLocaleDateString("en-CA");

  const onSubmit = (data) => {
    const updateSiteData = {
      keyStatus: data.keyStatus,
      batteryBackup: data.batteryBackup,
      rectifierInfo: data.rectifierInfo,
      batteryInfo: data.batteryInfo,
      mobileNo1: data.mobileNo1,
      mobileNo2: data.mobileNo2,
      unUsed: data.unUsed,
      snag: data.snag,
      remark: data.remark,
      updaterName: user.displayName,
      updaterEmail: user.email,
      date: today,
    };

    let confrmMsg = window.confirm(
      "Are you Check All Fields ?\n If YES press Ok otherwise Cancel"
    );
    if (confrmMsg) {
      fetch(`http://localhost:5000/siteInfo/${siteId}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updateSiteData),
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
        .then((siteData) => {
          //console.log(pgData);
          if (siteData.upsertedCount || siteData.modifiedCount) {
            toast.success("Data Successfully Update");
          }
          reset();
          setSiteDataEdit(null);

          refetch();
        });
    } else {
      toast.warning("Not update, Please Click All Unchanged field");
    }
  };
  return (
    <div>
      <input type="checkbox" id="siteEdit" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="siteEdit"
            className="btn btn-sm btn-circle btn-error absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className=" text-center font-bold text-pink-600 text-xl mb-4 ">
            Existing Info of {siteId}
          </h3>
          <h5 className="text-red-500 font-bold text-xs mb-2">
            NB:Where data already available & not need to change Please only "
            click" that fields before update.
          </h5>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-3 border-2 border-blue-200 rounded-lg p-3"
          >
            <div className=" form-control mb-3">
              <label className="input-group">
                <span className="font-bold">Key Info:</span>
                <input
                  type="text"
                  defaultValue={keyStatus}
                  autoFocus
                  className="input input-bordered w-full max-w--xs"
                  {...register("keyStatus")}
                />
              </label>
            </div>

            <div className="  input-group mb-3">
              <label className="input-group">
                <span className=" font-bold">Rectifier info:</span>
                <input
                  type="text"
                  defaultValue={rectifierInfo}
                  autoFocus
                  className="input input-bordered w-full max-w--xs"
                  {...register("rectifierInfo")}
                />
              </label>
            </div>

            <div className="flex input-group mb-3">
              <label className="input-group">
                <span className=" font-bold">Battery Info:</span>
                <input
                  type="text"
                  defaultValue={batteryInfo}
                  autoFocus
                  className="input input-bordered w-full max-w--xs"
                  {...register("batteryInfo")}
                />
              </label>
            </div>
            <div className="flex input-group mb-3">
              <label className="input-group">
                <span className=" font-bold">Mobile No_1:</span>
                <input
                  type="text"
                  defaultValue={mobileNo1}
                  className="input input-bordered w-full max-w--xs"
                  {...register("mobileNo1")}
                />
              </label>
            </div>
            <div className="flex input-group mb-3">
              <label className="input-group">
                <span className=" font-bold">Mobile No_2:</span>
                <input
                  type="text"
                  defaultValue={mobileNo2}
                  className="input input-bordered w-full max-w--xs"
                  {...register("mobileNo2")}
                />
              </label>
            </div>

            <div className="flex input-group mb-3">
              <label className="input-group">
                <span className=" font-bold">Battery Backup:</span>
                <input
                  type="text"
                  defaultValue={batteryBackup}
                  className="input input-bordered w-full max-w--xs"
                  {...register("batteryBackup")}
                />
              </label>
            </div>

            <div className="flex input-group mb-3">
              <label className="input-group">
                <span className=" font-bold">UnUsed Items:</span>
                <input
                  type="text"
                  defaultValue={unUsed}
                  className="input input-bordered w-full max-w--xs"
                  {...register("unUsed")}
                />
              </label>
            </div>
            <div className="flex input-group mb-3">
              <label className="input-group">
                <span className=" font-bold">Snags List:</span>
                <textarea
                  type="text"
                  defaultValue={snag}
                  className="input input-bordered w-full max-w--xs"
                  {...register("snag")}
                />
              </label>
            </div>
            <div className="form-control w-full max-w-xs mb-3">
              <label className="input-group">
                <span className=" font-bold">Remark:</span>
                <textarea
                  type="text"
                  defaultValue={remark}
                  placeholder=" Remarks if have"
                  className="input input-bordered w-full max-w--xs "
                  {...register("remark")}
                />
              </label>
            </div>
            <div className="flex flex-row justify-center items-center">
              {
                <input
                  type="submit"
                  className="btn btn-primary btn-sm max-w-xs m-2"
                  /*    onClick={() => handlePgEdit(pgEdit) */
                  value="Update Data"
                />
              }

              <label htmlFor="siteEdit" className="btn btn-sm  btn-error">
                Cancel
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSiteData;
