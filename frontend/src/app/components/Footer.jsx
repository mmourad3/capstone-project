import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-sm text-gray-600 dark:text-gray-300">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              Contact
            </Link>
            <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              Privacy
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
            University students only • © 2026 UniMate
          </p>
        </div>
      </div>
    </footer>
  );
}