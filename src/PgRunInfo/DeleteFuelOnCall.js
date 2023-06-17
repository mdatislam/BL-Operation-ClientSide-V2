import React from "react";
import { toast } from "react-toastify";

const DeleteFuelOnCall = ({ delFuel, refetch, setDelFuel }) => {
  const { _id } = delFuel;

  const handleDelete = (id) => {
    //console.log(id);
    fetch(
      `https://backend.bloperation.com/onCall/

receivedFuel/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          toast.success(" Delete successfully done ");
        }
        refetch();
        setDelFuel(null);

        // console.log(data)
      });
  };
  return (
    <div>
      <input type="checkbox" id="deleteFuel" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="deleteFuel"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-warning text-lg  text-center">
            Warning!
          </h3>
          <p className="py-4 font-bold text-2xl text-red-500">
            Are You Sure to Delete it ?
          </p>
          <div className="modal-action">
            <button onClick={() => handleDelete(_id)} className="btn btn-error">
              Confirm!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFuelOnCall;
