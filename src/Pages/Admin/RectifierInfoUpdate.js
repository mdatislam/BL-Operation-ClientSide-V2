import { signOut } from "firebase/auth";
import React from "react";
//import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import huawei from "../../images/Huawei.png";

const RectifierInfoUpdate = () => {
  // const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    const brand = data.brand;

    const RectifierInfo = {
      brand,
      capacity: data.capacity,
      consumeFuel: data.consume,
    };
    //console.log(PgRunData);
    fetch(`https://backend.bloperation.com/rectifier?brand=${brand}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(RectifierInfo),
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
      .then((rectifierData) => {
        console.log(rectifierData);
        if (rectifierData.upsertedCount || rectifierData.modifiedCount) {
          toast.success("Data Successfully Update");
        }
        reset();
        //console.log(pgData)
      });
  };
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <figure className="px-10 pt-10">
          <img src={huawei} alt="PG Pic" className="rounded-xl" />
        </figure>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="text-center text-2xl font-bold mb-3">
              Add Rectifier Info !
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Brand input field */}

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Brand:</span>
                </label>
                <input
                  type="text"
                  placeholder="Put Rectifier Brand"
                  className="input input-bordered w-full max-w-xs"
                  {...register("brand", {
                    required: {
                      value: true,
                      message: " Brand is required",
                    },
                  })}
                />
                <label className="label">
                  {errors.brand?.type === "required" && (
                    <span className="label-text-alt text-red-500">
                      {errors.date.message}
                    </span>
                  )}
                </label>
              </div>

              {/* Rectifier Module Capacity */}
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Module Capacity:</span>
                </label>
                <input
                  type="text"
                  placeholder="Put Module capacity"
                  className="input input-bordered w-full max-w-xs"
                  {...register("capacity", {
                    required: {
                      value: true,
                      message: " Module capacity is required",
                    },
                  })}
                >
                  {/* {availableUser.map((user) => (
                  <option value={user.name}>{user.name} </option>
                ))} */}
                </input>
                <label className="label">
                  {errors.capacity?.type === "required" && (
                    <span className="label-text-alt text-red-500">
                      {errors.capacity.message}
                    </span>
                  )}
                </label>
              </div>
              {/* Consumption  */}

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Consumption:</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="any"
                  placeholder="Consumption per Module"
                  className="input input-bordered w-full max-w-xs"
                  {...register("consume", {
                    required: {
                      value: true,
                      message: " consumption value is required",
                    },
                  })}
                />
                <label className="label">
                  {errors.consume?.type === "required" && (
                    <span className="label-text-alt text-red-500">
                      {errors.date.message}
                    </span>
                  )}
                </label>
              </div>

              <input
                type="submit"
                className="btn btn-accent w-full max-w-xs m-2"
                value="Submit-Info"
                /*   <button className="btn btn-success">Success</button> */
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RectifierInfoUpdate;
