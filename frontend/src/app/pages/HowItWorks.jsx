import { Link } from "react-router";
import {
  UserPlus,
  Search,
  MessageCircle,
  Home as HomeIcon,
  Car,
  Shield,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              How <span className="text-blue-600 dark:text-blue-400">UniMate</span> Works
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Connect with fellow students for housing and rides in just a few
              simple steps
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
              <div className="bg-blue-500 dark:bg-blue-600 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shrink-0">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Create Your Account
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-4 text-center md:text-left">
                  Sign up using your university email address to ensure a safe,
                  student-only community. Fill out your profile with basic
                  information and preferences.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                    <Shield className="w-4 h-4 inline mr-2" />
                    University email verification ensures only students can join
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
              <div className="bg-blue-500 dark:bg-blue-600 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shrink-0">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Choose Your Service
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-4 text-center md:text-left">
                  Select the service you need and specify your role:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <HomeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Dorm & Roommates
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Looking for a dorm</li>
                      <li>• Offering a dorm space</li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Car className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Carpool & Rides
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Looking for a ride</li>
                      <li>• Offering a ride</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
              <div className="bg-blue-500 dark:bg-blue-600 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shrink-0">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Connect via WhatsApp
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-4 text-center md:text-left">
                  Browse through available listings and filter by your
                  preferences. When you find a match, connect directly with
                  other students through WhatsApp to discuss details and
                  coordinate.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    What you can filter by:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div>• Location</div>
                    <div>• Price range</div>
                    <div>• Gender preference</div>
                    <div>• Pickup time</div>
                    <div>• Available seats</div>
                    <div>• Destination</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
              Join thousands of students already using UniMate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-blue-500 dark:bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-base sm:text-lg font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 cursor-pointer"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base sm:text-lg font-medium border border-gray-300 dark:border-gray-600 cursor-pointer"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}