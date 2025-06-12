import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
              <svg
                className="w-8 h-8 text-emerald-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-xl font-bold text-white">StudentFuel</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-emerald-600"
                }`
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/list"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-emerald-600"
                }`
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              All Students
            </NavLink>
            <NavLink
              to="/add-student"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-emerald-600"
                }`
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              Add Student
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-emerald-600"
                }`
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              Profile
            </NavLink>
            <button
              className="px-3 py-2 rounded-lg font-semibold text-gray-300 hover:text-white hover:bg-red-600 transition-all duration-200"
              onClick={() => alert("Logout functionality to be implemented")}
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md p-2"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-gray-300 hover:text-white hover:bg-emerald-600"
              }`
            }
            onClick={closeMobileMenu}
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/list"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-gray-300 hover:text-white hover:bg-emerald-600"
              }`
            }
            onClick={closeMobileMenu}
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            All Students
          </NavLink>
          <NavLink
            to="/add-student"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-gray-300 hover:text-white hover:bg-emerald-600"
              }`
            }
            onClick={closeMobileMenu}
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            Add Student
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-gray-300 hover:text-white hover:bg-emerald-600"
              }`
            }
            onClick={closeMobileMenu}
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            Profile
          </NavLink>
          <button
            className="block w-full text-left px-3 py-2 rounded-lg font-semibold text-gray-300 hover:text-white hover:bg-red-600 transition-all duration-200"
            onClick={() => {
              alert("Logout functionality to be implemented");
              closeMobileMenu();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <style>{`
        .shadow-3xl {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </nav>
  );
};

export default Nav;