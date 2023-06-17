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

const FcuFilterChange = () => {
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
    fetch("https://backend.bloperation.com/fcuFilterChangeLatestRecord", {
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
  // console.log(sites)
  if (isLoading) {
    return <Loading />;
  }

  const handleImageUpload = (event) => {
    setLoading(true);
    const imageFile = event.target.files[0];
    const formData = new FormData();
    formData.set("image", imageFile);
    fetch(
      "https://api.imgbb.com/1/upload?key=035305de2b8938534ebaad927c214018",
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
    const currentDate = data.date2;
    let PresentDate = new Date(currentDate);
    //console.log(PresentDate);
    const PresentChangingDate = new Date(PresentDate).toDateString();
    /*   let yPresentDate = new Intl.DateTimeFormat("en", {
      year: "numeric",
    }).format(PresentDate);
    let moPresentDate = new Intl.DateTimeFormat("en", {
      month: "short",
    }).format(PresentDate);
    let daPresentDate = new Intl.DateTimeFormat("en", {
      day: "2-digit",
    }).format(PresentDate);
    let PresentChangingDate = `${moPresentDate}-${daPresentDate}-${yPresentDate}`; */

    /*  next FCU filter change date calculation */

    let nextFilterChangeDateMsec = Date.parse(PresentChangingDate);
    //console.log(FilterChangeDateMsec);
    let NextDate = nextFilterChangeDateMsec + 120 * 3600 * 1000 * 24;
    /*  const NextChangingDate = new Date(NextDate).toDateString(); */
    let yNextDate = new Intl.DateTimeFormat("en", {
      year: "numeric",
    }).format(NextDate);
    let moNextDate = new Intl.DateTimeFormat("en", {
      month: "short",
    }).format(NextDate);
    let daNextDate = new Intl.DateTimeFormat("en", {
      day: "2-digit",
    }).format(NextDate);
    let NextChangingDate = `${daNextDate}-${moNextDate}-${yNextDate}`;

    const siteID = search;
    const presentSite = sites?.filter((site) => site.siteId === siteID);
    //console.log(presentSite)

    const PreDate = presentSite.map((s) => s.latestFilterChangeDate);

    const fcuFilterChangeData = {
      siteId: siteID,
      latestFilterChangeDate: PresentChangingDate,
      fcuBrand: data.fcuBrand,
      fcuFilterStatus: data.fcuFilter,
      fcuCtrl: data.fcuCtrl,
      preFilterChangeDate: PreDate[0],
      nextPlanDate: NextChangingDate,
      updaterName: user.displayName,
      updaterEmail: user.email,
      url: imgUrl,
      remark: data.remark,
    };

    fetch(`https://backend.bloperation.com/fcuFilterChangeAllRecord`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(fcuFilterChangeData),
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          // toast.error("Unauthorize access");
          signOut(auth);
          localStorage.removeItem("accessToken");
          navigate("/Login");
        }
        return res.json();
      })
      .then((dgData) => {
        //console.log(dgData);
        if (dgData.insertedId) {
          toast.success("Data Post Successfully");
        }
      });

    fetch(
      `https://backend.bloperation.com/fcuFilterChangeLatestRecord/${siteID}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(fcuFilterChangeData),
      }
    )
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          // toast.error("Unauthorize access");
          signOut(auth);
          localStorage.removeItem("accessToken");
          navigate("/Login");
        }
        return res.json();
      })
      .then((fcuData) => {
        //console.log(fcuData);
        if (fcuData.upsertedCount || fcuData.modifiedCount) {
          toast.success("Data Successfully Update");
        }
        setImageUrl("");
        reset();
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
      className="flex justify-center justify-items-center bg-no-repeat bg-bottom bg-fixed bg-blue-500"
      /* style={{ backgroundImage: `url(${background})` }} */
    >
      <div className="card  lg:w-96 bg-base-100 shadow-2xl my-8">
        <div className="card-body">
          <Link
            to="/FcuMaintenance"
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
            &nbsp;FCU Update List
          </Link>
          <h2 className="text-center text-secondary-focus text-2xl font-bold mt-3">
            Update FCU Status !!
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Date input field */}

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Date:</span>
              </label>
              <input
                type="date"
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

            {/*  FCU Brand */}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder=" Fcu Brand"
                className="input input-bordered w-full max-w-xs"
                {...register("fcuBrand", {
                  required: {
                    value: true,
                    message: " Fcu Brand required",
                  },
                })}
              />
              <label className="label">
                {errors.fcuBrand?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.fcuBrand.message}
                  </span>
                )}
              </label>
            </div>

            {/* Filter status */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Filter Status:</span>
              </label>
              <select
                type="text"
                className="input input-bordered w-full max-w-xs"
                {...register("fcuFilter", {
                  required: {
                    value: true,
                    message: "Fcu filter  Status required",
                  },
                })}
              >
                <option value="">-------- Select Status -------</option>
                <option value="Clean"> Clean</option>
                <option value="Replace">Replace</option>
              </select>
              <label className="label">
                {errors.fcuFilter?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.fcuFilter.message}
                  </span>
                )}
              </label>
            </div>

            {/* ctrl Setting check */}

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Controller Setting:</span>
              </label>
              <select
                type="text"
                className="input input-bordered w-full max-w-xs"
                {...register("fcuCtrl", {
                  required: {
                    value: true,
                    message: "Fcu controller setting",
                  },
                })}
              >
                <option value="">------ Ctrl Checking Status ----</option>
                <option value="Yes"> Yes</option>
                <option value="No">No</option>
              </select>
              <label className="label">
                {errors.fcuCtrl?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.fcuCtrl.message}
                  </span>
                )}
              </label>
            </div>

            {/* Pic of FCU Filter */}
            <div className="form-control w-full max-w-xs">
              <label
                htmlFor="image"
                className={loading ? "btn loading mt-5" : "btn mt-5"}
              >
                Upload-FCU Filter Pic
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
              /*  disabled={!imgUrl ? true : false} */
              value="Submit-Data"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default FcuFilterChange;
