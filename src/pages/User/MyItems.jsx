import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../../firebase/firebase.config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // Fetch user's items
  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = auth.currentUser;
        if (!user) {
          throw new Error('Please sign in to view your items');
        }

        const token = await user.getIdToken();
        const response = await fetch('http://localhost:5000/api/debug/my-items', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch your items');
        }

        const data = await response.json();
        setItems(data.sampleItems || data.items || data); // Handle different response formats
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, []);

  const handleEdit = (itemId) => {
    navigate(`/edit-item/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    if (isDeleting) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setIsDeleting(true);
      setDeleteId(itemId);

      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in to delete items');

      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete item');
      }

      setItems(prevItems => prevItems.filter(item => item._id !== itemId));
      toast.success('Item deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Error deleting item');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleCreateNew = () => {
    navigate('/create-item');
  };

  if (loading) return <LoadingSpinner className="mt-8" />;
  if (error) return <ErrorMessage message={error} className="mt-8" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Posted Items</h1>
        <button
          onClick={handleCreateNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add New Item
        </button>
      </div>

      {(!items || items.length === 0) ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="mt-2 text-gray-600">
            You haven't posted any items yet. Click the button above to create your first post.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Posted
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.thumbnail && (
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={item.thumbnail} alt={item.title} />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.postType === 'found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.postType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'recovered' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt || item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Edit"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isDeleting && deleteId === item._id}
                        title="Delete"
                      >
                        {isDeleting && deleteId === item._id ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <FiTrash2 className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyItems;