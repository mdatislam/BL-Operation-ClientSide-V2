import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmployeeList from './EmployeeList';

const Employee = () => {
  const [employees, setEmployee] = useState([])
   const navigate = useNavigate();
    useEffect(()=>{
        fetch("employee.json")
          .then((res) => {
            if (res.status === 401 || res.status === 403) {
              toast.error("Unauthorize access");

              localStorage.removeItem("accessToken");
              navigate("/Login");
            }
            return res.json();
          })
          .then((data) => {
            //console.log(data)
            setEmployee(data);
          });
    } )
    return (
      <div className="mt-12 bg-slate-100 px-8 mb-4">
        <h1 className="text-[#008282] text-center font-bold text-2xl  py-8">
          {" "}
          Rangpur O&amp;M Tigers:
        </h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 gap-y-4">
          {employees?.map(
            (emp) => (
              (<EmployeeList key={emp._id} emp={emp}></EmployeeList>)
              
            )
          )}
        </div>
      </div>
    );
};

export default Employee;