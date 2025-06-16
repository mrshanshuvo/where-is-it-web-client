import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import { FaHome, FaSearch, FaPlus, FaUser, FaSignOutAlt, FaLock } from 'react-icons/fa';

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOutUser()
      .then(() => console.log('Signed out successfully'))
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
        <NavLink to='/lost-items' onClick={() => setDropdownOpen(false)} className="flex items-center gap-2">
          <FaSearch className="text-lg" />
          Lost Items
        </NavLink>
      </li>
      <li>
        <NavLink to='/found-items' onClick={() => setDropdownOpen(false)} className="flex items-center gap-2">
          <FaSearch className="text-lg" />
          Found Items
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to='/my-items' onClick={() => setDropdownOpen(false)} className="flex items-center gap-2">
              <FaLock className="text-lg" />
              My Items
            </NavLink>
          </li>
          <li>
            <NavLink to='/recovered-items' onClick={() => setDropdownOpen(false)} className="flex items-center gap-2">
              <FaLock className="text-lg" />
              Recovered Items
            </NavLink>
          </li>
        </>
      )}
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
            src="src\assets\logo.svg"
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
            <NavLink
              to="/report-item"
              className="btn btn-primary btn-sm md:btn-md gap-2"
            >
              <FaPlus />
              <span className="hidden sm:inline">Report Item</span>
            </NavLink>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar placeholder hover:opacity-80 transition-opacity"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
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
              <ul
                tabIndex={0}
                className={`dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-box w-52 mt-2 ${profileDropdownOpen ? 'block' : 'hidden'}`}
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <li className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-900 truncate">
                    {user.displayName || "User"}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {user.email}
                  </div>
                </li>
                <li>
                  <NavLink to="/profile" className="flex items-center gap-2">
                    <FaUser />
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/add-item" className="flex items-center gap-2">
                    <FaPlus />
                    Add New Item
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/manage-items" className="flex items-center gap-2">
                    <FaLock />
                    Manage My Items
                  </NavLink>
                </li>
                <li className="border-t border-gray-100 mt-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full px-4 py-2"
                  >
                    <FaSignOutAlt />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <NavLink
              className="btn btn-ghost btn-sm md:btn-md"
              to="/register"
            >
              Register
            </NavLink>
            <NavLink
              className="btn btn-primary btn-sm md:btn-md"
              to="/signIn"
            >
              Sign In
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;