import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const LostFoundItems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    postType: "all",
    category: "all",
    location: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ✅ Fetch items using TanStack Query + axiosInstance
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await axiosInstance.get("/items");
      // Sort by date (newest first)
      return res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    staleTime: 1000 * 60 * 3, // 3 min cache
  });

  const handleViewDetails = (itemId) => navigate(`/items/${itemId}`);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // ✅ Filtering logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPostType =
      filters.postType === "all" ||
      item.postType.toLowerCase() === filters.postType;

    const matchesCategory =
      filters.category === "all" || item.category === filters.category;

    const matchesLocation =
      filters.location === "all" ||
      item.location.toLowerCase().includes(filters.location.toLowerCase());

    return (
      matchesSearch && matchesPostType && matchesCategory && matchesLocation
    );
  });

  const categories = [...new Set(items.map((item) => item.category))].filter(
    Boolean
  );
  const locations = [...new Set(items.map((item) => item.location))].filter(
    Boolean
  );

  // ✅ Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Lost & Found Items
      </h1>

      {/* 🔍 Search + Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="postType"
              value={filters.postType}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>

            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={categories.length === 0}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={locations.length === 0}
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 📊 Results count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredItems.length === 0 ? 0 : indexOfFirstItem + 1}–
        {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
        {filteredItems.length} items
      </div>

      {/* 🧩 Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No items match your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ postType: "all", category: "all", location: "all" });
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentItems.map((item) => (
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
                  <span className="text-xs text-gray-500">{item.category}</span>
                </div>

                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1 flex items-center">
                    📍 {item.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    📅 {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {item.description?.length > 100
                      ? `${item.description.substring(0, 100)}...`
                      : item.description || "No description provided"}
                  </p>
                </div>

                <button
                  onClick={() => handleViewDetails(item._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* 📄 Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === num
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LostFoundItems;
