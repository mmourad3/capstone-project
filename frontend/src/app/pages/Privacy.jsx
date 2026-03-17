import { Link, useLocation, useNavigate } from "react-router";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
  Cookie,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Privacy() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user came from signup page - use sessionStorage to persist across re-renders
  const from = location.state?.from || sessionStorage.getItem('privacyFrom');
  const formData = location.state?.formData || JSON.parse(sessionStorage.getItem('privacyFormData') || 'null');

  // Store in sessionStorage when state is available
  if (location.state?.from) {
    sessionStorage.setItem('privacyFrom', location.state.from);
    if (location.state?.formData) {
      sessionStorage.setItem('privacyFormData', JSON.stringify(location.state.formData));
    }
  }

  console.log('Privacy page - from:', from, 'formData:', formData); // Debug log

  const handleBackNavigation = () => {
    if (from === 'signup' && formData) {
      // Clear sessionStorage
      sessionStorage.removeItem('privacyFrom');
      sessionStorage.removeItem('privacyFormData');
      // Navigate back to signup with preserved form data
      navigate('/signup', { state: { formData } });
    } else {
      // Clear sessionStorage
      sessionStorage.removeItem('privacyFrom');
      sessionStorage.removeItem('privacyFormData');
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
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Privacy <span className="text-blue-600 dark:text-blue-400">Policy</span>
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
                At UniMate, we take your privacy seriously. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our platform. Please read this privacy
                policy carefully. If you do not agree with the terms of this
                privacy policy, please do not access the site.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-8 sm:py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            {/* Information We Collect */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Personal Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    We collect information that you provide directly to us when
                    you register for an account, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>Full name</li>
                    <li>University email address</li>
                    <li>University name</li>
                    <li>Phone number (required for WhatsApp communication)</li>
                    <li>Gender</li>
                    <li>Country</li>
                    <li>Profile picture (optional)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Lifestyle Questionnaire Data
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    For dorm-related users, we collect responses to our
                    lifestyle questionnaire including sleep schedules,
                    cleanliness preferences, social habits, and lifestyle
                    choices to provide better roommate matching.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Dorm Listing Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    If you post a dorm listing, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>Address and location details</li>
                    <li>Monthly pricing</li>
                    <li>Available amenities (WiFi, AC, parking, etc.)</li>
                    <li>Availability date</li>
                    <li>Gender preference for roommates</li>
                    <li>Property description and photos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Carpool Listing Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    If you post a carpool listing, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>Weekly schedule (days of the week you're available to carpool)</li>
                    <li>Route details (start and end locations)</li>
                    <li>Gender preferences for passengers/drivers</li>
                    <li>Vehicle information (make, model, year)</li>
                    <li>Departure times and pricing per seat</li>
                    <li>Total available seats</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Browser Storage
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We store your login session and preferences locally in your
                    browser using localStorage and cookies to maintain your
                    session and remember your preferences (such as "Remember me"
                    functionality).
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  How We Use Your Information
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                  <li>Create and manage your account</li>
                  <li>
                    Facilitate roommate matching based on compatibility scores
                  </li>
                  <li>Display and manage dorm and carpool listings</li>
                  <li>
                    Process inquiries and facilitate communication between users
                  </li>
                  <li>Send verification emails and important notifications</li>
                  <li>Improve and personalize your experience</li>
                  <li>Analyze usage patterns to enhance our services</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  How We Share Your Information
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    With Other Users
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    When you post a listing or express interest in a dorm or
                    carpool, your profile information (name, university, and
                    relevant preferences) may be visible to other users. Contact
                    information is only shared when you initiate or respond to
                    an inquiry.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    With Service Providers
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We may share your information with third-party service
                    providers who perform services on our behalf, such as email
                    delivery, hosting services, and analytics providers. These
                    providers are bound by contractual obligations to keep your
                    information confidential.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    For Legal Reasons
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We may disclose your information if required by law or in
                    response to valid requests by public authorities, or to
                    protect our rights, privacy, safety, or property.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Important:</strong> We never sell your personal
                      information to third parties for marketing purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  WhatsApp Integration
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  UniMate facilitates communication between users through
                  WhatsApp. When you contact another user:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                  <li>
                    Your phone number will be shared with the other party to
                    enable direct WhatsApp communication
                  </li>
                  <li>
                    The conversation happens outside UniMate's platform on
                    WhatsApp
                  </li>
                  <li>
                    We do not have access to or control over messages exchanged
                    on WhatsApp
                  </li>
                  <li>
                    WhatsApp's own privacy policy applies to those conversations
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Data Security
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                  <li>Encryption of data in transit using HTTPS</li>
                  <li>Secure password hashing using industry standards</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure database storage with backup systems</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  However, no method of transmission over the internet or
                  electronic storage is 100% secure. While we strive to protect
                  your information, we cannot guarantee absolute security.
                </p>
              </div>
            </div>

            {/* Email Verification */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Email Verification & University Validation
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  To ensure the authenticity of our community, we require
                  university email verification. For major universities with
                  specific email domains, we validate that your selected
                  university matches your email domain. This helps maintain a
                  trusted student community.
                </p>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Cookies and Tracking Technologies
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We use cookies and similar tracking technologies to track
                  activity on our platform and store certain information. Cookies
                  are files with a small amount of data that may include an
                  anonymous unique identifier.
                </p>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Types of Cookies We Use:
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>Essential Cookies:</strong> Required for login,
                      authentication, and basic functionality
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> Remember your
                      settings and preferences (e.g., "Remember me")
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand how
                      users interact with our platform
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You can instruct your browser to refuse all cookies or to
                  indicate when a cookie is being sent. However, if you do not
                  accept cookies, you may not be able to use some portions of our
                  platform.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Your Privacy Rights
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal
                    information we hold about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate
                    or incomplete information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and associated data
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> Opt-out of marketing communications
                    (account-related emails will still be sent)
                  </li>
                  <li>
                    <strong>Data Portability:</strong> Request your data in a
                    structured, machine-readable format
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  To exercise these rights, please contact us through your
                  profile settings or via our contact page.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Data Retention
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We retain your personal information for as long as necessary to
                  provide our services and fulfill the purposes outlined in this
                  Privacy Policy. When you delete your account, we will delete or
                  anonymize your personal information within 30 days, except where
                  we are required to retain it for legal or regulatory purposes.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Some information may remain in backup copies for a limited time
                  before being permanently deleted.
                </p>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Children's Privacy
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  UniMate is intended for university students aged 18 and older.
                  We do not knowingly collect personal information from anyone
                  under the age of 18. If you are a parent or guardian and believe
                  your child has provided us with personal information, please
                  contact us immediately so we can delete such information.
                </p>
              </div>
            </div>

            {/* International Users */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  International Users
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  UniMate primarily serves students in Lebanon and other countries.
                  If you are accessing our platform from outside Lebanon, please be
                  aware that your information may be transferred to, stored, and
                  processed in Lebanon or other countries where our servers are
                  located. By using UniMate, you consent to this transfer.
                </p>
              </div>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Changes to This Privacy Policy
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last Updated" date at the top of this
                  policy.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We encourage you to review this Privacy Policy periodically for
                  any changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 dark:bg-blue-700 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Contact Us About Privacy
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about this Privacy Policy, how we
                  handle your data, or wish to exercise your privacy rights, please
                  contact us:
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@unimate.edu"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      privacy@unimate.edu
                    </a>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Contact Form:</strong>{" "}
                    <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      Visit our contact page
                    </Link>
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  We aim to respond to all privacy-related inquiries within 14
                  business days.
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Academic Project Disclaimer
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    UniMate is a university capstone project and is not intended
                    for collecting sensitive personal information or PII (Personally
                    Identifiable Information) at scale. This platform is designed
                    for educational purposes and demonstration. Users should be
                    mindful when sharing personal information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
