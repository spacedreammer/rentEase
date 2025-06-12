const RequestTour = () => {
    return (
      <div className="border p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Request a tour</h3>
        <p className="text-sm text-gray-600">Get a tour of the house as per your time.</p>
  
        <div className="mt-4 space-y-2">
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            defaultValue="2025-06-13"
          />
          <input
            type="time"
            className="w-full border rounded px-2 py-1"
            defaultValue="12:30"
          />
          <button className="bg-teal-600 text-white px-4 py-2 rounded w-full">
            Schedule a Tour
          </button>
          <button className="text-teal-600 w-full mt-1 text-sm">Request Info</button>
        </div>
      </div>
    );
  };
  export default RequestTour;
  