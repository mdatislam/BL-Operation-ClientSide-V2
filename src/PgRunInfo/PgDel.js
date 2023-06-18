import React from "react";
import { toast } from "react-toastify";

const PgDel = ({ pgDel, setPgDel, refetch }) => {
  const { pgNo } = pgDel;
  const handlePgDelete = (pgNo) => {
    //console.log(pgNo);
    fetch(
      `http://localhost:5000/

pgList/${pgNo}`,
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
          toast.success(` ${pgNo} Delete done`);
        }
        refetch();
        setPgDel(null);
      });
  };
  return (
    <div>
      <input type="checkbox" id="pgDel" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="pgDel"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className=" text-center font-bold text-red-600 text-2xl ">
            Warning!
          </h3>
          <p className="font-semibold text-xl text-blue-500 mt-4 px-12">
            {" "}
            Are You Sure to Remove This PG ?
          </p>

          <div className="modal-action">
            <button
              className="btn btn-outline btn-error"
              onClick={() => handlePgDelete(pgNo)}
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

export default PgDel;
