import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const LandlordHouses = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: [],
    'status': 'available', // available or taken
    bedrooms: "",
    bathrooms: "",
    size: "",

  });

  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    // Generate previews
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Create FormData to send to Laravel backend
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("location", form.location);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("status", form.status);
    formData.append("bedrooms", form.bedrooms);
    formData.append("bathrooms", form.bathrooms);
    formData.append("size", form.size);

    form.images.forEach((image, index) => {
      formData.append(`images[]`, image);
    });
    
    // Use fetch/axios to send to backend
    try{
      const res = await axios.post("http://127.0.0.1:8000/api/auth/createHouse", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,}
        }
      );
      console.log("Submitting house:", res.data);
    toast.success("House submitted successfully!");

    setForm({
      title: "", location: "", price: "", description: "", images: [],
      'status': 'available', bedrooms: "", bathrooms: "", size: "",
    });
    setPreviews([]);
    } catch (err) {
      console.error("Error submitting house:", err.response?.data || err.message);
      toast.error("Failed to submit house. Please try again.");
      return;
    }
    
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-md mt-6 mb-6 shadow">
      <h2 className="text-2xl font-bold mb-4">Upload House To Rent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="House Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={4}
          required
        />

<select
          name="status"
          className="w-full border px-3 py-2 rounded"
          value={form.status}
          onChange={handleChange}>
          <option value="avalable">available</option>
          <option value="rented">rented</option>
        </select>

<input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
         
        />

<input
          type="number"
          name="bathrooms"
          placeholder="bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          
        />

<input
          type="number"
          name="size"
          placeholder="size per square feet"
          value={form.size}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {/* Image Preview */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {previews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Submit House
        </button>
      </form>
    </div>
  );
};

export default LandlordHouses;
