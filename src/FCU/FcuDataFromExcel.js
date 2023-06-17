import React from "react";
import FcuDataFromExcelRow from "./FcuDataFromExcelRow";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import auth from "./../firebase.init";
import * as XLSX from "xlsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FcuDataFromExcel = () => {
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

  excelData?.map((fcuInfo) => {
    const siteID = fcuInfo.siteId;

    const installDate = fcuInfo.installationDate;
    let d = new Date(Math.round((installDate - 25569) * 86400 * 1000));
    let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    let installation = `${da}-${mo}-${ye}`;

    const preDate = fcuInfo.preFilterChangeDate;
    let pre = new Date(Math.round((preDate - 25569) * 86400 * 1000));
    let yPre = new Intl.DateTimeFormat("en", { year: "numeric" }).format(pre);
    let moPre = new Intl.DateTimeFormat("en", { month: "short" }).format(pre);
    let daPre = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(pre);
    let preChangingDate = `${daPre}-${moPre}-${yPre}`;

    const latestDate = fcuInfo.latestFilterChangeDate;
    let PresentDate = new Date(Math.round((latestDate - 25569) * 86400 * 1000));
    let yPresentDate = new Intl.DateTimeFormat("en", {
      year: "numeric",
    }).format(PresentDate);
    let moPresentDate = new Intl.DateTimeFormat("en", {
      month: "short",
    }).format(PresentDate);
    let daPresentDate = new Intl.DateTimeFormat("en", {
      day: "2-digit",
    }).format(PresentDate);
    let PresentChangingDate = `${moPresentDate}-${daPresentDate}-${yPresentDate}`;

    let nextFilterChangeDateMsec = Date.parse(PresentChangingDate);
    //console.log(FilterChangeDateMsec);
    let NextDate = nextFilterChangeDateMsec + 120 * 3600 * 1000 * 24;
    /*     let NextChangingDate = new Date(NextDate).toDateString(); */

    let yNextDate = new Intl.DateTimeFormat("en", {
      year: "numeric",
    }).format(NextDate);
    let moNextDate = new Intl.DateTimeFormat("en", {
      month: "short",
    }).format(NextDate);
    let daNextDate = new Intl.DateTimeFormat("en", {
      day: "2-digit",
    }).format(NextDate);
    let NextChangingDate = `${daNextDate}-${moNextDate}-${yNextDate}`;

    const fcuData = {
      siteId: fcuInfo.siteId,
      office: fcuInfo.office,
      siteType: fcuInfo.siteType,
      coolingSystem: fcuInfo.coolingSystem,
      fcuBrand: fcuInfo.fcuBrand,
      installationDate: installation,
      preFilterChangeDate: preChangingDate,
      latestFilterChangeDate: PresentChangingDate,
      nextPlanDate: NextChangingDate,
    };
    fetch(
      `https://backend.bloperation.com/fcuFilterChangeLatestRecord/${siteID}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(fcuData),
      }
    ).then((res) => {
      if (res.status === 401 || res.status === 403) {
        // toast.error("Unauthorize access");
        signOut(auth);
        localStorage.removeItem("accessToken");
        navigate("/Login");
      }
      return res.json();
    });
    /* .then((fcuData) => {
        //console.log(fcuData);
        if (fcuData.upsertedId || fcuData.modifiedCount) {
          toast.success("Data Successfully Update");
        }
      }); */
    return fcuData;
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
          <h4 className="text-xl text-center font-bold text-pink-600 mt-2">
            **Heading of Excel sheet must contain bellow name without space**
          </h4>
          <div className=" w-3/4 mx-auto border-2 m-4">
            <thead className="">
              <tr className="border-2 divide-x-2 px-4 divide-blue-400 text-start">
                <th>siteId</th>
                <th>office</th>
                <th>siteType</th>
                <th>
                  <div>cooling</div>
                  <div>System</div>
                </th>
                <th>fcuBrand</th>
                <th>
                  <div>installation</div>
                  <div>Date</div>
                </th>
                <th>
                  <div>PreFilter</div>
                  <div>ChangeDate</div>
                </th>
                <th>
                  <div>latestFilter</div>
                  <div>ChangeDate</div>
                </th>
                <th>
                  <div>nextPlan</div>
                  <div>Date</div>
                </th>
                <th>
                  <div>latest </div>
                  <div>Action</div>
                </th>
                <th>fcuCtrl</th>
              </tr>
            </thead>
          </div>

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
          <label className="label"></label>
          {excelFileError && (
            <div
              className="font-bold text-red-600"
              style={{ marginTop: 5 + "px" }}
            >
              {excelFileError}
            </div>
          )}
        </form>

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
                    <th>Office</th>
                    <th>Site Type</th>
                    <th>
                      <div>Cooling</div>
                      <div>System</div>
                    </th>
                    <th>FCU Brand</th>
                    <th>
                      <div>Installation</div>
                      <div>Date</div>
                    </th>
                    <th>
                      <div>Pre Filter</div>
                      <div>Change Date</div>
                    </th>
                    <th>
                      <div>Latest Filter</div>
                      <div>Change Date</div>
                    </th>
                    <th>
                      <div>Next Plan</div>
                      <div>Date</div>
                    </th>
                    <th>
                      <div>Latest </div>
                      <div>Action</div>
                    </th>
                    <th>
                      <div>Setting</div>
                      <div>Check?</div>
                    </th>
                    <th>
                      <div>Updated</div>
                      <div>By</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {excelData?.map((data, index) => (
                    <FcuDataFromExcelRow
                      key={index}
                      data={data}
                      index={index}
                    />
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

export default FcuDataFromExcel;
