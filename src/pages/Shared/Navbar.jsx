import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import { FaHome, FaSearch, FaPlus, FaUser, FaSignOutAlt, FaLock } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';
import Swal from 'sweetalert2';
import logo from '../../assets/logo.svg';

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(console.error);
  };

  const links = (
    <>
      <li>
        <NavLink to='/' onClick={() => setDropdownOpen(false)} className="flex items-center gap-2">
          <FaHome className="text-lg" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to='/lost-found-items' onClick={() => setDropdownOpen(false)} className="flex items-center gap-2">
          <FaSearch className="text-lg" />
          Lost & Found Items
        </NavLink>
      </li>
      {user?.role === 'admin' && (
        <>
          <li>
            <NavLink to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2">
              <FaLock className="text-lg" />
              Admin Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/reported-items" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2">
              <FaLock className="text-lg" />
              Reported Items
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-white shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-ghost lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <ul
            className={`menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-white rounded-box w-60 ${dropdownOpen ? 'block' : 'hidden'}`}
          >
            {links}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="WhereIsIt Logo"
            className="w-10 h-10 object-contain"
          />
          <NavLink
            to="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-300"
          >
            Where<span className="text-green-500">Is</span>It
          </NavLink>
        </div>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">{links}</ul>
      </div>

      {/* Auth section */}
      <div className="navbar-end flex items-center gap-4">
        {user ? (
          <>
            <div className="relative">
              <div
                role="button"
                className="avatar placeholder hover:opacity-80 transition-opacity"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="rounded-full w-full h-full object-cover"
                      title={user.displayName || user.email}
                    />
                  ) : (
                    <span className="text-lg font-medium">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              {profileDropdownOpen && (
                <ul className="absolute right-0 mt-2 z-10 w-52 menu bg-white p-2 shadow-lg rounded-box">
                  <li className="px-4 py-2 border-b border-gray-100">
                    <div className="font-medium text-gray-900 truncate">
                      {user.name || user.displayName || "User"}

                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user.email}
                    </div>
                  </li>
                  <li>
                    <NavLink to="/my-profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2">
                      <FaUser />
                      My Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/add-items" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2">
                      <FaPlus />
                      Add New Item
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/recovered-items' onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2">
                      <FaLock />
                      Recovered Items
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-items" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2">
                      <FaLock />
                      Manage My Items
                    </NavLink>
                  </li>
                  <li className="border-t border-gray-100 mt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full px-4 py-2"
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink className="btn btn-ghost btn-sm md:btn-md" to="/register">
              Register
            </NavLink>
            <NavLink className="btn btn-primary btn-sm md:btn-md" to="/sign-in">
              Sign In
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;