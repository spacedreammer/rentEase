import React from 'react';
// Assuming 'space' is a placeholder default image if the landlord has no profile picture

const LandlordInfo = ({ landlord }) => { // Expects a 'landlord' prop
    if (!landlord) {
        return <div className="border p-4 rounded-lg shadow-sm text-gray-500">No Landlord information available.</div>;
    }

  
    return (
      <div className="border p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Landlord Information</h3>
        <div className="flex items-center space-x-3">
          <img
            src={landlord.profile_picture ? landlord.profile_picture : space} // Use landlord's picture or default
            alt="Landlord"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{landlord.fname || 'N/A'}</p> {/* Display landlord's name */}
            <p className="text-sm text-gray-500">{landlord.company || 'Private Landlord'}</p> {/* Example: If user has a 'company' field */}
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <p>License #: {landlord.license_number || 'N/A'}</p> {/* Example: If user has a license number */}
          <p>📞 {landlord.phone || 'N/A'}</p> {/* Display landlord's phone number */}
        </div>
        <button className="bg-blue-600 text-white mt-2 px-4 py-2 rounded w-full">
          Contact Now
        </button>
      </div>
    );
  };
  export default LandlordInfo;