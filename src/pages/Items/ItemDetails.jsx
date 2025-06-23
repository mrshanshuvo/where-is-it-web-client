import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../../firebase/firebase.config';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

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
  const [user, setUser] = useState(null);

  // Check auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://whereisit-server-lfldlwb2p-mrshanshuvos-projects.vercel.app/api/items/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch item');
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
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
      if (!user) throw new Error('Please sign in first');
      if (!user.email) throw new Error('User email not available');
      if (user.email === item.contactEmail) {
        throw new Error('You cannot recover your own item');
      }

      const recoveryPayload = {
        recoveredLocation: recoveryData.recoveredLocation,
        recoveredDate: recoveryData.recoveredDate.toISOString(),
        notes: recoveryData.notes,
        itemId: item._id,
        postType: item.postType,
        title: item.title,
        description: item.description,
        category: item.category,
        originalLocation: item.location,
        originalDate: item.date,
        thumbnail: item.thumbnail,
        status: item.status,
        originalOwner: {
          name: item.contactName,
          email: item.contactEmail
        },
        recoveredBy: {
          userId: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email,
          photoURL: user.photoURL || null
        },
        recoverySubmittedAt: new Date().toISOString()
      };

      const token = await user.getIdToken();
      const response = await fetch(`https://whereisit-server-lfldlwb2p-mrshanshuvos-projects.vercel.app/api/items/${id}/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recoveryPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Recovery failed');
      }

      toast.success('Recovery recorded successfully!');
      setIsModalOpen(false);

      // Reset form
      setRecoveryData({
        recoveredLocation: '',
        recoveredDate: new Date(),
        notes: ''
      });

      // Refresh item data
      const updatedResponse = await fetch(`https://whereisit-server-lfldlwb2p-mrshanshuvos-projects.vercel.app/api/items/${id}`);
      if (updatedResponse.ok) {
        setItem(await updatedResponse.json());
      }
    } catch (error) {
      console.error('Recovery error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!item) return <ErrorMessage message="Item not found" />;

  const postType = item.postType?.toLowerCase();
  const isRecovered = item.status === 'recovered';
  const isOwner = user?.email === item.contactEmail;

  const getActionButtonText = () => {
    if (isRecovered) return 'Already Recovered';
    if (isOwner) return 'Your Item';
    return postType === 'found' ? 'This is Mine!' : 'Found This!';
  };

  const getModalTitle = () => {
    return postType === 'found' ? 'Claim This Item' : 'Report Recovery';
  };

  const getLocationLabel = () => {
    return postType === 'found' ? 'Where did you receive it?' : 'Where was it found?';
  };

  const getDateLabel = () => {
    return postType === 'found' ? 'Date Received' : 'Date Found';
  };

  const isActionButtonDisabled = isRecovered || isOwner || !user;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Item Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
              <div className="flex items-center mt-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${postType === 'found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {item.postType}
                </span>
                <span className="ml-2 text-sm text-gray-600">{item.category}</span>
              </div>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${isRecovered ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
              {isRecovered ? 'Recovered' : 'Active'}
            </span>
          </div>
        </div>

        {/* Item Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="relative">
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
                <p className="text-gray-700 whitespace-pre-line">
                  {item.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="text-gray-800">{item.location || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-gray-800">
                    {item.date ? new Date(item.date).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-gray-800 capitalize">{item.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Posted By</h3>
                  <p className="text-gray-800">{item.contactName || 'Anonymous'}</p>
                </div>
              </div>

              {/* Recovery Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isActionButtonDisabled}
                className={`px-4 py-2 rounded-md font-medium ${isActionButtonDisabled
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : postType === 'found'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                title={isOwner ? "You can't recover your own item" : ''}
              >
                {getActionButtonText()}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Name</h3>
              <p className="text-gray-800">{item.contactName || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
              <p className="text-gray-800">{item.contactEmail || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">{getModalTitle()}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleRecoverySubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocationLabel()} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recoveredLocation"
                    value={recoveryData.recoveredLocation}
                    onChange={handleRecoveryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getDateLabel()} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={recoveryData.recoveredDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxDate={new Date()}
                    required
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    placeholder="Provide any additional details about the recovery..."
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Your Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="User"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 text-lg">
                            {user?.displayName?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-800 font-medium">
                          {user?.displayName || 'Anonymous'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {user?.email || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Submit Recovery'
                    )}
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