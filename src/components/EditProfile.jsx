import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "123-456-7890",
    bio: "Loyal tenant who’s lived in 3 homes over 5 years.",
    avatar: "", // will store image URL or base64 for preview
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You'd typically send `form` data to the backend here
    console.log("Form submitted:", form);
    navigate(-1); // Go back
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preview Avatar */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover border mx-auto"
          />
        )}
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* Other Inputs */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
