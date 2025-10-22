import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../firebase/firebase.config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    uid: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    itemsPosted: 0,
    itemsRecovered: 0,
    itemsFound: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) throw new Error("Please sign in to view profile");

        const token = await user.getIdToken();

        // Fetch profile data
        const profileResponse = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const profileData = await profileResponse.json();
        setUserData(profileData);

        // Fetch user's items count
        const itemsResponse = await fetch(
          "http://localhost:5000/api/debug/my-items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch recoveries data
        const recoveriesResponse = await fetch(
          "http://localhost:5000/api/recoveries",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json();
          setStats((prev) => ({ ...prev, itemsPosted: itemsData.itemsFound }));
        }

        if (recoveriesResponse.ok) {
          const recoveriesData = await recoveriesResponse.json();

          // Calculate stats from recoveries
          const recoveredCount = recoveriesData.filter(
            (r) => r.originalOwner.email === user.email
          ).length;

          const foundCount = recoveriesData.filter(
            (r) => r.recoveredBy.email === user.email
          ).length;

          setStats((prev) => ({
            ...prev,
            itemsRecovered: recoveredCount,
            itemsFound: foundCount,
          }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
    }
  };

  if (loading) return <LoadingSpinner className="mt-8" />;
  if (error) return <ErrorMessage message={error} className="mt-8" />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full p-1">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-blue-600">
                    {userData.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-blue-100">{userData.email}</p>
              {userData.isAdmin && (
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
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View My Items
            </button>
            <button
              onClick={() => navigate("/recovered-items")}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View My Recoveries
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
