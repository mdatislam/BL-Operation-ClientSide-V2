import React, { useState } from "react";
import UserListRows from "./UserListRows";
//import newUser from "../../images/NewUser.jpg";
import { Link, useNavigate } from "react-router-dom";
import RectifierInfo from "./RectifierInfo";
import ProfileChange from "./ProfileChange";
import Loading from "../SharedPage/Loading";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import auth from "../../firebase.init";
//import useUserList from "../Hook/useUserList";
//import RectifierInfoUpdate from "./RectifierInfoUpdate";

const UserList = () => {
  //const [userList]=useUserList()
  const [profile, setProfile] = useState(" ");

  const navigate = useNavigate();
  const { data: users, isLoading } = useQuery(["list"], () =>
    fetch(" http://localhost:5000/userList", {
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

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="px-2 lg:px-4 my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <div className="overflow-x-auto mt-16 px-2">
          <div className="grid h-12 card bg-[#6495ED] rounded-box place-items-center mb-4">
            <h2 className="text-[#FFFFFF] card-title font-bold ">
              All User List
            </h2>
          </div>
          <table className="table-compact  w-96 mx-auto  ">
            <thead>
              <tr className="bg-[#ffcb24] border-2 border-[#ffcb45]">
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((use) => (
                <UserListRows
                  key={use._id}
                  use={use}
                  setProfile={setProfile}
                ></UserListRows>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 gap-4 ">
          <div className="card w-full bg-base-100 shadow-xl mt-16">
            <div className="card-body">
              <div className="stats stats-vertical lg:stats-horizontal shadow bg-[#6495ED] text-primary-content">
                <div className="stat">
                  <div className="stat-title">To create</div>
                  <div className="stat-value">New user </div>

                  <div className="stat-actions">
                    <Link to="/Signup" className="btn  btn-warning">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                        />
                      </svg>{" "}
                      &nbsp; NEW USER
                    </Link>
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">To Change Rate of</div>
                  <div className="stat-value">Consume</div>
                  <div className="stat-actions">
                    <Link to="/RectifierUpdate" className="btn btn-secondary">
                      Change-Rate
                    </Link>
                  </div>
                </div>
              </div>

              {/* site data & Pending pgRun Approval */}
              <div className="stats stats-vertical lg:stats-horizontal shadow bg-[#191b1f] text-primary-content mt-2">
                <div className="stat">
                  <div className="stat-title">To show & Update </div>
                  <div className="stat-value">Site Data </div>

                  <div className="stat-actions">
                    <Link
                      to="/siteDataUpdate"
                      className="btn btn-secondary mb-2"
                    >
                      Click Me
                    </Link>
                  </div>
                </div>

                <div className="divider lg:divider-horizontal"></div>

                <div className="stat">
                  <div className="stat-title">
                    To View Approval Pending PG Run{" "}
                  </div>
                  <div className="stat-value">Record</div>
                  <div className="stat-actions">
                    <Link to="/PendingPgRun" className="btn btn-secondary mb-2">
                      Go-List
                    </Link>
                  </div>
                </div>
              </div>
              <RectifierInfo />

              {/*  Lub oil Record */}
              <div>Atik</div>
            </div>
          </div>
        </div>
      </div>
      {profile && <ProfileChange profile={profile} setProfile={setProfile} />}
    </div>
  );
};

export default UserList;
