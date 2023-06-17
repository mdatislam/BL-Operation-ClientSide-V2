import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../firebase.init";
import Loading from "../Pages/SharedPage/Loading";
import background from "../../src/images/bb.jpg";
import useSiteList from "./../Pages/Hook/useSiteList";

const EMDataUpdate = () => {
  const [user] = useAuthState(auth);
  const [siteList] = useSiteList();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  /*  const [preEmNo, setPreEmNo]= useState("")
  const [preReading, setPreReading]= useState("")
    */
  const [imgUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { data: sites, isLoading } = useQuery(["siteList"], () =>
    fetch("https://backend.bloperation.com/emInfo", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => res.json())
  );
  // console.log(services)
  if (isLoading) {
    return <Loading />;
  }
  //console.log(preEmNo)

  const handleImageUpload = (event) => {
    setLoading(true);
    const imageFile = event.target.files[0];
    const formData = new FormData();
    formData.set("image", imageFile);
    fetch(
      "https://api.imgbb.com/1/upload?key=f84c57341c651748792aeb7c4d477c29",
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

  /*  const image = data.image[0];
        const formData = new FormData();
        formData.append('image', image);
        const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(res=>res.json())
        .then(result =>{
            if(result.success){
                const img = result.data.url; */
  const onSubmit = (data) => {
    //console.log(" click me");
    const siteID = search;
    const presentSite = sites.filter((site) => site.siteId === siteID);
    //console.log(presentSite)

    const EmPreReading = presentSite.map((s) => s.EmReading);
    const EmPreSerialNo = presentSite.map((s) => s.EmSerialNo);
    const PreDate = presentSite.map((s) => s.date);
    // console.log(EmPreReading[0])

    const EMData = {
      siteId: siteID,
      date: data.date2,
      EmSerialNo: data.emNo,
      EmReading: data.emReading,
      preDate: PreDate[0],
      EmPreSerialNo: EmPreSerialNo[0],
      EmPreReading: EmPreReading[0],
      peakReading: data.peak,
      offPeakReading: data.offPeak,
      loadCurrent: data.loadCurrent,
      updaterName: user.displayName,
      updaterEmail: user.email,
      url: imgUrl,
      remark: data.remark,
    };

    fetch(`https://backend.bloperation.com/emInfo/${siteID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(EMData),
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
      .then((emData) => {
        console.log(emData);
        if (emData.upsertedCount || emData.modifiedCount) {
          toast.success("Data Successfully Update");
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
            to="/EmInfo"
            className="btn btn-outline btn-primary font-semiBold text-xl mb-2"
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
            Back &nbsp; EM info List
          </Link>
          <h2 className="text-center text-secondary-focus text-2xl font-bold mb-3">
            Update Energy Meter Info !!
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

            {/* Load Current */}
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                placeholder="Site's DC Load Current"
                className="input input-bordered w-full max-w-xs"
                {...register("loadCurrent", {
                  required: {
                    value: true,
                    message: " Load Current is required",
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

            {/*  EM serial No */}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder=" Energy Meter Serial No"
                className="input input-bordered w-full max-w-xs"
                {...register("emNo", {
                  required: {
                    value: true,
                    message: " Energy Meter Serial No required",
                  },
                })}
              />
              <label className="label">
                {errors.emNo?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.emNo.message}
                  </span>
                )}
              </label>
            </div>

            {/*  Energy Meter Reading*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                step=".001"
                placeholder=" Put Total Meter Reading "
                className="input input-bordered w-full max-w-xs"
                {...register("emReading", {
                  required: {
                    value: true,
                    message: " Energy Meter Total Reading Required",
                  },
                })}
              />
              <label className="label">
                {errors.emReading?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.emReading.message}
                  </span>
                )}
              </label>
            </div>
            {/*  Energy Meter Peak Reading*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                placeholder=" Put Peak Reading if have "
                className="input input-bordered w-full max-w-xs"
                {...register("peak")}
              />
              <label className="label"></label>
            </div>
            {/*  Energy Meter offPeak Reading*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                placeholder="Put OffPeak Reading if have"
                className="input input-bordered w-full max-w-xs"
                {...register("offPeak")}
              />
              <label className="label"></label>
            </div>
            {/* Pic of EM Reading */}
            <div className="form-control w-full max-w-xs">
              <label
                htmlFor="image"
                className={loading ? "btn  loading  mt-5" : "btn  mt-5"}
              >
                Upload-Photo
              </label>
              <small className=" text-red-500">
                **Don't submit until loading finish,
                <p>if more time take then submit**</p>
              </small>
              <input
                id="image"
                type="file"
                className="input input-bordered w-full max-w-xs hidden"
                onChange={handleImageUpload}
              />
            </div>

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
              /* disabled={!imgUrl ? true : false} */
              value="Submit-Data"
              /*   <button className="btn btn-success">Success</button> */
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EMDataUpdate;
