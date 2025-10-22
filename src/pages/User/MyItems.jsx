import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { axiosInstance } from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiPackage } from "react-icons/fi";

const MyItems = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myItems", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      const res = await axiosInstance.get("/debug/my-items", {
        withCredentials: true,
      });
      return res.data.sampleItems || res.data.items || res.data;
    },
  });

  const handleEdit = (itemId) => navigate(`/updateItems/${itemId}`);
  const handleView = (itemId) => navigate(`/items/${itemId}`);

  const handleDelete = async (itemId) => {
    if (isDeleting) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#fff",
      iconColor: "#e53e3e",
      customClass: {
        confirmButton: "px-6 py-2 rounded-lg",
        cancelButton: "px-6 py-2 rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);
      setDeleteId(itemId);

      await axiosInstance.delete(`/items/${itemId}`, {
        withCredentials: true,
      });

      Swal.fire({
        title: "Deleted!",
        text: "Your item has been deleted.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        background: "#fff",
        iconColor: "#10b981",
        timer: 2000,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries(["myItems", user?.uid]);
    } catch (err) {
      console.error("Delete error:", err);

      Swal.fire({
        title: "Error!",
        text: err?.response?.data?.message || "Failed to delete item",
        icon: "error",
        confirmButtonColor: "#3085d6",
        background: "#fff",
        iconColor: "#e53e3e",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleCreateNew = () => navigate("/add-item");

  if (!user)
    return <ErrorMessage message="Please sign in to view your items" />;

  if (isLoading) return <LoadingSpinner className="mt-8" />;
  if (error) return <ErrorMessage message={error.message} className="mt-8" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                My Posted Items
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your lost and found items
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              <FiPlus className="mr-2 text-lg" />
              Add New Item
            </button>
          </div>
        </div>

        {/* Empty State */}
        {!items || items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <FiPackage className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items posted yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start helping others by posting your first lost or found item.
              Your post could reunite someone with their belongings.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FiPlus className="mr-2" />
              Create Your First Post
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="block lg:hidden space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    {item.thumbnail && (
                      <img
                        className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                        src={item.thumbnail}
                        alt={item.title}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.category}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.postType === "found"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.postType}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "recovered"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status || "active"}
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mt-3">
                        Posted{" "}
                        {new Date(
                          item.createdAt || item.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleView(item._id)}
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                      title="View"
                    >
                      <FiEye className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
                      title="Edit"
                    >
                      <FiEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={isDeleting && deleteId === item._id}
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                      title="Delete"
                    >
                      {isDeleting && deleteId === item._id ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <>
                          <FiTrash2 className="mr-1" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date Posted
                      </th>
                      <th className="px-8 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.thumbnail && (
                              <Link to={`/items/${item._id}`}>
                                <img
                                  className="h-12 w-12 rounded-lg object-cover shadow-sm"
                                  src={item.thumbnail}
                                  alt={item.title}
                                />
                              </Link>
                            )}
                            <div className="ml-4">
                              <Link to={`/items/${item._id}`}>
                                <div className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                  {item.title}
                                </div>
                              </Link>
                              <div className="text-sm text-gray-500 mt-1">
                                {item.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                              item.postType === "found"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {item.postType}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                              item.status === "recovered"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {item.status || "active"}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                          {new Date(
                            item.createdAt || item.date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleView(item._id)}
                              className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                              title="View"
                            >
                              <FiEye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(item._id)}
                              className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50"
                              title="Edit"
                            >
                              <FiEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              disabled={isDeleting && deleteId === item._id}
                              className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              {isDeleting && deleteId === item._id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                <FiTrash2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Showing {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyItems;
