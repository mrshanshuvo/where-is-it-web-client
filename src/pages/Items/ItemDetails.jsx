import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext); // <-- use context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recoveryData, setRecoveryData] = useState({
    recoveredLocation: "",
    recoveredDate: new Date(),
    notes: "",
  });

  // Fetch item using React Query
  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/items/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Recovery mutation
  const recoveryMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(`/items/${id}/recover`, payload, {
        withCredentials: true, // cookies handled by axiosInstance
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Recovery recorded successfully!");
      setIsModalOpen(false);
      setRecoveryData({
        recoveredLocation: "",
        recoveredDate: new Date(),
        notes: "",
      });
      queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
    onError: (err) => {
      toast.error(
        `Recovery failed: ${err?.response?.data?.message || err.message}`
      );
    },
  });

  const handleRecoveryChange = (e) => {
    const { name, value } = e.target;
    setRecoveryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) =>
    setRecoveryData((prev) => ({ ...prev, recoveredDate: date }));

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please sign in first");
    if (user.email === item.contactEmail)
      return toast.error("You cannot recover your own item");

    const payload = {
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
        email: item.contactEmail,
      },
      recoveredBy: {
        userId: user.uid,
        name: user.name || "Anonymous",
        email: user.email,
        photoURL: user.photoURL || null,
      },
      recoverySubmittedAt: new Date().toISOString(),
    };

    recoveryMutation.mutate(payload);
  };

  const handleActionClick = () => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Sign In Required",
        text: "You need to sign in to claim this item!",
        showCancelButton: true,
        confirmButtonText: "Sign In",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/sign-in", { state: { from: `/items/${id}` } });
        }
      });
      return;
    }

    if (user.email === item.contactEmail) {
      toast.error("You cannot recover your own item");
      return;
    }

    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!item) return <ErrorMessage message="Item not found" />;

  const postType = item.postType?.toLowerCase();
  const isRecovered = item.status === "recovered";
  const isOwner = user?.email === item.contactEmail;

  const getActionButtonText = () => {
    if (isRecovered) return "Already Recovered";
    if (isOwner) return "Your Item";
    return postType === "found" ? "This is Mine!" : "Found This!";
  };

  const getModalTitle = () =>
    postType === "found" ? "Claim This Item" : "Report Recovery";
  const getLocationLabel = () =>
    postType === "found" ? "Where did you receive it?" : "Where was it found?";
  const getDateLabel = () =>
    postType === "found" ? "Date Received" : "Date Found";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
            <div className="flex items-center mt-2">
              <span
                className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  postType === "found"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.postType}
              </span>
              <span className="ml-2 text-sm text-gray-600">
                {item.category}
              </span>
            </div>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              isRecovered
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {isRecovered ? "Recovered" : "Active"}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/400?text=No+Image")
                }
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          <div>
            <p className="text-gray-700 whitespace-pre-line mb-4">
              {item.description || "No description provided"}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-gray-800">
                  {item.location || "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-gray-800">
                  {item.date
                    ? new Date(item.date).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="text-gray-800 capitalize">{item.status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Posted By</h3>
                <p className="text-gray-800">
                  {item.contactName || "Anonymous"}
                </p>
              </div>
            </div>

            <button
              onClick={handleActionClick}
              disabled={isRecovered || isOwner}
              className={`px-4 py-2 rounded-md font-medium ${
                isRecovered || isOwner
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : postType === "found"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {getActionButtonText()}
            </button>
          </div>
        </div>
      </div>

      {/* Recovery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {getModalTitle()}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={recoveryMutation.isLoading}
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={recoveryMutation.isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getDateLabel()} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={recoveryData.recoveredDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxDate={new Date()}
                    required
                    disabled={recoveryMutation.isLoading}
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    disabled={recoveryMutation.isLoading}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={recoveryMutation.isLoading}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryMutation.isLoading}
                    className={`px-4 py-2 rounded-md text-white ${
                      recoveryMutation.isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : postType === "found"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {recoveryMutation.isLoading
                      ? "Processing..."
                      : "Submit Recovery"}
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
