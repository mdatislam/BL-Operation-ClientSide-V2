import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import auth from "../../firebase.init";
//import ProfilePic from "./ProfilePic";

const Navbar2 = () => {
  const [user] = useAuthState(auth);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth);
    localStorage.removeItem("accessToken");
    navigate("/Login");
  };
  const menuItem = (
    <>
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
        <NavLink className="rounded-lg" to="/EmInfo">
          EM-Info
        </NavLink>
      </li>
    </>
  );

  const dgSubMenu = (
    <div className="dropdown dropdown-hover">
      <li tabIndex={0}>
        <p to="" className="justify-between">
          DG-Info
          <svg
            className="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
          </svg>
        </p>
      </li>
      <ul
        tabIndex={0}
        className=" p-2 shadow menu menu-compact dropdown-content bg-[#eceef3] rounded-box w-52"
      >
        <li>
          <NavLink to="/DgServicing">DG SerVicing</NavLink>
        </li>
        <li>
          <NavLink to="DgRefueling">Latest DG Refueling</NavLink>
        </li>
        <li>
          <NavLink to="DgMaterial">DG Materials</NavLink>
        </li>
        <li>
          <NavLink to="AllRefueling">
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
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
            All Refueling
          </NavLink>
        </li>
      </ul>
    </div>
  );

  return (
    <div className=" navbar  sticky top-0  z-20 bg-[#ffcb24]  text-lg lg:px-4">
      <div className="navbar-end px-2">
        {/* <div className=" flex-1 px-2 mx-2 font-bold text-2xl text-white">
          <h3 className="md:hidden"> Rangpur O&amp;M</h3>
        </div> */}
        {pathname.includes("Dashboard") && (
          <label
            htmlFor="dashboard-drawer"
            className="drawer-button  lg:hidden btn btn-primary"
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

        <ul className="menu ">
          <li>
            <NavLink className="rounded-lg" to="/Home">
              Home
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-start hidden lg:flex justify-between">
        <ul className="menu  menu-horizontal">
          {menuItem}
          {dgSubMenu}
        </ul>
      </div>
      <ul className="menu px-2">
        <li>
          {!user ? (
            <NavLink className="rounded-lg" to="/Login">
              Login
            </NavLink>
          ) : (
            <button onClick={logout} className=" rounded-lg">
              LogOut
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </button>
          )}
        </li>
      </ul>
      {/*  <ProfilePic/> */}
      {/* For mobile device */}
      <div className="navbar-end">
        <div className="dropdown dropdown-end px-2">
          <label tabIndex={0} className="btn btn-ghost  lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-56"
          >
            {menuItem}
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
              <input type="checkbox" className="peer" />
              <div className="collapse-title">
                DG Part
              </div>
              <div className="collapse-content bg-base-100 text-primary-content peer-checked:bg-base-100 peer-checked:text-black rounded-lg">
                <li>
                  <NavLink to="/DgServicing">DG SerVicing</NavLink>
                </li>
                <li>
                  <NavLink to="DgRefueling">Latest DG Refueling</NavLink>
                </li>
                <li>
                  <NavLink to="DgMaterial">DG Materials</NavLink>
                </li>
                <li>
                  <NavLink to="AllRefueling">
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
                        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                    All Refueling
                  </NavLink>
                </li>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar2;
