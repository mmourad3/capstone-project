import { Link } from "react-router";
import {
  Target,
  Heart,
  Users,
  Shield,
  Zap,
  Award,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              About <span className="text-blue-600 dark:text-blue-400">UniMate</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Connecting students to make university life easier, more
              affordable, and more enjoyable
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                  UniMate was created to solve the everyday challenges students
                  face when looking for housing and transportation. We believe
                  that finding a compatible roommate or a reliable carpool
                  shouldn't be difficult or stressful. Our platform brings
                  students together in a safe, verified community where they can
                  connect, share, and support each other throughout their
                  university journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-12 sm:py-16 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              What We Offer
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 md:mb-12 text-base sm:text-lg">
              Everything you need in one platform
            </p>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Dorm & Roommate Matching */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Dorm & Roommate Matching
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      Find your perfect living situation with our advanced
                      filtering system. Search for dorms by location, price, and
                      amenities, or post your own available space. Our AI-powered
                      compatibility matching helps you find roommates who share
                      your lifestyle and preferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Carpool & Ride Sharing */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Carpool & Ride Sharing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      Save money and reduce your carbon footprint by sharing rides
                      with fellow students. Whether you're commuting to campus
                      daily or heading home for the weekend, find or offer rides
                      that match your schedule and route.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Community */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Verified Student Community
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      Your safety is our priority. All users must verify their
                      university email address to join, ensuring you're only
                      connecting with fellow students from your institution. This
                      creates a trusted, secure environment for all interactions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Easy Communication */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Seamless Communication
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      Connect with other students directly through WhatsApp
                      integration. No need to exchange personal contact
                      information upfront or use complicated messaging systems.
                      Just click to start chatting and coordinate details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose UniMate Section */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12">
              Why Choose UniMate?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-blue-500 dark:bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Built for Students, by Students
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    UniMate was created as a university capstone project by
                    students who understand the challenges of finding housing and
                    transportation. We've designed every feature with student needs
                    in mind.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-blue-500 dark:bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Smart AI Matching
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    Our lifestyle questionnaire and AI-powered matching system helps
                    you find roommates who are truly compatible with your habits,
                    preferences, and lifestyle. No more awkward living situations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-blue-500 dark:bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Free to Use
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    UniMate is completely free for all students. We believe
                    everyone should have access to tools that make student life
                    easier without adding to the financial burden of university.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-blue-500 dark:bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Mobile-Friendly Design
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    Access UniMate from any device. Our responsive design ensures a
                    seamless experience whether you're on your phone, tablet, or
                    computer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 px-4 bg-blue-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  100%
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Student Verified
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  24/7
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Free
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Always
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  AI
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Powered
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-800 dark:to-blue-900 rounded-2xl p-8 md:p-12 text-white">
              <Award className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Simplify Your Student Life?
              </h2>
              <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-50 dark:text-blue-200">
                Join UniMate today and connect with students who can help make
                your university experience better.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-50 dark:bg-white dark:hover:bg-blue-50 dark:text-blue-600 transition-colors text-base sm:text-lg font-medium shadow-lg cursor-pointer"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/how-it-works"
                  className="bg-blue-700 dark:bg-blue-700/50 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors text-base sm:text-lg font-medium border border-blue-400 dark:border-blue-600 cursor-pointer"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}