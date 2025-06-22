import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import SignIn from "../pages/Auth/SignIn";
import ItemDetails from "../pages/Items/ItemDetails";
import PrivateRoute from "./PrivateRoute";
import RecoveredItems from "../pages/User/RecoveredItems";
import NotFound from "../pages/Shared/NotFound";
import LostFoundItems from "../pages/Items/LostFoundItems";
import AddItems from "../pages/Items/AddItems";
import MyProfile from "../pages/User/MyProfile";
import MyItems from "../pages/User/MyItems";
import UpdateItem from "../pages/User/UpdateItem";

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
          fetch(
            `${import.meta.env.VITE_API_URL}/items?type=lost&status=active`
          ),
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
        path: "my-items",
        element: (
          <PrivateRoute>
            <MyItems />
          </PrivateRoute>
        ),
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
        path: "my-profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "updateItems/:id",
        element: (
          <PrivateRoute>
            <UpdateItem />
          </PrivateRoute>
        )
      }
    ],
  },
]);

export default router;
