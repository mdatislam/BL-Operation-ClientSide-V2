import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../firebase.init";
import usePgList from "../Pages/Hook/usePgList";
import Loading from "../Pages/SharedPage/Loading";
//import useAdmin from "./../Pages/Hook/useAdmin";
import useSiteList from "./../Pages/Hook/useSiteList";

const FuelUpdate = () => {
  const [user] = useAuthState(auth);
  const [siteList] = useSiteList();
  const [search, setSearch] = useState("");
  //const [admin] = useAdmin(user);
  const [PgList] = usePgList();
  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { data: users, isLoading } = useQuery(["userList", user], () =>
    fetch("http://localhost:5000/userList", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
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
  /*  today find code */
  let date = new Date();
  date.setDate(date.getDate());
  let today = date.toLocaleDateString("en-CA");

  const availableUser = users?.filter((u) => u.name !== user.displayName);

  const onSubmit = (data) => {
    /* const fuelIssuer = availableUser.filter((x) => x.name === data.fuelIssuer);
     */
    /*  let x = [];
    if (admin) {
      x.push(data.fuelReceiver);
      x.push(data.fuelReceiverEmail);
    } else {
      x.push(user.displayName);
      x.push(user.email);
    }
 */
    //console.log(x)
    const fuelData = {
      siteId: search,
      date: data.date,
      slipNo: data.slipNo,
      pgNo: data.pgNo,
      vehicleNo: data.carNo,
      fuelQuantity: data.fuel,
      fuelIssuer: data.fuelIssuer,
      fuelReceiverName: user.displayName,
      fuelReceiverEmail: user.email,
      /*   //fuelIssuerEmail: fuelIssuer[0].email,
      // fuelReceiverName: x[0],
      //fuelReceiverEmail: x[1], */
      remark: data.remark,
    };

    //console.log(fuelData);
    fetch("http://localhost:5000/fuelData", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(fuelData),
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
      .then((fuelData) => {
        if (fuelData.insertedId) {
          toast.success("Fuel Data Successfully Update");
        } else if (fuelData.msg) {
          toast.error(`Warning: ${fuelData.msg}`);
        }
        reset();
        setSearch("");
        //console.log(pgData)
      });
  };

  /*  For site list auto suggestion */
  const handleSiteSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchItem = (searchItem) => {
    setSearch(searchItem);
  };
  return (
    <div className="flex  justify-center justify-items-center mt-8">
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="text-center text-secondary-focus text-2xl font-bold mb-3">
            Update Receive Fuel Info!
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Date input field */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Date:</span>
              </label>
              <input
                type="date"
                placeholder="Date"
                defaultValue={today}
                className="input input-bordered w-full max-w-xs"
                {...register("date", {
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
            {/*  Slip Name */}
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                placeholder=" Fuel Slip No"
                className="input input-bordered w-full max-w-xs"
                {...register("slipNo", {
                  required: {
                    value: true,
                    message: " Slip No is required",
                  },
                })}
              />
              <label className="label">
                {errors.slipNo?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.slipNo.message}
                  </span>
                )}
              </label>
            </div>
            {/*  PG No */}
            <div className="form-control w-full max-w-xs">
              <select
                type="text"
                placeholder=" PG Number "
                className="input input-bordered w-full max-w-xs"
                {...register("pgNo", {
                  required: {
                    value: true,
                    message: " PG No Required",
                  },
                })}
              >
                <option value=""> --------Select PG No-------------- </option>
                {PgList?.map((pg) => (
                  <option value={pg.pgNo}>{pg.pgNo}</option>
                ))}
              </select>
              <label className="label">
                {errors.pgNo?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.pgNo.message}
                  </span>
                )}
              </label>
            </div>
            {/* Vehicle No */}
            <div className="form-control w-full max-w-xs">
              <select
                type="text"
                className="input input-bordered w-full max-w-xs"
                {...register("carNo", {
                  required: {
                    value: true,
                    message: " Vehicle No Required",
                  },
                })}
              >
                <option value=""> --------Select vehicle No-------- </option>
                <option value="11-7415">11-7415</option>
                <option value="13-5629">13-5629</option>
                <option value="15-2171">15-2171</option>
                <option value="13-0233">13-0233</option>
                <option value="11-0201">11-0201</option>
                <option value="02-4608">02-4608</option>

                {/* {PgList?.map((pg) => (
                  <option value={pg.pgNo}>{pg.pgNo}</option>
                ))} */}
              </select>
              <label className="label">
                {errors.pgNo?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.pgNo.message}
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
            {/*  Fuel Quantity*/}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder="Fuel Quantity"
                className="input input-bordered w-full max-w-xs"
                {...register("fuel", {
                  required: {
                    value: true,
                    message: " Fuel Quantity required",
                  },
                })}
              />
              <label className="label">
                {errors.fuel?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.fuel.message}
                  </span>
                )}
              </label>
            </div>
            {/*  On Fuel receiver   Name */}

            {/*  {admin && (
              <div className="form-control w-full max-w-xs">
                <select
                  type="text"
                  placeholder=" Fuel Receiver Name"
                  className="input input-bordered border-purple-600 border-4 w-full max-w-xs"
                  {...register("fuelReceiver")}
                >
                  <option value="">
                    {" "}
                    --------Select Fuel Receiver Name-------{" "}
                  </option>
                  {users.map((user) => (
                    <option value={user.name}>{user.name} </option>
                  ))}
                </select>
                <label className="label"></label>
              </div>
            )}  */}

            {/*  On Fuel receiver email */}

            {/* {admin && (
              <div className="form-control w-full max-w-xs">
                <select
                  type="text"
                  placeholder=" Fuel Receiver Name"
                  className="input input-bordered border-purple-600 border-4 w-full max-w-xs"
                  {...register("fuelReceiverEmail")}
                >
                  <option value="">
                    {" "}
                    --------Select Receiver email-------{" "}
                  </option>
                  {users.map((user) => (
                    <option value={user.email}>{user.email} </option>
                  ))}
                </select>
                <label className="label"></label>
              </div>
            )}
              */}

            {/*  On Call Engineer  Name */}
            <div className="form-control w-full max-w-xs">
              <select
                type="text"
                placeholder=" Fuel Issuer Name"
                className="input input-bordered w-full max-w-xs"
                {...register("fuelIssuer", {
                  required: {
                    value: true,
                    message: " Fuel Issuer Name required",
                  },
                })}
              >
                <option value="">
                  {" "}
                  -------- Select On Caller Name-------{" "}
                </option>
                {availableUser.map((user) => (
                  <option value={user.name}>{user.name} </option>
                ))}
              </select>
              <label className="label">
                {errors.fuelIssuer?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.fuelIssuer.message}
                  </span>
                )}
              </label>
            </div>
            {/* Remarks */}
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                placeholder=" Write Remark if have"
                className="input input-bordered w-full max-w-xs"
                {...register("remark")}
              />
              <label className="label"></label>
            </div>
            <input
              type="submit"
              className="btn btn-accent w-full max-w-xs m-2"
              value="Submit-Data"
              /*   <button className="btn btn-success">Success</button> */
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default FuelUpdate;
