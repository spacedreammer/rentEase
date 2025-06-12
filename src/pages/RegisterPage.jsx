import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const Submit = async (e)=>{
    e.preventDefault();
    try{
      const res = await axios.post('http://127.0.0.1:8000/api/auth/register', {
        fname,
        lname,
        email,
        password
      });

      console.log('Registered:', res.data);
      localStorage.setItem('token', res.data.access_token); 
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const { access_token, user } = res.data;

      if (user.role === 'tenant') {
        toast.success(`Welcome ${user.fname}`);
        navigate(`/tenant/${user.id}`);
      } else if (user.role === 'landlord') {
        navigate(`/landlord/${user.id}`);
      } else if (user.role === 'agent') {
        navigate(`/agent/${user.id}`);
      }
      else {
        navigate('/'); // Redirect to home 
      }
    } catch(err){
      console.error("The registration failed", err.response?.data || err.message);
    }
  }
  return (
    <>
      <div className="bg-[#f7f7ff] w-[2/3] font-poppins shadow-md rounded-md mt-28 p-10">
        <div className="grid grid-cols-2 gap-3 p-5 w-[1/2] ">
          {/* image */}
          <div>
            <ImageSlider />
            {/* <img src={bb} alt="register" className='w-[10cm] h-[10cm] rounded-md object-cover' /> */}
          </div>

          {/* create account */}
          <div className="">
            <div className="flex flex-col items-center justify-center">
              <h2 className="pb-3">
                Already have an Account?{" "}
                <Link to="/login" className="text-cyan-300 text-xl">
                  Login
                </Link>{" "}
              </h2>
              <h1 className="mb-3">Create an account</h1>
              <form onSubmit={Submit} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={fname}
                    onChange={e=> setfname(e.target.value)}  
                    name='fname'
                    placeholder="First Name"
                    className="border focus:border-blue-300 focus:ring-gray-300 outline-none border-gray-300 p-2 rounded-md"
                  />
                  <input
                    type="text"
                    value={lname}
                    name='lname'
                    onChange={e=> setlname(e.target.value)}
                    placeholder="Last Name"
                    className="border border-gray-300 p-2 focus:border-blue-300 focus:ring-gray-300 outline-none rounded-md"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e=> setEmail(e.target.value)}
                  name='email'
                  placeholder="Email"
                  className="border border-gray-300 p-2 rounded-md focus:border-blue-300 focus:ring-gray-300 outline-none"
                />
                <input
                  type="password"
                  value={password}
                  name='password'
                  onChange={e=> setPassword(e.target.value)}
                  placeholder="Password"
                  className="border border-gray-300 p-2 rounded-md focus:border-blue-300 focus:ring-gray-300 outline-none"
                />
                <button
                  type="submit"
                  className="bg-purple-500 text-white  p-2 rounded-md hover:bg-cyan-300">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
