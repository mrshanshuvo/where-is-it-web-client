import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../firebase/firebase.config";

const AddItems = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    postType: 'lost',
    thumbnail: '',
    title: '',
    description: '',
    category: '',
    location: '',
    date: new Date(),
    contactName: '',
    contactEmail: ''
  });
  const [categories, setCategories] = useState([
    'Electronics', 'Documents', 'Jewelry',
    'Clothing', 'Pets', 'Other'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill user info when component mounts
  useEffect(() => {
    if (auth.currentUser) {
      setFormData(prev => ({
        ...prev,
        contactName: auth.currentUser.displayName || '',
        contactEmail: auth.currentUser.email || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.thumbnail.trim()) newErrors.thumbnail = 'Image URL is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://whereisit-server-lfldlwb2p-mrshanshuvos-projects.vercel.app/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date.toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to submit item');

      const data = await response.json();

      toast.success('Item posted successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // Reset form after successful submission
      setFormData({
        postType: 'lost',
        thumbnail: '',
        title: '',
        description: '',
        category: '',
        location: '',
        date: new Date(),
        contactName: auth.currentUser?.displayName || '',
        contactEmail: auth.currentUser?.email || ''
      });

      // Redirect after a delay
      setTimeout(() => navigate('/lost-found-items'), 2000);
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Report Lost or Found Item</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Post Type */}
              <div>
                <label htmlFor="postType" className="block text-sm font-medium text-gray-700 mb-1">
                  Post Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="postType"
                  name="postType"
                  value={formData.postType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
            </div>

            {/* Title */}
            <div className="mt-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the item"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detailed description of the item (color, brand, distinguishing features, etc.)"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Where was it lost/found?"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  maxDate={new Date()}
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="mt-6">
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}
              {formData.thumbnail && (
                <div className="mt-2">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="h-32 object-contain border rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Available';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Add Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;