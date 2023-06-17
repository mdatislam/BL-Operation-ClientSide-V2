import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import auth from '../../firebase.init';
import Loading from '../SharedPage/Loading';
import useAdmin from './../Hook/useAdmin';
import { useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const RequireAdmin = () => {
    const [user,loading] = useAuthState(auth)
    const [admin, adminLoading] = useAdmin(user)
    const location = useLocation()
    if (loading || adminLoading) {
        return <Loading/>
    }

    if (!user || !admin) {
        signOut(auth)
        return <Navigate to="/Login" state={{from:location}} replace></Navigate>
    }

    else {
        return <Outlet/>
    }
};

export default RequireAdmin;