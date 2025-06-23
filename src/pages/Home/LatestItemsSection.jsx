import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const LatestItemsSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://whereisit-server-inky.vercel.app/api/items");
        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        // Sort by most recent first
        const sortedItems = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setItems(sortedItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleViewDetails = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  const handleSeeAll = () => {
    navigate("/lost-found-items");
  };

  if (loading) return <div className="text-center py-8">Loading latest items...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  // Get the 6 most recent items
  const latestItems = items.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Latest Lost & Found Items</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {latestItems.length === 0 ? (
          <p className="col-span-full text-center py-8 text-gray-500">No items found.</p>
        ) : (
          latestItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                <span
                  className={`text-xs font-bold uppercase px-2 py-1 rounded ${item.postType.toLowerCase() === 'found'
                    ? 'text-green-700 bg-green-100'
                    : 'text-red-700 bg-red-100'
                    }`}
                >
                  {item.postType}
                </span>
                <span className="text-xs text-gray-500">
                  {item.category}
                </span>
              </div>

              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {item.location}
                </p>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm">
                  {item.description?.length > 100
                    ? `${item.description.substring(0, 100)}...`
                    : item.description || "No description provided"}
                </p>
              </div>

              <button
                onClick={() => handleViewDetails(item._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleSeeAll}
        className="block mx-auto px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-600 hover:text-white transition-colors duration-200"
      >
        See All Lost & Found Items
      </button>
    </div>
  );
};

export default LatestItemsSection;