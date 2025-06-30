import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as necessary

const EditPropertyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the house ID from the URL
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    status: 'available',
    bedrooms: '',
    bathrooms: '',
    size: '',
  });
  const [existingImages, setExistingImages] = useState([]); // To store URLs of images already on server
  const [newImages, setNewImages] = useState([]); // To store newly selected image files
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Previews for new images
  const [submitting, setSubmitting] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://127.0.0.1:8000"; // Your Laravel base URL

  useEffect(() => {
    const fetchProperty = async () => {
      if (authLoading) return; // Wait for auth context to load

      if (!isAuthenticated || user?.role !== 'landlord') {
        setError('Unauthorized: You must be logged in as a landlord to edit properties.');
        setDataLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setDataLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/list-house/${id}`, { // Fetch single house details
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const houseData = response.data;

        // Check if the authenticated user is the owner of the house
        if (houseData.user_id !== user.id) {
          setError('Unauthorized: You do not own this property.');
          setDataLoading(false);
          toast.error("You are not authorized to edit this property.");
          navigate('/landlord/my-properties'); // Redirect if not authorized
          return;
        }

        setFormData({
          title: houseData.title || '',
          location: houseData.location || '',
          price: houseData.price || '',
          description: houseData.description || '',
          status: houseData.status || 'available',
          bedrooms: houseData.bedrooms || '',
          bathrooms: houseData.bathrooms || '',
          size: houseData.size || '',
        });
        setExistingImages(houseData.images || []); // Set existing image URLs
      } catch (err) {
        console.error('Error fetching property for edit:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load property details.');
        toast.error('Failed to load property details for editing.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchProperty();
  }, [id, isAuthenticated, user, authLoading, navigate, API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    // Generate previews for newly selected images
    setNewImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveExistingImage = (imageToRemove) => {
    // Filter out the image from the existing images array
    setExistingImages(prevImages => prevImages.filter(img => img !== imageToRemove));
    toast.info("Image will be removed upon saving changes.");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Authentication token not found. Please log in.');
      navigate('/login');
      setSubmitting(false);
      return;
    }

    const dataToUpdate = new FormData();
    for (const key in formData) {
      dataToUpdate.append(key, formData[key]);
    }

    // Append existing image URLs (that were NOT removed)
    existingImages.forEach((imgUrl, index) => {
        dataToUpdate.append(`existing_images[${index}]`, imgUrl);
    });

    // Append newly selected image files
    newImages.forEach((image, index) => {
      dataToUpdate.append(`images[${index}]`, image); // 'images[]' for new files
    });

    // Important for PUT/PATCH requests with FormData in Laravel
    dataToUpdate.append('_method', 'PUT'); // Laravel expects _method for PUT/PATCH with FormData

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/updateHouse/${id}`, dataToUpdate, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      toast.success('Property updated successfully!');
      console.log('Property updated:', response.data);
      navigate('/landlord/my-properties'); // Go back to the list
    } catch (err) {
      console.error('Failed to update property:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to update property.');
    } finally {
      setSubmitting(false);
    }
  };

  if (dataLoading) {
    return <div className="text-center p-6">Loading property for editing...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-md mt-6 mb-6 shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="House Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={4}
          required
        />

        <select
          name="status"
          className="w-full border px-3 py-2 rounded"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="available">available</option>
          <option value="rented">rented</option>
          <option value="maintenance">maintenance</option> {/* Added maintenance based on backend validation */}
        </select>

        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={formData.bedrooms}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          name="size"
          placeholder="Size per square feet"
          value={formData.size}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {/* Existing Images Display */}
        {existingImages.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Images:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {existingImages.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={`${API_BASE_URL}${src}`} // Prepend base URL for existing images too
                    alt={`existing-${idx}`}
                    className="h-24 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(src)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImageChange}
          className="w-full mt-4"
        />

        {/* New Image Previews */}
        {newImagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {newImagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`new-preview-${idx}`}
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || dataLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {submitting ? 'Updating...' : 'Update Property'}
        </button>
      </form>
    </div>
  );
};

export default EditPropertyPage;