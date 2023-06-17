import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import auth from "./../../firebase.init";
import Loading from "./../SharedPage/Loading";
import UseToken from "./../Hook/useToken";
import PasswordReset from "./PasswordReset";
//import useAdmin from "../Hook/useAdmin";
import loginBack from "../../images/login.png";

const Login = () => {
   const {
     register,
     formState: { errors },
     handleSubmit,
   } = useForm();
  const [password, setPassword] = useState(" ");
  const [signInWithEmailAndPassword, user,loading,error] =
    useSignInWithEmailAndPassword(auth);
 const location = useLocation();
 let from = location.state?.from.pathname || "/";
 const navigate = useNavigate();
  const [token] = UseToken(user);

  if (loading) return <Loading></Loading>;

  let signInError;

  if (error) {
    signInError = (
      <p className="text-red-500">
        <small>{error?.message}</small>
      </p>
    );
  }

  const onSubmit = (data) => {
    //console.log(data);
    signInWithEmailAndPassword(data.email, data.password);
  };

   if (token) {
     navigate(from, { replace: true });
   }

  return (
    <div
      className="hero h-screen bg-base-200 mt-[-30px]"
      style={{ backgroundImage: `url(${loginBack})` }}
    >
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <h1 className="text-2xl font-bold text-center py-2 mt-2">
          {" "}
          Please Login !!
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body mt-[-25px]">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email", {
                  required: {
                    value: true,
                    message: "email is required",
                  },

                  pattern: {
                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                    message: "provide a valid email",
                  },
                })}
              />
              <label className="label">
                {errors.email?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
                {errors.email?.type === "pattern" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </label>
            </div>
            {signInError}
            {/*  password field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password", {
                  required: {
                    value: true,
                    message: "password is required",
                  },

                  minLength: {
                    value: 6,
                    message: "password length must more then 6 charecter",
                  },
                })}
              />
              <label className="label">
                {errors.password?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )}
                {errors.password?.type === "minLength" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </label>

              <div className="flex flex-cols">
                <div>
                  <label
                    htmlFor="reset"
                    className=" btn-link label-text-alt link-hover"
                    onClick={() => setPassword(user.email)}
                  >
                    Reset Password ?
                  </label>
                </div>
              </div>
            </div>
            {signInError}
            <div className="form-control mt-2">
              <input type="submit" className="btn btn-primary" value="Login" />
            </div>
          </div>
        </form>

        {/* <div className="divider mt-[-20px]">OR</div>

        {admin && (
          <div className="hero w-full max-w-sm mb-3">
            <button onClick={() => signInWithGoogle()} className="btn btn-outline">
              Sign with Google
            </button>
          </div>
        )}  */}
      </div>
      {password && <PasswordReset password={password}></PasswordReset>}
    </div>
  );
};

export default Login;
