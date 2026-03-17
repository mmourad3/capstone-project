import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { GraduationCap, MapPin, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { hasCompletedQuestionnaire } from "../utils/storageUtils";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setVerificationStatus("error");
      setErrorMessage("No verification token provided");
      return;
    }

    // TODO: Backend Integration
    // Send GET request to your Express/MySQL backend:
    // GET /api/auth/verify-email?token={token}
    // 
    // Backend should:
    // 1. Verify the token exists in the database
    // 2. Check if the token has expired (24 hours)
    // 3. Update user's is_verified=true in MySQL database
    // 4. Delete the verification token
    // 5. Return success or error response
    
    // Mock API call - replace with actual fetch to your backend
    // fetch(`/api/auth/verify-email?token=${token}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.success) {
    //       setVerificationStatus("success");
    //     } else {
    //       setVerificationStatus("error");
    //       setErrorMessage(data.message || "Verification failed");
    //     }
    //   })
    //   .catch(error => {
    //     setVerificationStatus("error");
    //     setErrorMessage("An error occurred during verification");
    //   });

    // For demo purposes, simulate verification after 2 seconds
    setTimeout(() => {
      // Set user as verified in localStorage
      localStorage.setItem('isEmailVerified', 'true');
      
      // Clear signup form data since account is now verified
      localStorage.removeItem('signupFormData');
      
      setVerificationStatus("success");
      
      // Show success toast
      toast.success('Account created successfully! Welcome to UniMate.', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Auto-redirect based on role after a short delay
      const userRole = localStorage.getItem('userRole');
      const questionnaireCompleted = hasCompletedQuestionnaire();
      
      setTimeout(() => {
        if (userRole === 'dorm-seeker' || userRole === 'dorm-provider') {
          // If questionnaire is already completed, go to login
          // If not completed, go to questionnaire
          if (questionnaireCompleted) {
            navigate('/login');
          } else {
            navigate('/lifestyle-questionnaire', { 
              state: { 
                role: userRole,
                name: localStorage.getItem('userName')
              } 
            });
          }
        } else if (userRole === 'carpool') {
          navigate('/login');
        } else {
          // Fallback to login if role is unknown
          navigate('/login');
        }
      }, 2500); // Give user 2.5 seconds to see the success message
    }, 2000);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 sm:mb-8 cursor-pointer">
          <div className="relative">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400 absolute -left-1" />
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 ml-3 sm:ml-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white ml-2">
            UniMate
          </span>
        </Link>

        {/* Verification Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            {verificationStatus === "verifying" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Verifying Your Email
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {verificationStatus === "success" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Email Verified!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {(() => {
                    const userRole = localStorage.getItem('userRole');
                    const questionnaireCompleted = hasCompletedQuestionnaire();
                    
                    if ((userRole === 'dorm-seeker' || userRole === 'dorm-provider') && !questionnaireCompleted) {
                      return 'Your email has been verified! Redirecting you to complete your lifestyle questionnaire...';
                    } else if ((userRole === 'dorm-seeker' || userRole === 'dorm-provider') && questionnaireCompleted) {
                      return 'Your email has been verified! Redirecting you to login...';
                    } else if (userRole === 'carpool') {
                      return 'Your email has been verified! Redirecting you to login...';
                    } else {
                      return 'Your email has been successfully verified. You can now log in to your account.';
                    }
                  })()}
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                    <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">
                      Redirecting automatically...
                    </p>
                  </div>
                </div>
              </>
            )}

            {verificationStatus === "error" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Verification Failed
                </h1>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {errorMessage || "The verification link is invalid or has expired."}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  This could happen if the link has expired (after 24 hours) or has already been used.
                  Please try signing up again or contact support for assistance.
                </p>
                <div className="space-y-3">
                  <Link
                    to="/signup"
                    className="block w-full bg-blue-500 dark:bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                  >
                    Sign Up Again
                  </Link>
                  <Link
                    to="/contact"
                    className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium cursor-pointer"
                  >
                    Contact Support
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}