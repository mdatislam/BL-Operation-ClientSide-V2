import React from "react";
import FuelBalance from "../DashBoard/FuelBalance";
import PG from "../../src/images/PG.jpg";
import { Link } from "react-router-dom";
import PgStatus from "./PgStatus";

const PgFuel = () => {
  return (
    <div className="px-2 lg:px-8 my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
        <div className="lg:card w-full bg-base-100 shadow-xl">
          <div className="lg:card-body">
            {/*  <h2 className="card-title">Card title!</h2> */}
            <div className="grid h-12 card bg-[#6495ED] rounded-box place-items-center mb-4">
              <h2 className=" card-title font-bold text-white">
                Fuel Balance Summary
              </h2>
            </div>
            <FuelBalance />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-4 ">
          <div className="">
            <div className=" text-primary-content flex flex-col lg:flex-row gap-y-4 lg:gap-x-4">
              <div className="stat bg-[#6495ED] rounded-lg  ">
                <div className="stat-value">To Show</div>
                <div className="stat-title text-white font-bold"> All PG Run List </div>

                <div className="stat-actions">
                  <Link to="/AllPgRunList" className="btn btn-md btn-outline text-white ">
                   Click Here
                  </Link>
                </div>
              </div>

              <div className="stat bg-[#6492ed] rounded-lg ">
                <div className="stat-value">To Show</div>
                <div className="stat-title">Issued Fuel List</div>
                <div className="stat-actions flex  gap-x-2">
                  <Link to="/AllFuelList" className="btn btn-md btn-outline text-white">
                    Updated_Own
                  </Link>
                  <Link
                    to="/AllFuelListOncall"
                    className="btn btn-md btn-outline btn-warning"
                  >
                    Updated_Oncall
                  </Link>
                </div>
              </div>
            </div>
            <div className="card w-full bg-base-100 shadow-xl">
              {/* <figure className="px-10 pt-10">
              <img
                src={PG}
                alt="PG Pic"
                className="rounded-xl"
              />
            </figure> */}
              <PgStatus />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PgFuel;
