import React, { useState, useEffect, useCallback } from "react"; // Add useCallback
import axios from "axios";
import Card from "../components/Card";
import SearchFilter from "../components/SearchFilter";
import { toast } from "react-toastify";

const HomePage = () => {
  const baseUrl = "http://127.0.0.1:8000";
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filter criteria
  const [filters, setFilters] = useState({
    location: "",
    moveInDate: "",
    minPrice: "", // Will hold the lower bound of the price range
    maxPrice: "", // Will hold the upper bound of the price range
    propertyType: "",
  });

  // Callback function to fetch houses, memoized with useCallback
  // This function will be re-created only if filters change
  const fetchHouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construct query parameters from filters
      const params = new URLSearchParams();
      if (filters.location) {
        params.append("location", filters.location);
      }
      if (filters.moveInDate) {
        params.append("move_in_date", filters.moveInDate); // Use snake_case for backend
      }
      if (filters.minPrice) {
        params.append("min_price", filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append("max_price", filters.maxPrice);
      }
      if (filters.propertyType) {
        params.append("property_type", filters.propertyType); // Use snake_case for backend
      }

      const queryString = params.toString();
      const apiUrl = `http://127.0.0.1:8000/api/auth/list-houses${queryString ? `?${queryString}` : ""}`;

      console.log("Fetching houses with URL:", apiUrl); // Debugging

      const response = await axios.get(apiUrl);
      setHouses(response.data);
      toast.success("Houses loaded successfully!", {
        toastId: "houses-loaded",
      });
    } catch (err) {
      console.error("Error fetching houses:", err);
      // More specific error message if backend provides it
      toast.error("Failed to load houses. " + (err.response?.data?.message || err.message), { toastId: "load-fail" });
      setError("Failed to load houses. Please try again later."); // Set error state for conditional rendering
    } finally {
      setLoading(false);
    }
  }, [filters]); // Dependency array: re-run fetchHouses when filters change

  // Initial fetch when component mounts or filters change
  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]); // Dependency array includes fetchHouses

  // Handler for when the search button is clicked in SearchFilter
  const handleSearch = () => {
    fetchHouses(); // Re-fetch houses with current filter state
  };

  // Handler to update filter state from SearchFilter inputs
  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Conditional rendering based on loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]"> {/* Added min-h for better centering */}
        <p className="text-xl">Loading houses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="flex justify-center items-center mt-4 font-poppins text-3xl font-bold">
        Search properties to rent
      </h1>
      {/* Pass filter state and handlers to SearchFilter */}
      <SearchFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Flex container for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {houses.length > 0 ? (
          houses.map((house) => (
            <div key={house.id} className="w-full">
              <Card
                image={house.images && house.images.length > 0 ? `${baseUrl}${house.images[0]}` : `${baseUrl}/placeholder.jpg`}
                location={house.location}
                rentPrice={`${house.price} TZS`}
                bathRoom={`${house.bathrooms} Bath Rooms`}
                bedSize={`${house.bedrooms} Beds`}
                houseSize={`${house.size} sq.ft`}
                title={house.title}
                description={house.description}
                linka={`/house/${house.id}`}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 text-lg mt-8">
            No houses found. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;