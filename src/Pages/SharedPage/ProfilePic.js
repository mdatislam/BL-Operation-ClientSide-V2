import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
//import useUserList from "../Hook/useUserList";
import Loading from "./Loading";

const ProfilePic = () => {
  const [user] = useAuthState(auth);
  //const [userList] = useUserList();

  const navigate = useNavigate();
  const { data: users, isLoading } = useQuery(["List", user], () =>
    fetch(
      `http://localhost:5000/userList/users?email=${user.email}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    ).then((res) => {
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
  //console.log(users);

  return (
    <div className="py-2 flex flex-col  justify-center items-center bg-slate-400 px-4 rounded-lg">
      {user && (
        <div className="avatar">
          <figure className="w-32">
            {users?.map((p) => (
              <img
                src={p.url}
                className="rounded-lg"
                alt="Profile Pic download problem"
              />
            ))}
          </figure>
        </div>
      )}
      <h2 className="font-bold">{user.displayName}</h2>
    </div>
  );
};

export default ProfilePic;
