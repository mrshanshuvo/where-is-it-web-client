import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOutUser()
      .then(() => console.log('Signed out successfully'))
      .catch(console.error);
  };

  const links = (
    <>
      <li>
        <NavLink to='/' onClick={() => setDropdownOpen(false)}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to='/lost-items' onClick={() => setDropdownOpen(false)}>
          Lost Items
        </NavLink>
      </li>
      <li>
        <NavLink to='/found-items' onClick={() => setDropdownOpen(false)}>
          Found Items
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to='/my-items' onClick={() => setDropdownOpen(false)}>
            My Items
          </NavLink>
        </li>
      )}
      {user?.role === 'admin' && (
        <>
          <li>
            <NavLink to="/admin/dashboard" onClick={() => setDropdownOpen(false)}>
              Admin Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/reported-items" onClick={() => setDropdownOpen(false)}>
              Reported Items
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-ghost lg:hidden"
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
            className={`menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 ${dropdownOpen ? 'block' : 'hidden'}`}
          >
            {links}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="src\assets\logo.svg"
            alt="WhereIsIt Logo"
            className="w-8 h-8 object-contain"
          />
          <NavLink
            to="/"
            className="text-2xl font-bold text-primary hover:text-primary-focus transition duration-300"
          >
            Where<span className="text-accent">Is</span>It
          </NavLink>
        </div>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{links}</ul>
      </div>

      {/* Auth section */}
      <div className="navbar-end flex items-center gap-4">
        {user ? (
          <>
            <NavLink to="/report-item" className="btn btn-primary btn-sm">
              + Report Item
            </NavLink>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="rounded-full" />
                  ) : (
                    <span>{user.displayName?.charAt(0) || user.email?.charAt(0)}</span>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                <li>
                  <NavLink to="/profile">My Profile</NavLink>
                </li>
                <li>
                  <button onClick={handleSignOut}>Sign Out</button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <NavLink className="btn btn-ghost btn-sm" to="/register">Register</NavLink>
            <NavLink className="btn btn-primary btn-sm" to="/signIn">Sign In</NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;