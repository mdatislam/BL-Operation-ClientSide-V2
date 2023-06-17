import React from "react";

import auth from "./../../firebase.init";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from './../SharedPage/Loading';

const RequireAuth = () => {
  const [user, loading] = useAuthState(auth);
    const location = useLocation();
    
    if(loading){ return <Loading/>}
  if (!user) {
     return <Navigate to="/Login" state={{ from: location }}></Navigate>;
  }
  return <Outlet/>;
};

export default RequireAuth;
