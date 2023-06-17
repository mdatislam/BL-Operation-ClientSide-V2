import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import auth from "../../firebase.init";

const useSiteList = () => {
  const [siteList, setSiteList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("https://backend.bloperation.com/siteInfo", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          //  toast.error("Unauthorize Access")
          signOut(auth);
          localStorage.removeItem("accessToken");
          navigate("/Login");
        }
        return res.json();
      })
      .then((data) => setSiteList(data));
  });

  return [siteList];
};
export default useSiteList;
