import { signOut } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import auth from "./../../firebase.init";

const NavBar = ({ children }) => {
  const { pathname } = useLocation();
  const [user] = useAuthState(auth);
  //console.log(user)
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth);
    localStorage.removeItem("accessToken");
    navigate("/Login");
  };
  const menuItem = (
    <>
      <li>
        <NavLink className="rounded-lg" to="/Home">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className="rounded-lg" to="/Dashboard">
          Data-Update
        </NavLink>
      </li>
      <li>
        <NavLink className="rounded-lg" to="/PgFuel">
          PG-Fuel-Info
        </NavLink>
      </li>
      <li>
        <NavLink className="rounded-lg" to="/DgInfo">
          DG-Info
        </NavLink>
      </li>

      <li>
        <NavLink className="rounded-lg" to="/EmInfo">
          EM-Info
        </NavLink>
      </li>
      <li>
        {!user ? (
          <NavLink className="rounded-lg" to="/Login">
            Login
          </NavLink>
        ) : (
          <>
            <small>{user.displayName}</small>
            <button onClick={logout} className=" rounded-lg btn-outline">
              LogOut
            </button>
          </>
        )}
      </li>
    </>
  );
  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/*  <!-- Navbar --> */}
          <div className="w-full navbar fixed z-20 bg-[#ffcb24] lg:px-20">
            {pathname.includes("Dashboard") && (
              <label
                htmlFor="dashboard-drawer"
                className="drawer-button lg:hidden btn btn-primary"
              >
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
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                  />
                </svg>
              </label>
            )}
            <div className="flex-1 px-2 mx-2 font-bold text-2xl text-white">
              Rangpur O&amp;M
            </div>
            <div className="flex-none hidden lg:block">
          <ul className="menu menu-horizontal px-5 gap-x-4"> 
          
                {/*  <!-- Navbar menu content here --> */}

                {menuItem}
              </ul>
            </div>
            <div className="flex-none lg:hidden">
              <label for="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
          </div>
          {/*  <!-- Page content here --> */}
          <div className="mt-16">{children}</div>
        </div>
         <div className="drawer-side">
          <label for="my-drawer-3" className="drawer-overlay"></label>
         <ul className="menu p-4 overflow-y-auto w-80 bg-base-100">
        
            {/* <!-- Sidebar content here --> */}
            {menuItem}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
