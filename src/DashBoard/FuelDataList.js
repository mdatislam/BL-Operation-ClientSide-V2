import { useQuery } from "@tanstack/react-query";

import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import Loading from "../Pages/SharedPage/Loading";

import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import FuelDataListRow from "./FuelDataListRow";

import { useState } from "react";
import DeleteReceiveFuel from "./DeleteReceiveFuel";
import useAdmin from "../Pages/Hook/useAdmin";

const FuelDataList = () => {
  const [user] = useAuthState(auth);

  const [admin] = useAdmin(user);
  const navigate = useNavigate();
  const [delFuel, setDelFuel] = useState("");

  const {
    data: fuelData,
    isLoading,
    refetch,
  } = useQuery(["list", user], () =>
    fetch(`https://backend.bloperation.com/fuelList?email=${user.email}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        signOut(auth);
        localStorage.removeItem("accessToken");
        navigate("/Login");
      }
      return res.json();
    })
  );

  if (isLoading) {
    return <Loading />;
  }

  const totalFuel = fuelData?.map((fuelValue, index) => {
    const x = parseFloat(fuelValue.fuelQuantity);
    return x;
  });
  const receivedFuel = totalFuel?.reduce(
    (previous, current) => previous + parseFloat(current),
    0
  );

  //setFuel(receivedFuel)
  //console.log(fuel)
  return (
    <div>
      <div className="text-center text-primary text-2xl mt-4 mb-8">
        <h2 className="text-secondary-focus">
          Total Received Fuel: {receivedFuel} Liter
        </h2>
      </div>
      <div className="overflow-x-auto  mt-4">
        <table className="table table-compact w-full border-spacing-2 border border-3 border-slate-600">
          <thead className="border-2 border-[#FFCB24]">
            <tr className="divide-x divide-blue-400 text-center">
              <th>SN</th>
              <th>Date</th>
              <th>Slip No</th>
              <th>PG No</th>
              <th>Site ID</th>
              <th>
                <div>Fuel</div>
                <div>Quantity</div>
              </th>
              <th>
                <div>Fuel</div>
                <div>Receiver</div>
              </th>
              <th>
                <div>Fuel</div>
                <div>Issuer</div>
              </th>
              {admin && <th>Action</th>}
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {fuelData?.map((fuel, index) => (
              <FuelDataListRow
                key={fuel._id}
                fuel={fuel}
                index={index}
                F={receivedFuel}
                setDelFuel={setDelFuel}
                admin={admin}
              ></FuelDataListRow>
            ))}
          </tbody>
        </table>
      </div>
      {delFuel && (
        <DeleteReceiveFuel
          delFuel={delFuel}
          setDelFuel={setDelFuel}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default FuelDataList;
