import { Sparkles, Edit2, Sun, Moon, Users, Coffee, BookOpen, Heart } from "lucide-react";
import { useQuestionnaire } from "../hooks/useQuestionnaire";

export function LifestylePreferencesSection({ navigate }) {
  const { questionnaire, hasQuestionnaire, isLoadingQuestionnaire } =
    useQuestionnaire();

  if (isLoadingQuestionnaire) {
    return null;
  }

  const handleEditQuestionnaire = () => {
    // Store a flag to return to profile after saving
    localStorage.setItem('returnToProfile', 'true');
    navigate('/lifestyle-questionnaire');
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 p-6 sm:p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lifestyle Preferences</h2>
        </div>
        <button
          onClick={handleEditQuestionnaire}
          className="flex items-center gap-2 bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors font-medium cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
          {hasQuestionnaire ? 'Edit' : 'Complete'}
        </button>
      </div>

      {!hasQuestionnaire ? (
        <div className="text-center py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Complete Your Lifestyle Questionnaire
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Help us match you with compatible roommates by sharing your lifestyle preferences, habits, and deal-breakers.
            </p>
            <button
              onClick={handleEditQuestionnaire}
              className="bg-purple-600 dark:bg-purple-700 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors font-medium cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Sleep & Daily Routine */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              {questionnaire.sleepSchedule === 'early-bird' ? (
                <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              )}
              Sleep & Daily Routine
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Sleep Schedule:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                  {questionnaire.sleepSchedule.replace('-', ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Wake Time:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{questionnaire.wakeUpTime}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Sleep Time:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{questionnaire.sleepTime}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Study Time:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.studyTime}</span>
              </div>
            </div>
          </div>

          {/* Cleanliness & Organization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Cleanliness & Organization
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Cleanliness Level:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{questionnaire.cleanliness}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Organization:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{questionnaire.organizationLevel}</span>
              </div>
            </div>
          </div>

          {/* Social & Noise Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Social & Environment
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Social Level:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.socialLevel}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Guest Frequency:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.guestFrequency}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Noise Level:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.noiseLevel}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Temperature:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.temperaturePreference}</span>
              </div>
            </div>
          </div>

          {/* Habits */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Habits & Lifestyle
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Smoking:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.smoking}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Drinking:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.drinking}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Pets:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.pets}</span>
              </div>
            </div>
            {(questionnaire.dietaryPreferences && questionnaire.dietaryPreferences !== 'Not set') || 
             (questionnaire.allergies && questionnaire.allergies !== 'Not set') ? (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                {questionnaire.dietaryPreferences && questionnaire.dietaryPreferences !== 'Not set' && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Dietary Preferences:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{questionnaire.dietaryPreferences}</span>
                  </div>
                )}
                {questionnaire.allergies && questionnaire.allergies !== 'Not set' && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Allergies/Health:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{questionnaire.allergies}</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Study Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Study & Space Preferences
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Study Time:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{questionnaire.studyTime}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Music While Studying:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                  {questionnaire.musicWhileStudying !== 'Not set' ? questionnaire.musicWhileStudying : 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Shared Spaces:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{questionnaire.sharedSpaces}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Sharing Items:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{questionnaire.sharingItems}</span>
              </div>
            </div>
          </div>

          {/* Interests */}
          {questionnaire.interests.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Interests & Hobbies
              </h3>
              <div className="flex flex-wrap gap-2">
                {questionnaire.interests.map((interest, idx) => (
                  <span key={idx} className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personal Qualities */}
          {questionnaire.personalQualities.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Best Qualities</h3>
              <div className="flex flex-wrap gap-2">
                {questionnaire.personalQualities.map((quality, idx) => (
                  <span key={idx} className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                    {quality}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Important Qualities */}
          {questionnaire.importantQualities.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What You Value in a Roommate</h3>
              <div className="flex flex-wrap gap-2">
                {questionnaire.importantQualities.map((quality, idx) => (
                  <span key={idx} className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                    {quality}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Deal Breakers */}
          {questionnaire.dealBreakers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-red-500 dark:border-red-400">
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-3">Your Deal Breakers</h3>
              <div className="flex flex-wrap gap-2">
                {questionnaire.dealBreakers.map((breaker, idx) => (
                  <span key={idx} className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm">
                    {breaker}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}