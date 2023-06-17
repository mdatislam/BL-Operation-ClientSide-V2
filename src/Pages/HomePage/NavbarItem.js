import React from 'react';
import {  NavLink } from 'react-router-dom';

const NavbarItem = () => {
    return (
      <div className="my-2  mx-2 mb-2 bg-gray-300 rounded-lg">
        <h2 className="text-[#ed38c0e4] text-2xl font-bold text-center py-4">
          Query Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center ">
          {/* 1st Item */}
          <NavLink className="rounded-lg my-4 px-4" to="/Dashboard">
            <div className="card w-64  bg-base-100 shadow-xl   outline-offset-4 outline hover:outline-blue-400 ">
              <div className="card-body">
                <h3 className="card-title text-secondary-focus">
                  To Update Data
                </h3>
                <p>Entry Your New Data</p>
              </div>
            </div>
          </NavLink>

          {/* 2nd item */}
          <NavLink className="rounded-lg my-4 px-4" to="/PgFuel">
            <div className="card w-64  bg-base-100 shadow-xl   outline-offset-4 outline hover:outline-blue-400 ">
              <div className="card-body">
                <h3 className="card-title text-secondary-focus">
                  PG Run & Fuel
                </h3>
                <p>View PG Run & Fuel Info</p>
              </div>
            </div>
          </NavLink>

          {/* 3rd Item */}
          <NavLink className="rounded-lg my-4 px-4" to="/EmInfo">
            <div className="card w-64  bg-base-100 shadow-xl   outline-offset-4 outline hover:outline-blue-400 ">
              <div className="card-body">
                <h3 className="card-title text-secondary-focus">
                  Energy Meter
                </h3>
                <p>View Energy Meter Info</p>
              </div>
            </div>
          </NavLink>
          {/* 9th Item */}
          <NavLink className="rounded-lg my-4 px-4" to="/siteDataHome">
            <div className="card w-64  bg-base-100 shadow-xl   outline-offset-4 outline hover:outline-blue-400 ">
              <div className="card-body">
                <h3 className="card-title text-secondary-focus">
                  Site Data Info
                </h3>
                <p>View & Edit Site Info</p>
              </div>
            </div>
          </NavLink>
          {/* 4th Item */}
          <NavLink className="rounded-lg my-4 px-4" to="/DgServicing">
            <div className="card w-64  bg-base-100 shadow-xl   outline-offset-4 outline hover:outline-blue-400 ">
              <div className="card-body">
                <h3 className="card-title text-secondary-focus">
                  DG Servicing
                </h3>
                <p>View DG Service Info</p>
              </div>
            </div>
          </NavLink>
          {/* 5th Item */}
          <NavLink className="rounded-lg my-4 px-4" to="/DgRefueling">
            <div className="card w-64  bg-base-100 shadow-xl   outline-offset-4 outline hover:outline-blue-400 ">
              <div className="card-body">
                <h3 className="card-title text-secondary-focus">
                  DG Refueling
                </h3>
                <p>To View DG Refueling Info</p>
              </div>
            </div>
          </NavLink>

          {/* 7th Item */}
          <NavLink className="rounded-lg my-4 px-4" to="/DgMaterial">
            <div className="card w-64  bg-base-100 shadow-xl   outline-offset-4 outline hover:outline-blue-400 ">
              <div className="card-body">
                <h3 className="card-title text-secondary-focus">
                  Material Replace
                </h3>
                <p>Material Replacing Record</p>
              </div>
            </div>
          </NavLink>
          {/* 8th Item */}
          <NavLink className="rounded-lg my-4 px-4" to="/FcuMaintenance">
            <div className="card w-64  bg-base-100 shadow-xl   outline-offset-4 outline hover:outline-blue-400 ">
              <div className="card-body">
                <h3 className="card-title text-secondary-focus">
                  FCU Maintenance
                </h3>
                <p>Fcu Filter Change Info</p>
              </div>
            </div>
          </NavLink>
        </div>
        <h2 className="mt-4"> '</h2>
      </div>
    );
};

export default NavbarItem;