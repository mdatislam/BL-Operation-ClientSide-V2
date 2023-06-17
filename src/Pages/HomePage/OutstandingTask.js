import React, { useState } from "react";

const OutstandingTask = () => {
  let presentDate = new Date("2022-11-10")
  const planDate = new Date(presentDate.setDate(presentDate.getDate() + 10)).toDateString()
  
  const [date,setDate]= useState("")
  
  const handle = (e) => {

    const x = e.target.value
  setDate(x)
    
  }
    console.log(date);
  const d= new Date(date).toDateString()
  return (
    <div className="mb-24 mx-24 h">
      <input type="date" className="input input-bordered w-full max-w-xs"
      onChange={handle}/>
      {planDate}
      <h5> {d}</h5>
      
    </div>
  );
};

export default OutstandingTask;

/* import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import YTVideo from "./YTVideo";

const userData = [
  { name: "Jeevan" },
  { name: "Manish" },
  { name: "Prince" },
  { name: "Arti" },
  { name: "rahul" }
];

 function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(userData);
  }, []);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = users.map((user) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
    } else {
      let tempUser = users.map((user) =>
        user.name === name ? { ...user, isChecked: checked } : user
      );
      setUsers(tempUser);
    }
  };

  return (
    <div className="container my-4" style={{ width: "500px" }}>
      <form className="form w-100">
        <h3>Select Users</h3>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="allSelect"
            // checked={
            //   users.filter((user) => user?.isChecked !== true).length < 1
            // }
            checked={!users.some((user) => user?.isChecked !== true)}
            onChange={handleChange}
          />
          <label className="form-check-label ms-2">All Select</label>
        </div>
        {users.map((user, index) => (
          <div className="form-check" key={index}>
            <input
              type="checkbox"
              className="form-check-input"
              name={user.name}
              checked={user?.isChecked || false}
              onChange={handleChange}
            />
            <label className="form-check-label ms-2">{user.name}</label>
          </div>
        ))}
      </form>
      <YTVideo embedId="mGV9r0wgCrI" />
    </div>
  );
}

export default App; */