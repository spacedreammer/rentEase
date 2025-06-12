import React, { useState, useEffect } from "react"; // Import useState and useEffect
import axios from "axios"; // Import axios
import Card from "../components/Card";
import SearchFilter from "../components/SearchFilter";
import { toast } from "react-toastify"; // For error notifications

const HomePage = () => {
  const baseUrl = "http://127.0.0.1:8000";
  const [houses, setHouses] = useState([]); // State to store fetched houses
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to store any errors

  useEffect(() => {
    // This effect runs once after the initial render
    const fetchHouses = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors

        const response = await axios.get("http://127.0.0.1:8000/api/auth/list-houses"); // Your API endpoint
        setHouses(response.data); // Update state with fetched houses
        toast.success("Houses loaded successfully!", {
          toastId: "houses-loaded"
        }); // Optional success message
      } catch (err) {
        console.error("Error fetching houses:", err);
        toast.error("Failed to load houses. " + (err.response?.data?.message || err.message), { toastId: "load-fail"}); // Display toast
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchHouses(); // Call the fetch function
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Conditional rendering based on loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center mt-8">
        <p className="text-xl">Loading houses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center mt-8 text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="flex justify-center items-center mt-4 font-poppins text-3xl font-bold">
        Search properties to rent
      </h1>
      <SearchFilter />

      {/* Flex container for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {houses.length > 0 ? (
          houses.map((house) => (
            <div key={house.id} className="w-full"> {/* Use w-full for grid items */}
              <Card
                image={house.images && house.images.length > 0 ? `${baseUrl}${house.images[0]}` : `${baseUrl}/placeholder.jpg`} // Display first image or a placeholder
                location={house.location}
                rentPrice={`${house.price} TZS`} // Format price (e.g., add currency)
                bathRoom={`${house.bathrooms} Bath Rooms`}
                bedSize={`${house.bedrooms} Beds`}
                houseSize={`${house.size} sq.ft`} // Assuming size is in sq.ft
                // You might also want to pass description, title etc. to the Card if it uses them
                title={house.title}
                description={house.description}
                linka={`/house/${house.id}`} // CORRECT
 // Link to house details page
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 text-lg mt-8">
            No houses found.
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;