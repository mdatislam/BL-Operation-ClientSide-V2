import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";

const usePgList = () => {
  const [PgList, setPgList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("https://backend.bloperation.com/PgList", {
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
      .then((data) => setPgList(data));
  });

  return [PgList];
};
export default usePgList;
