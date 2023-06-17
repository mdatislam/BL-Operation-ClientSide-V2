import React from "react";
import { toast } from "react-toastify";

const DeletePgRun = ({ delPg, refetch, setDelPg }) => {
  const { _id } = delPg;

  const handleDelete = (id) => {
    //console.log(id);
    fetch(
      `https://backend.bloperation.com/

pgRun/${id}`,
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
          toast.success(" Delete done ");
        }
        refetch();
        setDelPg(null);
        // console.log(data)
      });
  };
  return (
    <div>
      <input type="checkbox" id="deletePgRun" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="deletePgRun"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-warning text-lg">Warning!</h3>
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

export default DeletePgRun;
