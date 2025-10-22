import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink } from "react-router";
import {
  FaHome,
  FaSearch,
  FaPlus,
  FaUser,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import Swal from "sweetalert2";
import logo from "../../assets/logo.svg";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(console.error);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          onClick={() => setDropdownOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
              isActive
                ? "text-blue-600 font-bold bg-blue-50"
                : "hover:bg-gray-100"
            }`
          }
        >
          <FaHome className="text-lg" /> Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/lost-found-items"
          onClick={() => setDropdownOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
              isActive
                ? "text-blue-600 font-bold bg-blue-50"
                : "hover:bg-gray-100"
            }`
          }
        >
          <FaSearch className="text-lg" /> Lost & Found Items
        </NavLink>
      </li>
      {user?.role === "admin" && (
        <>
          <li>
            <NavLink
              to="/admin/dashboard"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100"
            >
              <FaLock className="text-lg" /> Admin Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reported-items"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100"
            >
              <FaLock className="text-lg" /> Reported Items
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-white shadow-md sticky top-0 z-50 px-2 sm:px-4 md:px-6">
      {/* Start Section */}
      <div className="navbar-start flex items-center gap-2">
        {/* Mobile menu */}
        <div className="dropdown lg:hidden">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-ghost p-2"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          <ul
            className={`menu menu-sm dropdown-content mt-2 p-2 shadow-lg bg-white rounded-box w-56 sm:w-64 ${
              dropdownOpen ? "block" : "hidden"
            }`}
          >
            {links}
          </ul>
        </div>

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="WhereIsIt Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
          />
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-300">
            Where<span className="text-green-500">Is</span>It
          </span>
        </NavLink>
      </div>

      {/* Center Section */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">{links}</ul>
      </div>

      {/* End Section */}
      <div className="navbar-end flex items-center gap-2 sm:gap-4">
        {user ? (
          <div className="relative" ref={profileRef}>
            <div
              role="button"
              className="avatar placeholder hover:opacity-80 transition-opacity"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="rounded-full w-full h-full object-cover cursor-pointer"
                  />
                ) : (
                  <span className="text-lg sm:text-xl font-medium">
                    {user.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
            </div>

            {profileDropdownOpen && (
              <ul className="absolute right-0 mt-2 z-20 w-52 sm:w-56 menu bg-white p-2 shadow-lg rounded-box">
                <li className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-900 truncate">
                    {user.name || "User"}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {user.email}
                  </div>
                </li>
                <li>
                  <NavLink
                    to="/my-profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100"
                  >
                    <FaUser /> My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/add-item"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100"
                  >
                    <FaPlus /> Add New Item
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/recovered-items"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100"
                  >
                    <FaLock /> Recovered Items
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-items"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100"
                  >
                    <FaLock /> Manage My Items
                  </NavLink>
                </li>
                <li className="border-t border-gray-100 mt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full px-4 py-2 rounded-md"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <>
            <NavLink className="btn btn-ghost btn-sm sm:btn-md" to="/register">
              Register
            </NavLink>
            <NavLink className="btn btn-primary btn-sm sm:btn-md" to="/sign-in">
              Sign In
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
