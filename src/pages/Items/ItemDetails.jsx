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
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in first');
      if (!user.email) throw new Error('User email not available');

      console.log('Attempting to recover item with ID:', id);
      console.log('Current user email:', user.email);
      console.log('Item contact email:', item.contactEmail);

      if (user.email === item.contactEmail) {
        throw new Error('You cannot recover your own item');
      }

      const recoveryPayload = {
        recoveredLocation: recoveryData.recoveredLocation,
        recoveredDate: recoveryData.recoveredDate.toISOString(),
        notes: recoveryData.notes,
      };

      const token = await user.getIdToken();

      const response = await fetch(`http://localhost:5000/api/items/${id}/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(recoveryPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.message || 'Recovery failed');
      }

      const responseData = await response.json();
      toast.success('Recovery recorded successfully!');
      setIsModalOpen(false);

      // Refresh item data
      const updatedResponse = await fetch(`http://localhost:5000/api/items/${id}`);
      if (updatedResponse.ok) {
        const updatedItem = await updatedResponse.json();
        setItem(updatedItem);
      }
    } catch (error) {
      console.error('Recovery error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading item details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!item) return <div className="text-center py-8">Item not found</div>;

  const postType = item.postType?.toLowerCase();
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
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${postType === 'found'
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
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
                  No Image Available
                </div>
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
                  <p className="text-gray-800">{new Date(item.date).toLocaleDateString()}</p>
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

              {/* Recovery Button */}
              {item.status !== 'recovered' &&
                auth.currentUser &&
                auth.currentUser.email !== item.contactEmail && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`px-4 py-2 rounded-md font-medium ${postType === 'found'
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">{modalTitle}</h2>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={recoveryData.notes}
                    onChange={handleRecoveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Your Information</h3>
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
                      : postType === 'found'
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
