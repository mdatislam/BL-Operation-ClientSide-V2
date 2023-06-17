import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loading from "../Pages/SharedPage/Loading";
import background from "../../src/images/bb.jpg";
import { signOut } from "firebase/auth";
import auth from "../firebase.init";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import useSiteList from "./../Pages/Hook/useSiteList";

const DgRefuelingUpdate = () => {
  const [user] = useAuthState(auth);
  const [siteList] = useSiteList();
  const [search, setSearch] = useState("");
  const [imgUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { data: sites, isLoading } = useQuery(["siteList"], () =>
    fetch(" https://backend.bloperation.com/dgRefuelingInfo", {
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
  //console.log(siteList)
  if (isLoading) {
    return <Loading />;
  }

  const handleImageUpload = (event) => {
    setLoading(true);
    const imageFile = event.target.files[0];
    const formData = new FormData();
    formData.set("image", imageFile);
    fetch(
      "https://api.imgbb.com/1/upload?key=1b570ca2c45d58b767860a466c63580e",
      {
        method: "POST",

        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data1) => {
        // console.log(data);
        setImageUrl(data1.data.display_url);
        setLoading(false);
      });
  };
  //console.log(imgUrl)

  const onSubmit = (data) => {
    const siteID = search;
    const presentSite = sites?.filter((site) => site.siteId === siteID);
    //console.log(presentSite)

    const preRhReading = presentSite?.map((s) => s.rhReading);
    const previousFuel = presentSite?.map((s) => s.previousQuantity);
    const previousReFuel = presentSite.map((s) => s.reFuelQuantity);
    const preTotal =
      parseFloat(previousFuel[0]) + parseFloat(previousReFuel[0]);
    const consumption = (
      (preTotal - data.preFuel) /
      (data.rhReading - parseFloat(preRhReading))
    ).toFixed(2);
    const PreDate = presentSite?.map((s) => s.date);
    // console.log(EmPreReading[0])

    const dgRefuelingData = {
      siteId: siteID,
      date: data.date2,
      /*  batterySerialNo: data.dgBatteryNo, */
      rhReading: data.rhReading,
      reFuelQuantity: data.reFuel,
      previousQuantity: data.preFuel,
      previousDate: PreDate[0],
      /*   batteryPreSerialNo: batteryPreSerialNo[0], */
      preRhReading: preRhReading[0],
      preTotalFuel: preTotal,
      consumption,
      updaterName: user.displayName,
      updaterEmail: user.email,
      url: imgUrl,
      remark: data.remark,
    };

    fetch(
      `https://backend.bloperation.com/

dgRefuelingInfo/${siteID}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(dgRefuelingData),
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
      .then((refuelData) => {
        console.log(refuelData);
        if (refuelData.upsertedCount || refuelData.modifiedCount) {
          toast.success("Data Successfully Update");
        }
      });

    /* for posting all refueling data */
    fetch(
      `https://backend.bloperation.com/

dgAllRefueling`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(dgRefuelingData),
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
      .then((refuelData) => {
        console.log(refuelData);
        if (refuelData.insertedId) {
          toast.success(" 2nd Data Successfully Update", {
            position: "top-center",
          });
        }
        setImageUrl("");
        reset();
        setSearch("");
        //console.log(pgData)
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
            to="/DgRefueling"
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
            &nbsp;DG-Refueling List
          </Link>
          <h2 className="text-center text-[#db51f3] text-2xl font-bold mb-3">
            Update DG Refueling Info !!
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
                //defaultValue={vv}
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

            {/*  DG RH Reading*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder=" Refueling DG Run Hour "
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
            {/*  previous Quantity*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                step=".001"
                placeholder="Previous Fuel Quantity"
                className="input input-bordered w-full max-w-xs"
                {...register("preFuel", {
                  required: {
                    value: true,
                    message: " Previous Fuel Quantity required",
                  },
                })}
              />
              <label className="label">
                {errors.preFuel?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.preFuel.message}
                  </span>
                )}
              </label>
            </div>
            {/*  ReFuel Quantity*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                step=".001"
                placeholder="ReFuel Quantity"
                className="input input-bordered w-full max-w-xs"
                {...register("reFuel", {
                  required: {
                    value: true,
                    message: " reFuel Quantity required",
                  },
                })}
              />
              <label className="label">
                {errors.reFuel?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.reFuel.message}
                  </span>
                )}
              </label>
            </div>

            {/* Pic of RH Reading */}
            <div className="form-control w-full max-w-xs">
              <label
                htmlFor="image"
                className={loading ? "btn loading mt-5" : "btn mt-5"}
              >
                Upload-RH-Photo
              </label>
              <input
                id="image"
                type="file"
                className="input input-bordered w-full max-w-xs hidden"
                onChange={handleImageUpload}
              />
            </div>
            <small className=" text-red-500">
              **Don't submit until loading finish,
              <p>if more time take then submit**</p>
            </small>
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
              /*   disabled={!imgUrl ? true : false} */
              value="Submit-Data"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default DgRefuelingUpdate;
