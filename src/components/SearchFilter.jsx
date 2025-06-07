import React from "react";

const SearchFilter = () => {
  return (
    <div className="bg-[#f7f7ff] p-6 rounded-xl shadow-md max-w-6xl mx-auto mt-10 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Location */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Location</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Move-in Date */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">When</label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Price</label>
          <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
            <option>$500 - $2,500</option>
            <option>$2,500 - $5,000</option>
            <option>$5,000+</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="text-sm text-gray-500 block mb-1">Property Type</label>
          <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
            <option>Houses</option>
            <option>Apartments</option>
            <option>Studios</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
