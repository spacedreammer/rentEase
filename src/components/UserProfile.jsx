import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto mb-6 p-6 bg-gray-100 mt-6 shadow rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
        <div className="flex-shrink-0">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="h-32 w-32 rounded-full object-cover border"
          />
        </div>
        <div className="mt-4 md:mt-0">
          <h3 className="text-xl font-semibold text-gray-700">
            {user.name}
          </h3>
          <p className="text-gray-500">Role: {user.role}</p>
          <p className="text-gray-500">Email: {user.email}</p>
          {user.phone && <p className="text-gray-500">Phone: {user.phone}</p>}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800">Bio</h4>
        <p className="text-gray-600 mt-2">
          {user.bio || "No bio available."}
        </p>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/${user.role}/profile/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
