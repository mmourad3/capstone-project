import { Link } from "react-router";
import { useEffect } from "react";
import { Home as HomeIcon, Car, ArrowRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { initializeDemoUsers } from "../utils/initializeDemoUsers";

export default function Home() {
  // Initialize demo users on home page load
  useEffect(() => {
    initializeDemoUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                Your Student Life,{" "}
                <span className="text-blue-600 dark:text-blue-400">Simplified.</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
                Find roommates, discover dorms, and share rides — all in one
                place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-600/30 text-center cursor-pointer"
                >
                  Get Started
                </Link>
                <Link
                  to="/how-it-works"
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-lg font-medium border border-gray-300 dark:border-gray-600 text-center cursor-pointer"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1758270705902-f50dde4add9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHVuaXZlcnNpdHklMjBzdHVkZW50cyUyMGNhbXB1c3xlbnwxfHx8fDE3NzIxODYzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy university students on campus"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Our Services
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 md:mb-12 text-base sm:text-lg px-4">
            Everything you need for a great university experience
          </p>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Dorm & Roommate Matching Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <HomeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                Dorm & Roommate Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm sm:text-base">
                Find the perfect dorm and compatible roommates. Browse listings,
                filter by preferences, and connect with fellow students looking
                for housing.
              </p>
              <img
                src="https://images.unsplash.com/photo-1614715661635-abb0547c125c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkb3JtJTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjIzNjcxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern dorm room"
                className="rounded-lg mb-4 md:mb-6 w-full h-40 sm:h-48 object-cover"
              />
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base cursor-pointer"
              >
                Explore Dorms
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>

            {/* Carpool & Ride Sharing Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <Car className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                Carpool & Ride Sharing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm sm:text-base">
                Save money and reduce emissions by sharing rides with other
                students. Find rides to campus, home, or anywhere you need to
                go.
              </p>
              <img
                src="https://images.unsplash.com/photo-1719778532480-544012d378a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwZHJpdmluZyUyMGNhciUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjIzNjcxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Friends in a car"
                className="rounded-lg mb-4 md:mb-6 w-full h-40 sm:h-48 object-cover"
              />
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base cursor-pointer"
              >
                Find a Ride
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-10 md:mb-16 text-base sm:text-lg px-4">
            Get started in three simple steps
          </p>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-500 dark:bg-blue-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-xl sm:text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                Create an Account
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base px-4">
                Sign up with your university email and set up your profile in
                minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-500 dark:bg-blue-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-xl sm:text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                Choose Your Service
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base px-4">
                Select whether you're looking for a dorm, offering one, or interested in carpooling.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-500 dark:bg-blue-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-xl sm:text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                Connect via WhatsApp
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base px-4">
                Browse listings and connect directly with other students through
                WhatsApp.
              </p>
            </div>
          </div>

          <div className="text-center mt-10 md:mt-12">
            <Link
              to="/signup"
              className="inline-block bg-blue-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-base sm:text-lg font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-600/30 cursor-pointer"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}