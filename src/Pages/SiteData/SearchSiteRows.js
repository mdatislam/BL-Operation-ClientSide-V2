import React from "react";

const SearchSiteRows = ({ siteInfo, setSiteDataEdit }) => {
  const {
    siteId,
    shareId,
    lat,
    long,
    priority,
    keyStatus,
    batteryInfo,
    batteryBackup,
    connectedSite,
    rectifierInfo,
    mobileNo1,
    mobileNo2,
    snag,
    unUsed,
    address,
    remark,
  } = siteInfo;
  return (
    <div className="card px-2  rounded-lg mb-3">
      <div className=" w-full bg-base-100 shadow">
        <div className=" px-2 lg:px-8 rounded-lg">
          <h2 className=" bg-sky-100 shadow-lg mb-2 rounded-xl py-2 text-center font-bold text-lg text-pink-600 mt-3">
            Existing Info of {siteId}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-4">
            <div className="col-start-1 col-span-3">
              <div className="stats stats-horizontal shadow-md mt-3">
                <div className="stat">
                  <div className="stat-title">Latitude:</div>
                  <div className="stat-des text-start font-semibold text-[#e02acb]">
                    {lat}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Longitude</div>
                  <div className="stat-des text-start  font-semibold text-[#e02acb]">
                    {long}
                  </div>
                </div>
              </div>

              <div className="stats stats-horizontal shadow-md mt-3">
                <div className="stat ">
                  <div className="stat-title">Priority:</div>
                  <div className="stat-des text-start font-semibold text-[#e02acb]">
                    {priority}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Connected Site</div>
                  <div className="stat-des text-start  font-semibold text-[#e02acb]">
                    {connectedSite}
                  </div>
                </div>
              </div>

              <div className="stats stats-horizontal shadow-md mt-3">
                <div className="stat ">
                  <div className="stat-title">Battery Info:</div>
                  <div className="stat-des text-start font-semibold text-[#e02acb]">
                    {batteryInfo}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Battery Backup</div>
                  <div className="stat-des text-start  font-semibold text-[#e02acb]">
                    {batteryBackup}
                  </div>
                </div>
              </div>
              
            </div>

            <div className="lg:col-start-4 col-span-3">
              <div className="stats stats-vertical shadow-md mt-3">
                <div className="stat">
                  <div className="stat-title">Share Site ID</div>
                  <div className="stat-des text-start  font-semibold text-[#e02acb]">
                    {shareId}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">Rectifier Info</div>
                  <div className="stat-des text-start  font-semibold text-[#e02acb]">
                    {rectifierInfo}
                  </div>
                </div>
                <div className="stat ">
                  <div className="stat-title">Un Used Items:</div>
                  <div className="stat-des text-start font-semibold text-[#e02acb]">
                    {unUsed}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-start-1 col-span-6">
            <div className="stats stats-horizontal shadow-md mt-3">
              <div className="stat ">
                <div className="stat-title">Key Status:</div>
                <div className="stat-des text-start font-semibold text-[#e02acb]">
                  {keyStatus}
                </div>
              </div>
            </div>
          </div>

          <div className="col-start-1 col-span-6">
            <div className="stats stats-horizontal shadow-md mt-3">
              <div className="stat ">
                <div className="stat-title">Mobile No1:</div>
                <div className="stat-des text-start font-semibold text-[#e02acb]">
                  {mobileNo1}
                </div>
              </div>
            </div>
          </div>
          <div className="col-start-1 col-span-6">
            <div className="stats stats-horizontal shadow-md mt-3">
              <div className="stat ">
                <div className="stat-title">Mobile No2:</div>
                <div className="stat-des text-start font-semibold text-[#e02acb]">
                  {mobileNo2}
                </div>
              </div>
            </div>
          </div>
          <div className="col-start-1 col-span-6">
            <div className="stats stats-horizontal shadow-md mt-3">
              <div className="stat ">
                <div className="stat-title">Snag List:</div>
                <div className="stat-des text-start font-semibold text-[#e02acb]">
                  {snag}
                </div>
              </div>
            </div>
          </div>
          <div className="col-start-1 col-span-6">
            <div className="stats stats-horizontal shadow-md mt-3">
              <div className="stat ">
                <div className="stat-title">Address:</div>
                <div className="stat-des text-start font-semibold text-[#e02acb]">
                  {address}
                </div>
              </div>
            </div>
          </div>
          <div className="col-start-1 col-span-6">
            <div className="stats stats-horizontal shadow-md mt-3">
              <div className="stat ">
                <div className="stat-title">Remark:</div>
                <div className="stat-des text-start font-semibold text-[#e02acb]">
                  {remark}
                </div>
              </div>
            </div>
          </div>

          <div className="card-actions justify-center my-4">
            <label
              htmlFor="siteEdit"
              className="btn btn-info btn-sm mt-2"
              onClick={() => setSiteDataEdit(siteInfo)}
            >
              {" "}
              To Edit
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSiteRows;
