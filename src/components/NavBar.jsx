import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast for logout message

const Navbar = () => {
  // Assuming you store token and role in localStorage upon login
  const isAuthenticated = localStorage.getItem('token') ? true : false;
  const currentUserRole = localStorage.getItem('role'); // e.g., 'tenant', 'landlord', 'admin'

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Clear role too
    toast.info("You have been logged out successfully!");
    // Redirect to home or login page
    window.location.href = '/'; // Simple hard refresh/redirect for now
  };

  return (
    <nav className="bg-[#f7f7ff] border-b font-poppins border-cyan-100 top-0 sticky z-50 mx-auto max-w-full  px-2 p-8 sm:px-6 lg:px-8 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">RentEase</Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>

          {isAuthenticated && currentUserRole === 'tenant' && (
            <Link to="/tenant-dashboard" className="hover:text-gray-300">My Tours</Link>
          )}

          {isAuthenticated && currentUserRole === 'landlord' && (
            <Link to="/landlord-dashboard" className="hover:text-gray-300">My Properties</Link>
          )}

          {/* Profile link - can be conditional based on role or a generic "Profile" */}
          {isAuthenticated && currentUserRole === 'tenant' &&(
            <Link to='/tenant-profile' className="hover:text-gray-300">
              Profile
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// // src/components/NavBar.jsx
// import React, { useState, useEffect } from "react"; // <-- Make sure useEffect is imported
// import {
//   FaWindowClose,
//   FaBars,
// } from "react-icons/fa";
// import { Link, NavLink } from "react-router-dom"; // Make sure NavLink is imported
// import Button from "./Button";
// import { useAuth } from '../context/AuthContext'; // <--- THIS IS THE CRITICAL IMPORT

// const NavBar = () => {
//   const [hideNav, setHideNav] = useState(false);
//   // --- CALL THE useAuth HOOK HERE ---
//   const { isAuthenticated, user, logout } = useAuth(); // <--- THIS IS THE CRITICAL LINE

//   // --- ADD THESE CONSOLE LOGS FOR DEBUGGING ---
//   useEffect(() => {
//     console.log("NavBar rendered:");
//     console.log("  isAuthenticated:", isAuthenticated);
//     console.log("  User:", user);
//     if (isAuthenticated) {
//       console.log("  Welcome message should be visible!");
//     } else {
//       console.log("  Login/Register buttons should be visible!");
//     }
//   }, [isAuthenticated, user]); // Re-run when these values change
//   // --- END CONSOLE LOGS ---


//   const toggleMenu = () => {
//     setHideNav(!hideNav);
//   };

//   return (
//     <>
//       <nav className="bg-[#f7f7ff] border-b font-poppins border-cyan-100 top-0 sticky z-50 mx-auto max-w-full px-2 sm:px-6 lg:px-8 shadow-md">
//         <div className="flex h-20 items-center justify-between">
//           {/* Logo Section */}
//           <div className="flex items-center"> {/* Removed mr-4 from this div, as it's not clear what it was for with the Link inside */}
//             <Link to="/" className="flex items-center"> {/* Added flex items-center to align image and text */}
//               <img
//                 className="h-10 w-auto"
//                 src="images/logo.png"
//                 alt="RentEase"
//               />
//               {/* Corrected text color from white to gray-800 to be visible on light bg */}
//               <span className="hidden md:block text-gray-800 text-2xl font-bold ml-2">
//                 RentEase
//               </span>
//             </Link>
//           </div>

//           {/* Navigation Links and Buttons */}
//           <div className="flex items-center space-x-4"> {/* Added this wrapper div for alignment */}
//             <div
//               className={`${
//                 hideNav ? "block" : "hidden"
//               } fixed top-20 left-0 h-full w-64 bg-white shadow-lg lg:static lg:h-auto lg:w-auto lg:bg-transparent lg:flex lg:items-center lg:space-x-4 lg:shadow-none`}>
//               <NavLink
//                 to="/"
//                 className="block text-gray-800 lg-text-gray-900 hover:bg-purple-400 hover:text-white  rounded-md px-3 py-2">
//                 Home
//               </NavLink>
//               <NavLink
//                 to="/rentPage"
//                 className="block text-gray-800  hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
//                 Rent
//               </NavLink>
//               <NavLink
//                 to="/buyPage"
//                 className="block text-gray-800  hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
//                 Buy
//               </NavLink>
//               <NavLink
//                 to="/managePrope"
//                 className="block text-gray-800  hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
//                 Manage Property
//               </NavLink>
//               <NavLink
//                 to="/resources"
//                 className="block text-gray-800  hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
//                 Resources
//               </NavLink>

//               {/* --- CONDITIONAL RENDERING BASED ON AUTHENTICATION STATE --- */}
//               <div className="flex flex-col p-3 lg:flex-row mt-4 lg:mt-0 lg:ml-4"> {/* Added lg:ml-4 for spacing */}
//                 {isAuthenticated ? (
//                   <>
//                     {user && user.fname && ( // Using user.fname as per your LandOwnerPage
//                         <span className="text-gray-800 self-center hidden lg:block mr-2">
//                             Welcome, {user.fname}!
//                         </span>
//                     )}
//                     {/* Add Dashboard links based on role */}
//                     {isAuthenticated && user && user.role === 'admin' && (
//                        <NavLink to="/admin" className="block text-gray-800 hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
//                          Admin Dashboard
//                        </NavLink>
//                     )}
//                     {isAuthenticated && user && user.role === 'landlord' && (
//                        <NavLink to="/landlord-dashboard" className="block text-gray-800 hover:bg-purple-400 hover:text-white rounded-md px-3 py-2">
//                          Landlord Dashboard
//                        </NavLink>
//                     )}
//                     {/* Logout Button */}
//                     <Button
//                       onClick={logout} // Call the logout function from useAuth
//                       className={
//                         "bg-red-500 text-white border border-gray-400 p-2 rounded-md hover:bg-red-600"
//                       }
//                       textButton={"Logout"}
//                     />
//                   </>
//                 ) : (
//                   <>
//                     {/* Login Button */}
//                     <Link to="/login">
//                       <Button
//                         className={
//                           "border border-gray-400 p-2 text-purple-500 rounded-md hover:bg-purple-400 hover:text-white mr-4 flex"
//                         }
//                         textButton={"Login"}
//                       />
//                     </Link>
//                     {/* Register Button */}
//                     <Link to="/register">
//                       <Button
//                         className={
//                           "bg-purple-500 text-white border lg:mt-0 mt-4 border-gray-400 p-2 rounded-md hover:bg-purple-400"
//                         }
//                         textButton={"Register"}
//                       />
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//             {/* Mobile Menu Icon */}
//             <button
//               onClick={toggleMenu}
//               className="text-gray-900 text-2xl lg:hidden focus:outline-none">
//               {hideNav ? <FaWindowClose /> : <FaBars />}
//             </button>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default NavBar;