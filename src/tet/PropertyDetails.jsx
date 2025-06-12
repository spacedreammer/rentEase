import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PropertyImageSlider from "./PropertyImageSlider";
import RequestTour from "./RequestTour";
import LandlordInfo from "./LandLordInfo";

const API_BASE_URL = "http://127.0.0.1:8000";

const PropertyDetails = () => {
  const { id } = useParams(); // Get the house ID from the URL (e.g., /houses/:id)
  const [house, setHouse] = useState(null); // State to store the fetched house details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch house details using the ID from the URL
        const response = await axios.get(
          `http://127.0.0.1:8000/api/auth/list-house/${id}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
            },
          }
        );
        setHouse(response.data); // Set the fetched house data
        toast.success("House details loaded successfully!", {
          toastId: "houses-loaded",
        });
      } catch (err) {
        console.error("Error fetching house details:", err);
        if (err.response && err.response.status === 404) {
          setError("House not found.");
          toast.error("House not found.", { toastId: "house-fail" });
        } else {
          setError("Failed to load house details. Please try again.");
          toast.error(
            "Failed to load house details: " +
              (err.response?.data?.message || err.message),
            { toastId: "load-fail" }
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      // Only fetch if an ID exists (important if this component can be rendered without an ID)
      fetchHouseDetails();
    }
  }, [id]); // Re-fetch if the ID in the URL changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!house) {
    // If not loading and no house, it means 404 or initial state before fetch
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">No property details available.</p>
      </div>
    );
  }

  // Once house data is loaded, render the details
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-8">
      {/* Left Section (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">{house.title}</h2>
          <p className="text-gray-500">{house.location}</p>
        </div>
        {/* Pass images to the slider */}
        <PropertyImageSlider images={house.images.map(image => `${API_BASE_URL}${image}`)} />


        <div className="text-3xl font-bold text-blue-700">${house.price}</div>
        <div
          className={`text-sm ${
            house.status === "available" ? "text-green-500" : "text-yellow-500"
          }`}>
          Status: {house.status}
        </div>

        <div className="flex space-x-4 text-gray-700 text-sm">
          <span>🛏 {house.bedrooms} Bed</span>
          <span>🛁 {house.bathrooms} Bath</span>
          <span>📐 {house.size} sqft</span> {/* Assuming size is in sqft */}
        </div>

        <div className="text-gray-600 mt-4 text-sm">{house.description}</div>

        {/* You'll need to map other details from your house object */}
        {/* For now, these are placeholders or can be conditionally rendered if they exist in your data */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
          {/* Example: You might not have Type, Year, View, Parking, Garden, HOA in your house data */}
          {/* If you add these to your migration/model, you can populate them dynamically */}
          <div>
            🏘 <strong>Type:</strong> Townhomes
          </div>
          <div>
            📆 <strong>Year:</strong> 2002
          </div>
          <div>
            🌇 <strong>View:</strong> City View
          </div>
          <div>
            🅿️ <strong>Parking:</strong> Available
          </div>
          <div>
            🌿 <strong>Garden:</strong> Available
          </div>
          <div>
            🚫 <strong>HOA:</strong> No HOA Fee
          </div>
        </div>
      </div>

      {/* Right Section (1/3) */}
      <div className="space-y-6">
        <RequestTour houseId={house.id} />{" "}
        {/* Pass houseId if needed for tour requests */}
        {/* Pass landlord info to LandlordInfo component */}
        <LandlordInfo landlord={house.user} />
        {/* Assuming house.user contains landlord data */}
      </div>
    </div>
  );
};

export default PropertyDetails;
