import React, { useState } from "react";
import FetchExcelTableRow from "./FetchExcelTableRow";
import * as XLSX from "xlsx";
import { signOut } from "firebase/auth";
import auth from "../../firebase.init";
import { Link, useNavigate } from "react-router-dom";

const FetchExcelToJson = () => {
  // const [admin]=useAdmin()
  // on change states
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);

  // submit
  const [excelData, setExcelData] = useState(null);
  // it will contain array of objects
  // console.log(excelData);
  const navigate = useNavigate();
  // handle File
  const fileType = ["application/vnd.ms-excel"];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      //console.log(selectedFile.type);
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          setExcelFile(e.target.result);
        };
      } else {
        setExcelFileError("Please select only .xls file types");
        setExcelFile(null);
      }
    } else {
      console.log("plz select your excel file");
    }
  };

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    } else {
      setExcelData(null);
    }
  };

  excelData?.map((siteInfo) => {
    const siteID = siteInfo.siteId;
    //console.log(siteID);

    const siteData = {
      siteId: siteInfo.siteId,
      lat: siteInfo.lat,
      long: siteInfo.long,
      priority: siteInfo.priority,
      shareId: siteInfo.shareId,
      keyStatus: siteInfo.keyStatus,
      batteryInfo: siteInfo.batteryInfo,
      batteryBackup: siteInfo.batteryBackup,
      rectifierInfo: siteInfo.rectifierInfo,
      connectedSite: siteInfo.connectedSite,
      mobileNo1: siteInfo.mobileNo1,
      mobileNo2: siteInfo.mobileNo2,
      address: siteInfo.address,
    };
    fetch(`http://localhost:5000/siteInfo/${siteID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(siteData),
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        // toast.error("Unauthorize access");
        signOut(auth);
        localStorage.removeItem("accessToken");
        navigate("/Login");
      }
      return res.json();
    });
    /*  .then((dgData) => {
        //console.log(dgData);
        if (dgData.upsertedCount || dgData.modifiedCount) {
          toast.success("Data Successfully Update");
        }
       
      }); */
    return siteData;
  });

  return (
    <>
      <div className="my-4 h-screen px-2">
        <form className="px-2" autoComplete="off" onSubmit={handleSubmit}>
          <label>
            <h5 className="bg-[#28c843df] flex justify-center items-center text-white text-xl font-bold h-12 mt-4 p-4 rounded-lg">
              Upload Excel file
            </h5>
          </label>
          <div className="flex flex-row gap-x-4 justify-start items-center">
            <div className="form-control w-full max-w-xs  mt-4">
              <input
                type="file"
                onChange={handleFile}
                required
                className="input input-bordered w-full max-w-xs py-2"
              />
            </div>

            <button type="submit" className="btn btn-primary mt-2">
              Submit
            </button>
          </div>
          <label className="label">
            <span className="label-text font-bold text-warning">
              **File Type Should (.xls)**
            </span>
          </label>
          {excelFileError && (
            <div
              className="font-bold text-red-600"
              style={{ marginTop: 5 + "px" }}
            >
              {excelFileError}
            </div>
          )}
        </form>
        {/*  To show Existing Site Data */}
        <Link to="/siteData">
          <button className="btn btn-wide btn-success">
            TO show Existing Site data
          </button>
        </Link>

        <h5 className="flex justify-center items-center text-white text-xl font-bold h-12 mt-4 p-4 rounded-lg bg-[#6e3790] px-2">
          View Excel file
        </h5>
        <div className=" text-center font-bold ">
          {excelData === null && <>No file selected</>}
          {excelData !== null && (
            <div className="overflow-x-auto  mt-4">
              <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
                <thead className="border-2 border-[#FFCB24]">
                  <tr className="divide-x divide-blue-400 text-center">
                    <th>SNo</th>
                    <th>Site ID</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Priority</th>
                    <th>
                      <div>Share Site</div>
                      <div>Code</div>
                    </th>
                    <th>Key Status</th>
                    <th>
                      <div>Connected</div>
                      <div>Site</div>
                    </th>
                    <th>
                      <div>Battery</div>
                      <div>Info</div>
                    </th>
                    <th>
                      <div>Battery</div>
                      <div>Backup</div>
                    </th>
                    <th>
                      <div>Rectifier</div>
                      <div>Info</div>
                    </th>
                    <th>MobileNo-1</th>
                    <th>MobileNo-2</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {excelData?.map((data, index) => (
                    <FetchExcelTableRow key={index} data={data} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Existing stie data upload code */}
    </>
  );
};

export default FetchExcelToJson;
