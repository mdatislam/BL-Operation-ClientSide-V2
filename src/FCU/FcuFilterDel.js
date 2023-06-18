import React from "react";
import { toast } from "react-toastify";

const FcuFilterDel = ({ fcuFilterDel, setFcuFilterDel, refetch }) => {
  const { _id } = fcuFilterDel;
  const handleFcuFilterDelete = (id) => {
    // console.log(id);
    fetch(
      `http://localhost:5000/

fcuFilter/${id}`,
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
          toast.success(` ${id} Delete done`);
        }
        refetch();
        setFcuFilterDel(null);
      });
  };
  return (
    <div>
      <input type="checkbox" id="fcuFilterDel" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="lubOilDel"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className=" text-center font-bold text-red-600 text-2xl ">
            Warning!
          </h3>
          <p className="font-semibold text-xl text-blue-500 mt-4 px-12">
            {" "}
            Are You Sure to Remove this record of FCU Filter?
          </p>

          <div className="modal-action">
            <button
              className="btn btn-outline btn-error"
              onClick={() => handleFcuFilterDelete(_id)}
            >
              {" "}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FcuFilterDel;
