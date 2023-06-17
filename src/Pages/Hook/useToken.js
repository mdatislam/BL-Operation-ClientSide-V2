import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";

const UseToken = (user) => {
  const [token, setToken] = useState(" ");
  //const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      //console.log(user);
      const email = user?.user?.email;
      const name = user?.user?.displayName;
      //console.log(email)
      const userInfo = {
        name: name,
        email: email,
      };
      fetch(`https://backend.bloperation.com/user/${email}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userInfo),
      })
        .then((res) => res.json())
        /* .then((res) => {
          if (res.status === 401 || res.status === 403) {
            toast.error("Unauthorize access");

            localStorage.removeItem("accessToken");
            navigate("/Login");
          }
          return res.json();
        }) */
        .then((data) => {
          const accessToken = data.accessToken;
          localStorage.setItem("accessToken", accessToken);
          setToken(accessToken);
          //console.log(data.accessToken);
        });
    }
  });

  return [token];
};
export default UseToken;
