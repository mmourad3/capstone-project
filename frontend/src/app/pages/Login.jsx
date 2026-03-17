import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, MapPin, GraduationCap, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import { navigateToDashboard } from "../utils/navigationHelpers";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => {
    // Load remembered email if exists
    return localStorage.getItem('rememberedEmail') || "";
  });
  const [password, setPassword] = useState(() => {
    // Load remembered password if exists
    return localStorage.getItem('rememberedPassword') || "";
  });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    // Check if credentials are saved
    return !!(localStorage.getItem('rememberedEmail') && localStorage.getItem('rememberedPassword'));
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate university email format
  const validateUniversityEmail = (emailValue) => {
    const emailLower = emailValue.toLowerCase().trim();
    
    // List of allowed university email domains
    const allowedDomains = [
      // Lebanese Universities
      '.edu.lb',              // All Lebanese universities with .edu.lb
      '@aub.edu.lb',          // American University of Beirut (AUB)
      '@lau.edu',             // Lebanese American University (LAU) - NO .lb suffix!
      '@lau.edu.lb',          // LAU alternative domain (some staff/alumni)
      '@usj.edu.lb',          // Université Saint-Joseph (USJ)
      '@ul.edu.lb',           // Lebanese University
      '@std.balamand.edu.lb', // University of Balamand
      '@ndu.edu.lb',          // Notre Dame University - Louaize (NDU)
      '@haigazian.edu.lb',    // Haigazian University
      '@jinan.edu.lb',        // Jinan University
      '@aust.edu.lb',         // American University of Science and Technology
      '@bau.edu.lb',          // Beirut Arab University
      '@liu.edu.lb',          // Lebanese International University
      '@mubs.edu.lb',         // Modern University for Business and Science
      '@rhu.edu.lb',          // Rafik Hariri University
      '@gu.edu.lb',           // Global University
      '@mu.edu.lb',           // Al Maaref University
      '@arts.edu.lb',         // Lebanese Academy of Fine Arts (ALBA)
      
      // International universities (optional)
      '.edu',        // US universities
      '.ac.uk',      // UK universities  
      '.edu.au',     // Australian universities
      '.ac.nz',      // New Zealand universities
      '.edu.sg',     // Singapore universities
      '.ac.in',      // Indian universities
      '.edu.pk',     // Pakistani universities
    ];
    
    // Check if email ends with any allowed domain
    return allowedDomains.some(domain => emailLower.endsWith(domain));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setIsLoading(true);
    
    // Validate university email
    if (!validateUniversityEmail(email)) {
      setError("Please use a valid university email address (.edu, .edu.lb, etc.)");
      setIsLoading(false);
      return;
    }
    
    try {
      // Try API first
      const response = await authAPI.login({ 
        email: email.toLowerCase().trim(), 
        password 
      });

      // Handle Remember Me functionality
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      // Navigate based on role
      const userRole = response.user.role;
      toast.success(`Welcome back! Logged in successfully.`, {
        position: "top-right",
        autoClose: 3000,
      });
      navigateToDashboard(userRole, navigate);
    } catch (err) {
      console.log('ℹ️ Backend not available - using local demo mode');
      
      // FALLBACK: Use localStorage (for demo/development without backend)
      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');
      const storedRole = localStorage.getItem('userRole');
      const isVerified = localStorage.getItem('isEmailVerified') === 'true';

      if (!storedEmail || !storedPassword) {
        setError("No account found. Please sign up first.");
        setIsLoading(false);
        return;
      }

      if (email.toLowerCase().trim() !== storedEmail) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (password !== storedPassword) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (!isVerified) {
        setError("Please verify your email before logging in. Check your inbox.");
        setIsLoading(false);
        return;
      }

      // Set userId for offline mode (use email as identifier)
      localStorage.setItem('userId', email.toLowerCase().trim());
      
      // Handle Remember Me functionality
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      // Login successful - navigate based on role
      toast.success(`Welcome back! Logged in successfully.`, {
        position: "top-right",
        autoClose: 3000,
      });
      navigateToDashboard(storedRole, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 sm:py-12">
      {/* Back to Home Button */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 sm:mb-8 cursor-pointer">
          <div className="relative">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400 absolute -left-1" />
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-500 ml-3 sm:ml-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white ml-2">
            UniMate
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                University Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
                className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {error && (
            <div className="mt-3 text-center text-red-500 dark:text-red-400 text-sm sm:text-base">
              <AlertCircle className="inline-block w-4 h-4 mr-1" />
              {error}
            </div>
          )}

          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium cursor-pointer">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}