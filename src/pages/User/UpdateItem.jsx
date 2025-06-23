import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { auth } from '../../firebase/firebase.config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const UpdateItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [categories] = useState([
    'Electronics', 'Documents', 'Jewelry', 'Clothing',
    'Accessories', 'Bags', 'Other'
  ]);

  const [formData, setFormData] = useState({
    postType: 'lost',
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    thumbnail: '',
    contactName: '',
    contactEmail: '',
    status: 'active'
  });

  // Fetch item data to pre-fill form
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) throw new Error('Please sign in to edit items');

        const token = await user.getIdToken();
        const response = await fetch(`http://localhost:5000/api/items/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch item');
        }

        const data = await response.json();
        setFormData({
          postType: data.postType,
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          date: data.date.split('T')[0], // Format date for input
          thumbnail: data.thumbnail,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          status: data.status || 'active'
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in to update items');

      // Prepare payload with proper date formatting
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };

      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json(); // Always parse JSON

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      toast.success(data.message || 'Item updated successfully!');
      navigate('/my-items');

    } catch (err) {
      console.error('Update failed:', {
        error: err,
        formData,
        id
      });
      toast.error(err.message || 'Failed to update item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner className="mt-8" />;
  if (error) return <ErrorMessage message={error} className="mt-8" />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Item</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Post Type */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Item Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="postType"
                  value="lost"
                  checked={formData.postType === 'lost'}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Lost</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="postType"
                  value="found"
                  checked={formData.postType === 'found'}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Found</span>
              </label>
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 mb-2">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="recovered">Recovered</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 mb-2">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 mb-2">Location*</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Date */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 mb-2">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Thumbnail */}
          <div className="mb-4">
            <label htmlFor="thumbnail" className="block text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Contact Info (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="mb-4">
            <label htmlFor="contactName" className="block text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contactEmail" className="block text-gray-700 mb-2">Your Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Preview Image */}
        {formData.thumbnail && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Image Preview</label>
            <img
              src={formData.thumbnail}
              alt="Preview"
              className="max-w-full h-48 object-contain border rounded-lg"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Updating...' : 'Update Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateItem;