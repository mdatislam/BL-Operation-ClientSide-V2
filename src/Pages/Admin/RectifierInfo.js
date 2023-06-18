import { useQuery } from "@tanstack/react-query";
import React from "react";
import Loading from "../SharedPage/Loading";
import RectifierInfoRows from "./RectifierInfoRows";

const RectifierInfo = () => {
  const { data: rectifiers, isLoading } = useQuery(["rectifierlist"], () =>
    fetch(" http://localhost:5000/rectifier", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => res.json())
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="overflow-x-auto mt-16 px-2">
      <div className="grid h-12 card bg-[#6495ED] rounded-box place-items-center mb-4">
        <h2 className="text-[#ffffff] card-title font-bold ">
          Considering Per Module Consumption
        </h2>
      </div>
      <table className="table-compact  w-96 mx-auto  ">
        <thead>
          <tr className="bg-[#ffcb24] border-2 border-[#ffcb45]">
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Brand</th>
            <th>Capacity</th>
            <th>Consumption</th>
          </tr>
        </thead>
        <tbody>
          {rectifiers?.map((rec) => (
            <RectifierInfoRows key={rec._id} rec={rec} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RectifierInfo;
