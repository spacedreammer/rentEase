import React from "react";

const SearchFilter = ({ filters, onFilterChange, onSearch }) => {
  // Helper function to handle price range selection
  const handlePriceChange = (e) => {
    const value = e.target.value;
    let min = "";
    let max = "";

    if (value === "$500 - $2,500") {
      min = "500";
      max = "2500";
    } else if (value === "$2,500 - $5,000") {
      min = "2500";
      max = "5000";
    } else if (value === "$5,000+") {
      min = "5000";
      max = ""; // No max price
    }
    onFilterChange("minPrice", min);
    onFilterChange("maxPrice", max);
  };

  return (
    <div className="bg-[#f7f7ff] p-6 rounded-xl shadow-md max-w-6xl mx-auto mt-10 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Location */}
        <div>
          <label htmlFor="location" className="text-sm text-gray-500 block mb-1">Location</label>
          <input
            type="text"
            id="location"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. New York"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
          />
        </div>

        {/* Move-in Date */}
        <div>
          <label htmlFor="moveInDate" className="text-sm text-gray-500 block mb-1">When</label>
          <input
            type="date"
            id="moveInDate"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            value={filters.moveInDate}
            onChange={(e) => onFilterChange("moveInDate", e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="text-sm text-gray-500 block mb-1">Price</label>
          <select
            id="price"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            // We'll manage value for price differently since it's a range
            onChange={handlePriceChange}
            value={
                filters.minPrice === "500" && filters.maxPrice === "2500" ? "$500 - $2,500" :
                filters.minPrice === "2500" && filters.maxPrice === "5000" ? "$2,500 - $5,000" :
                filters.minPrice === "5000" && filters.maxPrice === "" ? "$5,000+" :
                "" // Default or initial empty value
            }
          >
            <option value="">Select Price Range</option> {/* Added a default empty option */}
            <option value="$500 - $2,500">$500 - $2,500</option>
            <option value="$2,500 - $5,000">$2,500 - $5,000</option>
            <option value="$5,000+">$5,000+</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="text-sm text-gray-500 block mb-1">Property Type</label>
          <select
            id="propertyType"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            value={filters.propertyType}
            onChange={(e) => onFilterChange("propertyType", e.target.value)}
          >
            <option value="">Select Type</option> {/* Added a default empty option */}
            <option value="House">House</option> {/* Ensure these match your backend data */}
            <option value="Apartment">Apartment</option>
            <option value="Studio">Studio</option>
            {/* Add more types as needed, matching your backend values */}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={onSearch} // Call the onSearch prop when clicked
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;