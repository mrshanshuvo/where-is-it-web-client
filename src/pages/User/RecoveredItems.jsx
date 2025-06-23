import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../../firebase/firebase.config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecoveredItems = () => {
  const [recoveries, setRecoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch recoveries data
  useEffect(() => {
    const fetchRecoveries = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Please sign in to view recoveries');
        }

        const token = await user.getIdToken();
        const response = await fetch('https://whereisit-server-lfldlwb2p-mrshanshuvos-projects.vercel.app/api/recoveries', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recoveries');
        }

        const data = await response.json();
        setRecoveries(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecoveries();
  }, []);

  const handleViewItem = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (recoveries.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">No recoveries found</h3>
        <p className="mt-1 text-sm text-gray-500">You haven't recovered or had any items recovered yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Recovered Items</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recoveries.map((recovery) => (
          <div key={recovery._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {recovery.originalItemData?.title || 'Untitled Item'}
                </h2>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${recovery.originalPostType === 'found'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {recovery.originalPostType}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Recovered by:</span> {recovery.recoveredBy?.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Recovered on:</span> {new Date(recovery.recoveredDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {recovery.recoveredLocation}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-1 capitalize ${recovery.recoveryStatus === 'pending' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                      {recovery.recoveryStatus}
                    </span>
                  </p>
                </div>
              </div>

              {recovery.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                  <p className="text-sm text-gray-600">{recovery.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleViewItem(recovery.itemId)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Original Item
                </button>
                <span className="text-xs text-gray-500">
                  Reported on: {new Date(recovery.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecoveredItems;