import React from "react";
import { Link } from "react-router-dom";
import pic from "../../images/404.png";

const NotFound = () => {
  return (
    <div
      className="hero h-screen rounded-box"
      style={{ backgroundImage: `url(${pic})` }}
    >
      <div className="hero-overlay bg-opacity-30"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md text-red-600">
          <h1 className="mb-5 text-3xl font-bold">404 ! Page Not Found !</h1>
          <p className="mb-5 text-xl font-bold">
            Look like, Page doesn't Exist
          </p>
          <Link to="/Home" className="btn btn-primary">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
