// src/components/LandlordInfo.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify'; // Import toast for user feedback


const LandlordInfo = ({ landlord }) => { // Expects a 'landlord' prop
    const navigate = useNavigate(); // Initialize useNavigate hook

    if (!landlord) {
        return <div className="border p-4 rounded-lg shadow-sm text-gray-500">No Landlord information available.</div>;
    }

    const handleContactNow = () => {
        const userId = localStorage.getItem('user_id');
        const userRole = localStorage.getItem('role');

        // 1. Check if the user is logged in
        if (!userId) {
            toast.info("Please log in to contact the landlord.");
            navigate("/login"); // Redirect to login page
            return;
        }

        // 2. Check if the logged-in user is a 'tenant'
        if (userRole !== 'tenant') {
            toast.warn("Only tenants can contact landlords through this feature.");
            return;
        }

        // 3. Prevent a landlord from trying to contact themselves via this button (if they're also a landlord)
        if (parseInt(userId) === landlord.id) { // Convert localStorage string to int for comparison
            toast.info("You are the landlord of this property. No need to contact yourself!");
            navigate("/landlord/messages"); // Or simply return
            return;
        }

        // Navigate to the messages page, passing the landlord's details as state
        navigate(`/tenant/messages`, {
            state: {
                recipient: {
                    user_id: landlord.id, // The landlord's user ID
                    fname: landlord.fname,
                    lname: landlord.lname,
                    email: landlord.email, // Assuming email is available in landlord data
                    phone: landlord.phone // Assuming phone is available
                }
                // If you want to pass the house context, you'd need it as a prop to LandlordInfo
                // contextHouse: { id: house.id, title: house.title, ... }
            }
        });
    };

    const loggedInUserRole = localStorage.getItem('role'); // Get the role of the currently logged-in user

    return (
      <div className="border p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Landlord Information</h3>
        <div className="flex items-center space-x-3">
          <img
            // It's generally better to use a specific default image path/URL if 'space' is just a placeholder string.
            // Example: src={landlord.profile_picture ? landlord.profile_picture : '/images/default-user.png'}
            // For now, keeping 'space' as you had it.
            src={landlord.profile_picture ? landlord.profile_picture : 'space'} 
            alt="Landlord"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{landlord.fname} {landlord.lname}</p> {/* Display full name */}
            <p className="text-sm text-gray-500">{landlord.company || 'Private Landlord'}</p> {/* Example: If user has a 'company' field */}
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <p>License #: {landlord.license_number || 'N/A'}</p> {/* Example: If user has a license number */}
          <p>📞 {landlord.phone || 'N/A'}</p> {/* Display landlord's phone number */}
        </div>

        {/* Conditionally render the button based on the logged-in user's role */}
        {loggedInUserRole === 'tenant' && (
            <button
                onClick={handleContactNow} // Attach the new handler
                className="bg-blue-600 hover:bg-blue-700 text-white mt-2 px-4 py-2 rounded w-full transition duration-300"
            >
                Contact Now
            </button>
        )}
      </div>
    );
  };
  export default LandlordInfo;