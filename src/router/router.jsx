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
import UserProfile from "../pages/User/Profile";  // Added import
import LostItems from "../pages/Items/LostItems";
import FoundItems from "../pages/Items/FoundItems";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ReportedItems from "../pages/Admin/ReportedItems";
import NotFound from "../pages/Shared/NotFound";

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
        path: "lost-items",
        Component: LostItems,
        loader: () =>
          fetch(`${import.meta.env.VITE_API_URL}/items?type=lost&status=active`),
      },
      {
        path: "found-items",
        Component: FoundItems,
        loader: () =>
          fetch(`${import.meta.env.VITE_API_URL}/items?type=found&status=active`),
      },
      {
        path: "items/:id",
        Component: ItemDetails,
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/items/${params.id}`),
      },

      // User protected routes
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
        path: "profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
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
