// Example page: TenantProfile.jsx or LandlordProfile.jsx
import React from "react";
import UserProfile from "../components/UserProfile";

const mockUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  role: "tenant", // or landlord or agent
  phone: "123-456-7890",
  bio: "Loyal tenant who’s lived in 3 homes over 5 years.",
  avatar: "/images/house1.jpg", // or use an uploaded image URL
};

const ProfilePage = () => {
  return <UserProfile user={mockUser} />;
};

export default ProfilePage;
