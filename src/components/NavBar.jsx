import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaWindowClose,
  FaBars,
} from "react-icons/fa";
import { Link, Links, NavLink} from "react-router-dom";
import Button from "./Button";

const NavBar = () => {
  const [hideNav, setHideNav] = useState(false);
  const toggleMenu = () => {
    setHideNav(!hideNav);
  };
  return (
    <>
      <nav className="bg-[#f7f7ff] border-b font-poppins border-cyan-100 top-0 sticky z-50 mx-auto max-w-full px-2 sm:px-6 lg:px-8 shadow-md">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center mr-4">
            <Link to="/">
              <img
                className="h-10 w-auto"
                src="images/logo.png"
                alt="RentEase"
              />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                RentEase
              </span>
            </Link>
            {/* Navigation Links */}
            <div
              className={`${
                hideNav ? "block" : "hidden"
              } fixed top-20 left-0 h-full w-64 bg-white shadow-lg lg:static lg:h-auto lg:w-auto lg:bg-transparent lg:flex lg:items-center lg:space-x-4 lg:shadow-none`}>
              <NavLink
                to="/"
                className="block text-gray-800 lg-text-gray-900 hover:bg-purple-400 hover:text-white  rounded-md px-3 py-2">
                Home
              </NavLink>
              <NavLink
                to="/rentPage"
                className="block text-gray-800  hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
                Rent
              </NavLink>
              <NavLink
                to="/buyPage"
                className="block text-gray-800  hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
                Buy
              </NavLink>
              <NavLink
                to="/managePrope"
                className="block text-gray-800  hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
                Manage Property
              </NavLink>
              <NavLink
                to="/resources"
                className="block text-gray-800  hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
                Resources
              </NavLink>
              <div className="flex flex-col p-3 lg:flex-row    mt-4 lg:mt-0">
               <Link to= '/login'>
               <Button
                  className={
                    "border border-gray-400 p-2  text-purple-500 rounded-md hover:bg-purple-400 mr-4 flex"
                  }
                  textButton={"Login"}
                />
               </Link>

               <Link to='/register'>
               <Button
                  className={
                    "bg-purple-500 text-white border lg:mt-0 mt-4 border-gray-400 p-2 rounded-md hover:bg-purple-400"
                  }
                  textButton={"Register"}
                />
               </Link>
              </div>
            </div>
          </div>

          <div>
            {/* Mobile Menu Icon */}
            <button
              onClick={toggleMenu}
              className="text-gray-900 text-2xl lg:hidden focus:outline-none">
              {hideNav ? <FaWindowClose /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
