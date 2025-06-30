// src/pages/LoginPage.jsx

import React, { useState } from "react";
import ImageSlider from "../components/ImageSlider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      console.log("Logged in:", res.data);

      // --- FIX IS HERE: Destructure 'user' and 'access_token' FIRST ---
      const { access_token, user } = res.data;

      localStorage.setItem("token", access_token); // Use the destructured access_token
      localStorage.setItem("user_id", user.id); // Now 'user' is defined and has 'id'
      localStorage.setItem("user", JSON.stringify(user)); // Use the destructured user
      localStorage.setItem("role", user.role); // Use the destructured user.role

      if (user.role === "tenant") {
        toast.success(`Welcome back ${user.fname}`);

        navigate(`/tenant`); // Navigating to /tenant is usually sufficient for the main dashboard
      } else if (user.role === "landlord") {
        toast.success(`Welcome back ${user.fname}`); // Add toast for landlord too
        navigate(`/landlord`);
      } else if (user.role === "admin") {
        toast.success(`Welcome back ${user.fname}`); // Add toast for admin too
        navigate(`/admin`);
      } else if (user.role === "agent") {
        toast.success(`Welcome back ${user.fname}`);
        navigate(`/agent`);
      } else {
        navigate("/"); // Redirect to home
      }
    } catch (err) {
      console.error(
        "The Login failed failed",
        err.response?.data || err.message
      );
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <>
      <div className="bg-[#f7f7ff] font-poppins shadow-md rounded-md mt-28 p-10">
        <div className="grid grid-cols-2 gap-3 p-5 ">
          {/* image */}
          <div>
            <ImageSlider />
            {/* <img src={bb} alt="register" className='w-[10cm] h-[10cm] rounded-md object-cover' /> */}
          </div>

          {/* create account */}
          <div className="">
            <div className="flex flex-col items-center justify-center">
              <h2 className="pb-3">
                Don't have an Account?{" "}
                <Link to="/register" className="text-cyan-300 text-xl">
                  Register
                </Link>{" "}
              </h2>
              <h1 className="mb-3">Login </h1>
              <form onSubmit={Submit} className="flex flex-col gap-3 mt-8">
                <div className="grid grid-cols-2 gap-3"></div>
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Email"
                  className="border border-gray-300 p-2 rounded-md focus:border-blue-300 focus:ring-gray-300 outline-none"
                />
                <input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  className="border border-gray-300 p-2 rounded-md focus:border-blue-300 focus:ring-gray-300 outline-none"
                />
                <button
                  type="submit"
                  className="bg-purple-500 text-white  p-2 rounded-md hover:bg-cyan-300">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
