import React from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from "react-firebase-hooks/auth";
import auth from './../../firebase.init';
import Loading from "../SharedPage/Loading";
import { toast } from "react-toastify";
import useToken from './../Hook/useToken';

const SignUp = () => {

    const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
   const [updateProfile, updating, uError] = useUpdateProfile(auth);
  const {
    register,
    formState: { errors },
    handleSubmit,reset
  } = useForm();
  const navigate=useNavigate()
  
const [token] = useToken(user)
    
    if (loading || updating) {
      return <Loading />;
  }
  
   let signInError;
   if (error || uError) {
     signInError = (
       <p className=" text-red-500">
         <small>
           {error?.message || uError?.message}
         </small>
       </p>
     );
   }

    const onSubmit =async (data) => {
        console.log(data);
        const name = data.name
        const password= data.password
        const email = data.email
      await createUserWithEmailAndPassword(email, password);
       await updateProfile({ displayName:name });
      toast.success(`user ${name} successfully done`);
      reset()
      
  };
  
  if (token) {
    navigate('/Home')
  }
    
    
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <h1 className="text-2xl font-bold text-center py-2 mt-2">
          Register Here!
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body mt-[-20px]">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="your name"
                className="input input-bordered"
                {...register("name", {
                  required: {
                    value: true,
                    message: "name is required",
                  },
                })}
              />
              <label className="label">
                {errors.name?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </label>
            </div>
            {/*   email field */}
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
              <label className="label">
                <p className="label-text-alt text-primary font-bold">
                  Have account ?
                  <Link to="/Login" className="label-text-alt link link-hover">
                    &nbsp; Go Login
                  </Link>
                </p>
              </label>
            </div>
            {signInError}
            <div className="form-control mt-2">
              <input
                type="submit"
                className="btn btn-primary"
                value="Register"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
