import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { axiosInstance } from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const MyProfile = () => {
  const { user, signOutUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch stats/profile together
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile-stats"],
    enabled: !!user,
    queryFn: async () => {
      const [itemsRes, recoveriesRes] = await Promise.all([
        axiosInstance.get("/debug/my-items", { withCredentials: true }),
        axiosInstance.get("/recoveries", { withCredentials: true }),
      ]);

      const itemsPosted =
        itemsRes.data.items?.length || itemsRes.data.itemsFound || 0;

      const recoveries = recoveriesRes.data || [];
      const itemsRecovered = recoveries.filter(
        (r) => r.originalOwner.email === user.email
      ).length;
      const itemsFound = recoveries.filter(
        (r) => r.recoveredBy.email === user.email
      ).length;

      return { itemsPosted, itemsRecovered, itemsFound };
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.clear();
      navigate("/");
    },
    onError: () => toast.error("Failed to logout"),
  });

  if (authLoading || isLoading) return <LoadingSpinner className="mt-8" />;
  if (!user) return <ErrorMessage message="Please sign in to view profile" />;
  if (error) return <ErrorMessage message={error.message} className="mt-8" />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full p-1">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-blue-600">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-blue-100">{user.email}</p>
              {user.isAdmin && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-yellow-400 text-yellow-800 rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Items Posted</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.itemsPosted}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Items Recovered</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.itemsRecovered}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800">Items Found</h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.itemsFound}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/my-items")}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              View My Items
            </button>
            <button
              onClick={() => navigate("/recovered-items")}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              View My Recoveries
            </button>
            <button
              onClick={() => logoutMutation.mutate()}
              className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
              disabled={logoutMutation.isLoading}
            >
              {logoutMutation.isLoading ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
