import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import SignIn from "../pages/Auth/SignIn";
import ItemDetails from "../pages/Items/ItemDetails";
import PrivateRoute from "./PrivateRoute";
import ReportItem from "../pages/Items/ReportItem";
import MyItems from "../pages/User/MyItems";
import RecoveredItems from "../pages/User/RecoveredItems";
import ManageItems from "../pages/User/ManageItems";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ReportedItems from "../pages/Admin/ReportedItems";
import NotFound from "../pages/Shared/NotFound";
import LostFoundItems from "../pages/Items/LostFoundItems";
import AddItems from "../pages/Items/AddItems";
import { auth } from "../firebase/firebase.config";
import MyProfile from "../pages/User/MyProfile";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <NotFound />,
    children: [
      { index: true, Component: Home },
      { path: "register", Component: Register },
      { path: "sign-in", Component: SignIn },

      // Public item routes
      {
        path: "lost-found-items",
        Component: LostFoundItems,
        loader: () =>
          fetch(`${import.meta.env.VITE_API_URL}/items?type=lost&status=active`),
      },
      {
        path: "items/:id",
        Component: ItemDetails,
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/items/${params.id}`),
      },

      // User protected routes
      {
        path: "add-items",
        element: (
          <PrivateRoute>
            <AddItems />
          </PrivateRoute>
        ),
      },
      {
        path: "report-item",
        element: (
          <PrivateRoute>
            <ReportItem />
          </PrivateRoute>
        ),
      },
      {
        path: "my-items",
        element: (
          <PrivateRoute>
            <MyItems />
          </PrivateRoute>
        ),
        loader: () => {
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user) throw new Response("Unauthorized", { status: 401 });
          return fetch(`${import.meta.env.VITE_API_URL}/items/user/${user.uid}`);
        },
      },
      {
        path: "recovered-items",
        element: (
          <PrivateRoute>
            <RecoveredItems />
          </PrivateRoute>
        ),
      },
      {
        path: "manage-items",
        element: (
          <PrivateRoute>
            <ManageItems />
          </PrivateRoute>
        ),
      },
      {
        path: "my-profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
        loader: async () => {
          const user = auth.currentUser;
          if (!user) throw new Error("Unauthorized");
          const token = await user.getIdToken();
          const response = await fetch(`http://localhost:5000/api/users/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error("Failed to fetch profile");
          return response.json();
        }
      },

      // Admin protected routes
      {
        path: "admin/dashboard",
        element: (
          <PrivateRoute adminOnly={true}>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/reported-items",
        element: (
          <PrivateRoute adminOnly={true}>
            <ReportedItems />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;