import { Link, useNavigate } from "react-router";
import { GraduationCap, MapPin, LogOut, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import  DashboardLogoButton  from "./DashboardLogoButton";
import { ThemeToggle } from "./ThemeToggle";

export function DashboardNav({ userName, userType }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <DashboardLogoButton
            isLoggedIn={true}
            userType={userType}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-0"
          >
            <div className="relative">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 absolute -left-1" />
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 ml-3" />
            </div>
            <span className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white ml-2">
              UniMate
            </span>
          </DashboardLogoButton>

          {/* Desktop User Menu */}
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
              {userName && <span className="font-medium">{userName}</span>}
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors px-2 py-2 cursor-pointer"
              >
                <User className="w-5 h-5" />
                {userName && <span className="font-medium">{userName}</span>}
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-2 py-2 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
