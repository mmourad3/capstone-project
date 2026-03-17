import { Link, useLocation, useNavigate } from "react-router";
import {
  Shield,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Terms() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user came from signup page - use sessionStorage to persist across re-renders
  const from = location.state?.from || sessionStorage.getItem('termsFrom');
  const formData = location.state?.formData || JSON.parse(sessionStorage.getItem('termsFormData') || 'null');

  // Store in sessionStorage when state is available
  if (location.state?.from) {
    sessionStorage.setItem('termsFrom', location.state.from);
    if (location.state?.formData) {
      sessionStorage.setItem('termsFormData', JSON.stringify(location.state.formData));
    }
  }

  console.log('Terms page - from:', from, 'formData:', formData); // Debug log

  const handleBackNavigation = () => {
    if (from === 'signup' && formData) {
      // Clear sessionStorage
      sessionStorage.removeItem('termsFrom');
      sessionStorage.removeItem('termsFormData');
      // Navigate back to signup with preserved form data
      navigate('/signup', { state: { formData } });
    } else {
      // Clear sessionStorage
      sessionStorage.removeItem('termsFrom');
      sessionStorage.removeItem('termsFormData');
      // Navigate back to home
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Conditional Navigation: Only show Navbar if NOT from signup */}
      {from !== 'signup' && <Navbar />}

      {/* Back Button - Always visible */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            handleBackNavigation();
          }}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {from === 'signup' ? 'Back to Sign Up' : 'Back to Home'}
        </Link>
      </div>

      <div className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/40 w-16 h-16 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Terms & <span className="text-blue-600 dark:text-blue-400">Conditions</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Last Updated: February 28, 2026
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-8 sm:py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                Welcome to UniMate! By accessing or using our platform, you
                agree to be bound by these Terms and Conditions. Please read
                them carefully. If you do not agree with any part of these
                terms, you may not use our service.
              </p>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="pb-12 sm:pb-16 px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Acceptance of Terms */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    1. Acceptance of Terms
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  By creating an account or using UniMate, you acknowledge that
                  you have read, understood, and agree to be bound by these
                  Terms and Conditions and our Privacy Policy.
                </p>
                <p>
                  We reserve the right to modify these terms at any time.
                  Continued use of the platform after changes constitutes
                  acceptance of the modified terms.
                </p>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    2. Eligibility
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  UniMate is exclusively for university students. To use this
                  platform, you must:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Be currently enrolled in an accredited university</li>
                  <li>Be at least 18 years of age</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>
                    Maintain a valid university email address for verification
                  </li>
                </ul>
                <p>
                  We reserve the right to verify your student status at any
                  time and suspend accounts that do not meet eligibility
                  requirements.
                </p>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    3. User Responsibilities
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>As a user of UniMate, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Provide accurate, current, and complete information in your
                    profile and listings
                  </li>
                  <li>
                    Maintain the security and confidentiality of your account
                    credentials
                  </li>
                  <li>
                    Treat other users with respect and professionalism
                  </li>
                  <li>
                    Use the platform only for legitimate roommate finding and
                    carpooling purposes
                  </li>
                  <li>
                    Not engage in fraudulent, abusive, or illegal activities
                  </li>
                  <li>
                    Not post false, misleading, or discriminatory content
                  </li>
                  <li>
                    Not share your account with others or create multiple
                    accounts
                  </li>
                </ul>
              </div>
            </div>

            {/* Listings and Matching */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    4. Listings and Matching
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  <strong>Dorm Listings:</strong> Users posting dorm listings
                  must provide accurate information about the property,
                  location, rent, and availability. All financial transactions
                  and lease agreements are between users and are not managed by
                  UniMate.
                </p>
                <p>
                  <strong>Carpool Listings:</strong> Users creating or joining
                  carpools must provide accurate travel details. Safety is your
                  responsibility - always verify the identity of other users
                  before sharing rides.
                </p>
                <p>
                  <strong>AI Matching:</strong> Our AI-based compatibility
                  matching is provided as a convenience and should not be the
                  sole basis for decisions. We do not guarantee compatible
                  matches or successful roommate relationships.
                </p>
              </div>
            </div>

            {/* Privacy and Data */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    5. Privacy and Data Use
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  Your privacy is important to us. By using UniMate, you
                  consent to the collection and use of your information as
                  described in our Privacy Policy, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Profile information and lifestyle questionnaire data</li>
                  <li>Usage data for improving our AI matching algorithms</li>
                  <li>Communication preferences and contact information</li>
                </ul>
                <p>
                  We will never sell your personal information to third parties.
                  Data collected is used solely to improve your experience on
                  the platform.
                </p>
              </div>
            </div>

            {/* Communication */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    6. Communication and WhatsApp Integration
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  UniMate facilitates communication between users through
                  WhatsApp integration. By sharing your WhatsApp contact
                  information, you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Consent to other users contacting you via WhatsApp for
                    platform-related purposes
                  </li>
                  <li>
                    Understand that communications outside our platform are not
                    monitored or controlled by UniMate
                  </li>
                  <li>
                    Agree to use the contact information responsibly and only
                    for legitimate purposes
                  </li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    7. Limitation of Liability
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  UniMate is a platform that connects students. We are not
                  responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    The accuracy, quality, or legality of listings posted by
                    users
                  </li>
                  <li>
                    The actions, conduct, or safety of users on or off the
                    platform
                  </li>
                  <li>
                    Any disputes, damages, or losses arising from user
                    interactions
                  </li>
                  <li>
                    Financial transactions, lease agreements, or carpool
                    arrangements between users
                  </li>
                  <li>
                    Any property damage, personal injury, or other harm
                    resulting from use of the platform
                  </li>
                </ul>
                <p>
                  Use of UniMate is at your own risk. We strongly recommend
                  conducting thorough due diligence before entering any
                  agreements with other users.
                </p>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    8. Prohibited Activities
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>The following activities are strictly prohibited:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Harassment, discrimination, or hate speech of any kind
                  </li>
                  <li>Posting fraudulent or misleading listings</li>
                  <li>
                    Using the platform for commercial purposes without
                    authorization
                  </li>
                  <li>
                    Collecting user data for unauthorized purposes (scraping,
                    spam, etc.)
                  </li>
                  <li>
                    Attempting to bypass security features or access restricted
                    areas
                  </li>
                  <li>
                    Impersonating other users or providing false identification
                  </li>
                </ul>
                <p>
                  Violation of these terms may result in immediate account
                  suspension or termination.
                </p>
              </div>
            </div>

            {/* Account Termination */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    9. Account Termination
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  We reserve the right to suspend or terminate your account at
                  any time for violations of these terms, fraudulent activity,
                  or any behavior deemed harmful to the platform or its users.
                </p>
                <p>
                  You may delete your account at any time through your profile
                  settings. Upon deletion, your personal information will be
                  removed in accordance with our Privacy Policy.
                </p>
              </div>
            </div>

            {/* Changes to Service */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    10. Changes to Service
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  UniMate reserves the right to modify, suspend, or discontinue
                  any aspect of the service at any time without prior notice.
                  We are not liable for any modifications or interruptions to
                  the service.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    11. Governing Law
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  These Terms and Conditions are governed by and construed in
                  accordance with applicable laws. Any disputes arising from
                  these terms or use of the platform shall be resolved through
                  binding arbitration.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    12. Contact Us
                  </h2>
                </div>
              </div>
              <div className="ml-0 md:ml-16 space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  If you have questions about these Terms and Conditions, please
                  contact us:
                </p>
                <ul className="list-none space-y-2">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:legal@unimate.edu"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      legal@unimate.edu
                    </a>
                  </li>
                  <li>
                    <strong>Support:</strong>{" "}
                    <a
                      href="mailto:support@unimate.edu"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      support@unimate.edu
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 sm:py-16 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm sm:text-base">
              Join thousands of students finding roommates and carpools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-blue-500 dark:bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium cursor-pointer"
              >
                Create Account
              </Link>
              <Link
                to="/contact"
                className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium border border-gray-300 dark:border-gray-600 cursor-pointer"
              >
                Questions? Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}