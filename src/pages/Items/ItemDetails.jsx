import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../../firebase/firebase.config';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recoveryData, setRecoveryData] = useState({
    recoveredLocation: '',
    recoveredDate: new Date(),
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/items/${id}`);
        if (!response.ok) throw new Error('Failed to fetch item');
        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleRecoveryChange = (e) => {
    const { name, value } = e.target;
    setRecoveryData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setRecoveryData(prev => ({ ...prev, recoveredDate: date }));
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Authentication required');
      if (!user.email) throw new Error('User email not available');

      // Check if user is trying to recover their own item
      if (user.email === item.contactEmail) {
        throw new Error('You cannot recover your own item');
      }

      // Prepare recovery data
      const recoveryPayload = {
        itemId: item._id,
        originalPostType: item.postType,
        originalOwner: {
          name: item.contactName,
          email: item.contactEmail
        },
        recoveredBy: {
          userId: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email,
          photoURL: user.photoURL || ''
        },
        recoveredLocation: recoveryData.recoveredLocation,
        recoveredDate: recoveryData.recoveredDate.toISOString(),
        notes: recoveryData.notes,
        itemDetails: {
          title: item.title,
          category: item.category,
          description: item.description,
          thumbnail: item.thumbnail
        }
      };

      // Submit recovery
      const response = await fetch('http://localhost:5000/api/recoveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(recoveryPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Recovery failed');
      }

      // Update item status
      const updateResponse = await fetch(`http://localhost:5000/api/items/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ status: 'recovered' })
      });

      if (!updateResponse.ok) throw new Error('Failed to update item status');

      toast.success('Recovery recorded successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // Redirect to lost-found-items page after a short delay
      setTimeout(() => {
        navigate('/lost-found-items');
      }, 1000);


      // Refresh item data
      const updatedItem = await fetch(`http://localhost:5000/api/items/${id}`)
        .then(res => res.json());
      setItem(updatedItem);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: 'top-center',
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

  if (loading) return <div className="text-center py-8">Loading item details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!item) return <div className="text-center py-8">Item not found</div>;

  // Determine button text and modal title based on post type
  const postType = item.postType?.trim()?.toLowerCase();
  const actionButtonText = postType === 'found' ? 'This is Mine!' : 'Found This!';
  const modalTitle = postType === 'found' ? 'Claim This Item' : 'Report Recovery';
  const locationLabel = postType === 'found' ? 'Where did you receive it?' : 'Where was it found?';
  const dateLabel = postType === 'found' ? 'Date Received' : 'Date Found';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Item Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
              <div className="flex items-center mt-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.postType === 'found'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {item.postType}
                </span>
                <span className="ml-2 text-sm text-gray-600">{item.category}</span>
              </div>
            </div>
            {item.status === 'recovered' ? (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Recovered
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Item Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div>
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                  }}
                />
              )}
            </div>

            {/* Right Column - Details */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-700">{item.description || 'No description provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="text-gray-800">{item.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-gray-800">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-gray-800 capitalize">{item.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Posted By</h3>
                  <p className="text-gray-800">{item.contactName}</p>
                </div>
              </div>

              {/* Recovery Button - Only show if item is active and user is not the original poster */}
              {item.status !== 'recovered' && auth.currentUser && auth.currentUser.email !== item.contactEmail && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`px-4 py-2 rounded-md font-medium ${item.postType === 'found'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {actionButtonText}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Name</h3>
              <p className="text-gray-800">{item.contactName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
              <p className="text-gray-800">{item.contactEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {modalTitle}
              </h2>

              <form onSubmit={handleRecoverySubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locationLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recoveredLocation"
                    value={recoveryData.recoveredLocation}
                    onChange={handleRecoveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {dateLabel} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={recoveryData.recoveredDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxDate={new Date()}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={recoveryData.notes}
                    onChange={handleRecoveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Your Information
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      {auth.currentUser?.photoURL && (
                        <img
                          src={auth.currentUser.photoURL}
                          alt="User"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-gray-800 font-medium">
                          {auth.currentUser?.displayName || 'Your Name'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {auth.currentUser?.email || 'your@email.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : item.postType === 'found'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Recovery'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;