import { Link, useLocation } from "react-router";
import { GraduationCap, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { RedirectToDashboard } from "./RedirectToDashboard";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ isLoggedIn = false, userType = null }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <RedirectToDashboard 
            isLoggedIn={isLoggedIn} 
            userType={userType}
            className="flex items-center gap-2 group cursor-pointer bg-transparent border-0"
          >
            <div className="relative">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 absolute -left-1" />
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 ml-3" />
            </div>
            <span className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white ml-2">
              UniMate
            </span>
          </RedirectToDashboard>

          {/* Desktop Navigation */}
          {!isLoggedIn && (
            <>
              <div className="hidden md:flex items-center gap-6">
                <ThemeToggle />
                <Link
                  to="/"
                  className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                    location.pathname === "/" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                    location.pathname === "/about" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/how-it-works"
                  className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                    location.pathname === "/how-it-works" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
                  }`}
                >
                  How It Works
                </Link>
                <Link
                  to="/login"
                  className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${
                    location.pathname === "/login" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile: Dark Mode + Menu Button */}
              <div className="md:hidden flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {!isLoggedIn && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded cursor-pointer ${
                  location.pathname === "/" ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded cursor-pointer ${
                  location.pathname === "/about" ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
              >
                About
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded cursor-pointer ${
                  location.pathname === "/how-it-works" ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-2 rounded cursor-pointer ${
                  location.pathname === "/login" ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-center cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}