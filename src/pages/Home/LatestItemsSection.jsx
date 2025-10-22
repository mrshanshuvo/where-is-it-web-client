import React from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { HiLocationMarker, HiCalendar } from "react-icons/hi";
import { axiosInstance } from "../../api/api";

const LatestItemsSection = () => {
  const navigate = useNavigate();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await axiosInstance.get("/items");
      return res.data;
    },
  });

  const handleViewDetails = (itemId) => navigate(`/items/${itemId}`);
  const handleSeeAll = () => navigate("/lost-found-items");

  if (isLoading)
    return <div className="text-center py-8">Loading latest items...</div>;

  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  const latestItems = items.slice(0, 6);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
        Latest Lost & Found Items
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {latestItems.length === 0 ? (
          <p className="col-span-full text-center py-8 text-gray-500">
            No items found.
          </p>
        ) : (
          latestItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
                <span
                  className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    item.postType.toLowerCase() === "found"
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  }`}
                >
                  {item.postType}
                </span>
                <span className="text-xs text-gray-500 truncate max-w-[50%]">
                  {item.category}
                </span>
              </div>

              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 sm:h-56 md:h-60 object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 truncate">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-1 flex items-center truncate">
                  <HiLocationMarker className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                  {item.location}
                </p>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <HiCalendar className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm flex-grow">
                  {item.description?.length > 100
                    ? `${item.description.substring(0, 100)}...`
                    : item.description || "No description provided"}
                </p>
              </div>

              <button
                onClick={() => handleViewDetails(item._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 transition-colors duration-200 w-full"
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
