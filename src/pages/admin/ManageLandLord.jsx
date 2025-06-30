// ManageLandLord.js (Example Integration)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateUser from "./UpdateLandlord"; // Import the new component

const API_BASE_URL = "http://127.0.0.1:8000";

const ManageLandLord = () => {
  const [landlords, setLandLord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state for consistency
  const [selectedUserId, setSelectedUserId] = useState(null); // State to hold the ID of the user to be updated

  // Function to fetch landlords (can be reused)
  const fetchLandLords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/api/auth/landLords`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLandLord(res.data);
      toast.success("Landlords loaded successfully!", { toastId: "landlords-loaded" });
    } catch (err) {
      console.error("Failed to load landlords:", err);
      setError("Failed to load landlords. Please try again.");
      toast.error("Failed to fetch landlords: " + (err.response?.data?.message || err.message), { toastId: "load-fail" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandLords(); // Initial fetch
  }, []);

  const handleEditClick = (userId) => {
    setSelectedUserId(userId); // Set the ID of the user to be edited
  };

  const handleCloseUpdateForm = () => {
    setSelectedUserId(null); // Clear the selected ID to close the form
  };

  const handleUserActionSuccess = () => {
    fetchLandLords(); // Re-fetch the list of landlords after update/delete
    handleCloseUpdateForm(); // Close the form
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Landlords</h1>

      {loading ? (
        <p>Loading landlords...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : landlords.length === 0 ? (
        <p>No landlords found.</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {landlords.map((landlord) => (
              <tr key={landlord.id} className="border-t">
                <td className="px-4 py-2">
                  {landlord.fname} {landlord.lname}
                </td>
                <td className="px-4 py-2">{landlord.email}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => handleEditClick(landlord.id)}> {/* Call handleEditClick */}
                    Edit
                  </button>
                  {/* Delete button will trigger the UpdateUser component's delete logic */}
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => {
                      
                        handleEditClick(landlord.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Render the UpdateUser component as a modal or conditional display */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <UpdateUser
            userId={selectedUserId}
            onClose={handleCloseUpdateForm} // Close button
            onUserUpdated={handleUserActionSuccess} // Refresh list after update
            onUserDeleted={handleUserActionSuccess} // Refresh list after delete
          />
        </div>
      )}
    </div>
  );
};

export default ManageLandLord;









// import React from 'react'
// import  { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ManageLandLord = () => {
//   const [landlords, setLandLord] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLandLord = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/api/auth/landLords", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         setLandLord(res.data);
//         toast.success("Landlord loaded successfully", {
//           toastId: "houses-loaded",
//         });
//       } catch (error) {
//         console.error("Failed to load landlord:", error);
//         toast.error("Failed to fetch landlord", {
//           toastId: "load-fail",});
//       } finally {
//         setLoading(false); 
//       }
//     };

//     fetchLandLord();
//   }, []);
//   return (
//     <div>
//     <h1 className="text-2xl font-bold mb-4">Manage landlord</h1>

//     {loading ? (
//       <p>Loading landlord...</p>
//     ) : landlords.length === 0 ? (
//       <p>No landlord found.</p>
//     ) : (
//       <table className="w-full bg-white shadow-md rounded overflow-hidden">
//         <thead className="bg-gray-200 text-left">
//           <tr>
//             <th className="px-4 py-2">Name</th>
//             <th className="px-4 py-2">Email</th>
//             <th className="px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {landlords.map((landlord) => (
//             <tr key={landlord.id} className="border-t">
//               <td className="px-4 py-2">
//                 {landlord.fname} {landlord.lname}
//               </td>
//               <td className="px-4 py-2">{landlord.email}</td>
//               <td className="px-4 py-2">
//                 <button className="text-blue-600 hover:underline mr-2">
//                   Edit
//                 </button>
//                 <button className="text-red-600 hover:underline">
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     )}
//   </div>
//   )
// }

// export default ManageLandLord