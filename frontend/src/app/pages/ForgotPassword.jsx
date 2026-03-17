import { useState } from "react";
import { Link } from "react-router";
import { GraduationCap, MapPin, ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { authAPI } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
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
    setError(""); // Clear previous errors
    setIsLoading(true);

    // Validate university email
    if (!validateUniversityEmail(email)) {
      setError("Please use a valid university email address (.edu, .edu.lb, etc.)");
      setIsLoading(false);
      return;
    }

    try {
      // Try API first
      await authAPI.forgotPassword(email.toLowerCase().trim());
      
      // Success - show confirmation message
      setIsSubmitted(true);
    } catch (err) {
      console.log('ℹ️ Backend not available - using local demo mode');
      
      // FALLBACK: Use localStorage (for demo/development without backend)
      const storedEmail = localStorage.getItem('userEmail');
      
      if (!storedEmail || email.toLowerCase().trim() !== storedEmail) {
        setError("No account found with this email address. Please check your email or sign up.");
        setIsLoading(false);
        return;
      }

      // Email exists - show success message
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 sm:py-12">
      {/* Back to Login Button */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
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

        {/* Forgot Password Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6 sm:mb-8">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
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

                <button
                  type="submit"
                  className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30 text-sm sm:text-base cursor-pointer"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 dark:text-red-400 text-sm sm:text-base mt-4">
                  <AlertCircle className="w-4 h-4 inline-block mr-2" />
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium cursor-pointer"
                >
                  try again
                </button>
              </p>
              <Link
                to="/login"
                className="inline-block bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium cursor-pointer"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}