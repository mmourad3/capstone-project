/**
 * Lifestyle Questionnaire Component
 * Last updated: 2025-03-08
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';
import { navigateToDashboard } from '../utils/navigationHelpers';
// Import storage utilities for questionnaire management
import { getUserQuestionnaire, hasCompletedQuestionnaire, saveUserQuestionnaire } from '../utils/storageUtils';
import { ArrowLeft, CheckCircle, Mail, Moon, Sun, Home, Users, Coffee, BookOpen, Heart, Thermometer, Info, VolumeX, Volume1, Volume2, Gamepad2, Utensils, Plane, Music, Dumbbell, Palette, Camera, Film, Code, Flame, Snowflake } from 'lucide-react';

export default function LifestyleQuestionnaire() {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || "dorm_seeker";
  
  // Redirect carpool users - questionnaire is ONLY for dorm seekers and providers
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'carpool') {
      console.log('[LifestyleQuestionnaire] Carpool users do not need questionnaire, redirecting to dashboard');
      navigateToDashboard(userRole, navigate);
    }
  }, [navigate]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Check if user is coming from profile to edit
  const isEditingFromProfile = localStorage.getItem('returnToProfile') === 'true';
  
  // Check if questionnaire is already completed on mount
  // Only show verification message if NOT editing from profile
  
  // Load existing questionnaire data if available (user-scoped)
  const loadExistingData = () => {
    // Try to load user-scoped questionnaire data
    const existing = getUserQuestionnaire();
    if (existing) {
      return existing;
    }
    
    // Return empty form if no existing data
    return {
      sleepSchedule: "",
      wakeUpTime: "",
      sleepTime: "",
      cleanliness: "",
      organizationLevel: "",
      socialLevel: "",
      guestFrequency: "",
      sharedSpaces: "",
      smoking: "",
      drinking: "",
      pets: "",
      dietaryPreferences: "",
      studyTime: "",
      noiseLevel: "",
      musicWhileStudying: "",
      temperaturePreference: "",
      sharingItems: "",
      allergies: "",
      interests: [],
      personalQualities: [],
      importantQualities: [],
      dealBreakers: []
    };
  };
  
  const [formData, setFormData] = useState(loadExistingData());

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handler for multi-select fields (interests, important qualities, deal-breakers)
  const toggleArrayItem = (field, value) => {
    const currentArray = formData[field];
    if (currentArray.includes(value)) {
      // Remove if already selected
      setFormData({ ...formData, [field]: currentArray.filter(item => item !== value) });
    } else {
      // Add if not selected
      setFormData({ ...formData, [field]: [...currentArray, value] });
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Questionnaire Data:", formData);
    
    // Save questionnaire data to user-scoped localStorage
    saveUserQuestionnaire(formData);
    
    // Clear the signup form data from localStorage
    localStorage.removeItem('signupFormData');
    
    // TODO: Backend Integration
    // Submit the questionnaire data to the API
    // POST /api/lifestyle-questionnaire
    // Body: { userId, questionnaireData: formData }
    //
    // Backend should:
    // 1. Save questionnaire data to MySQL database
    // 2. Update user record: questionnaire_completed = true
    // 3. Generate verification token
    // 4. Send verification email using nodemailer
    // 5. Return success response
    
    // Mock API call - replace with actual fetch
    // questionnaireAPI.submit(formData, role)
    //   .then(response => {
    //     console.log("Questionnaire submitted successfully:", response);
    //     setShowVerificationMessage(true); // Show email verification after questionnaire
    //   })
    //   .catch(error => {
    //     console.error("Error submitting questionnaire:", error);
    //   });

    // Check if user came from profile page
    const returnToProfile = localStorage.getItem('returnToProfile');
    
    if (returnToProfile === 'true') {
      // Clear the flag
      localStorage.removeItem('returnToProfile');
      // Show success toast
      toast.success('Lifestyle preferences updated successfully!');
      // Redirect back to profile
      navigate('/profile');
    } else {
      // Show success toast for new questionnaire completion
      toast.success('Questionnaire completed successfully!');
      navigateToDashboard(role, navigate);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.sleepSchedule && formData.wakeUpTime && formData.sleepTime;
      case 2:
        return formData.cleanliness && formData.organizationLevel;
      case 3:
        return formData.socialLevel && formData.guestFrequency && formData.sharedSpaces;
      case 4:
        return formData.smoking && formData.drinking && formData.pets;
      case 5:
        return formData.studyTime && formData.noiseLevel && formData.temperaturePreference && formData.sharingItems;
      case 6:
        return formData.interests.length > 0 && formData.personalQualities.length > 0 && formData.importantQualities.length > 0 && formData.dealBreakers.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
                  {/* Questionnaire Form */}
          <div>
        {/* Back to Home Button */}
        <div className="mb-4">
          {isEditingFromProfile ? (
            <button
              onClick={() => {
                localStorage.removeItem('returnToProfile');
                navigate('/profile');
              }}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </button>
          ) : (
            <button 
              onClick={() => navigate('/signup')} 
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign Up
            </button>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Lifestyle Questionnaire
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Help us find your perfect roommate match!
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">
            Answer honestly to get the best compatibility results
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
            <div
              className="bg-blue-500 dark:bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Questionnaire Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8">
          
          {/* Step 1: Sleep & Schedule */}
          {currentStep === 1 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg">
                  <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Sleep & Schedule</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Are you an early bird or a night owl? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Early Bird", "Balanced", "Night Owl"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("sleepSchedule", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.sleepSchedule === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {option === "Early Bird" && <Sun className="w-4 h-4 sm:w-5 sm:h-5 dark:text-gray-300" />}
                        {option === "Night Owl" && <Moon className="w-4 h-4 sm:w-5 sm:h-5 dark:text-gray-300" />}
                        <span className="font-medium text-sm sm:text-base dark:text-gray-200">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Typical wake-up time *
                  </label>
                  <select
                    value={formData.wakeUpTime}
                    onChange={(e) => handleChange("wakeUpTime", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base cursor-pointer"
                  >
                    <option value="">Select time</option>
                    <option value="Before 6 AM">Before 6 AM</option>
                    <option value="6-7 AM">6-7 AM</option>
                    <option value="7-8 AM">7-8 AM</option>
                    <option value="8-9 AM">8-9 AM</option>
                    <option value="9-10 AM">9-10 AM</option>
                    <option value="After 10 AM">After 10 AM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Typical sleep time *
                  </label>
                  <select
                    value={formData.sleepTime}
                    onChange={(e) => handleChange("sleepTime", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base cursor-pointer"
                  >
                    <option value="">Select time</option>
                    <option value="Before 10 PM">Before 10 PM</option>
                    <option value="10-11 PM">10-11 PM</option>
                    <option value="11 PM-12 AM">11 PM-12 AM</option>
                    <option value="12-1 AM">12-1 AM</option>
                    <option value="1-2 AM">1-2 AM</option>
                    <option value="After 2 AM">After 2 AM</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Cleanliness & Organization */}
          {currentStep === 2 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Cleanliness & Organization</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How would you describe your cleanliness level? *
                </label>
                <div className="space-y-3">
                  {[
                    { value: "Very Neat", desc: "Everything is always clean and organized" },
                    { value: "Moderately Clean", desc: "I clean regularly but not obsessively" },
                    { value: "Casual", desc: "I clean when needed" },
                    { value: "Relaxed", desc: "I don't mind a bit of mess" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange("cleanliness", option.value)}
                      className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                        formData.cleanliness === option.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{option.value}</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Organization level *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Very Organized", "Moderately Organized", "Go with the Flow"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("organizationLevel", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.organizationLevel === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Social Preferences */}
          {currentStep === 3 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Social Preferences</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How social are you at home? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Very Social", "Moderately Social", "Prefer Privacy"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("socialLevel", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.socialLevel === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How often do you have guests over? *
                </label>
                <div className="space-y-3">
                  {["Frequently (3+ times/week)", "Occasionally (1-2 times/week)", "Rarely (Few times/month)", "Never"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("guestFrequency", option)}
                      className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                        formData.guestFrequency === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-sm sm:text-base dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Comfortable sharing common spaces? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Very Comfortable", "Somewhat Comfortable", "Prefer Minimal Sharing"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("sharedSpaces", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.sharedSpaces === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Lifestyle Habits */}
          {currentStep === 4 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg">
                  <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Lifestyle Habits</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Smoking *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Yes", "No"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("smoking", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.smoking === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Drinking *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["No", "Socially", "Regularly"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("drinking", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.drinking === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Pets *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Have Pets", "No Pets - Open to Them", "No Pets - Prefer None"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("pets", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.pets === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dietary preferences (optional)
                </label>
                <input
                  type="text"
                  value={formData.dietaryPreferences}
                  onChange={(e) => handleChange("dietaryPreferences", e.target.value)}
                  placeholder="e.g., Vegetarian, Vegan, No restrictions"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                />
              </div>
            </div>
          )}

          {/* Step 5: Study Habits & Preferences */}
          {currentStep === 5 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Study & Personal Preferences</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preferred study time *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Morning", "Afternoon", "Evening", "Late Night"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("studyTime", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.studyTime === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Noise tolerance while studying/sleeping *
                </label>
                <div className="space-y-3">
                  {[
                    { value: "Very Quiet", icon: VolumeX },
                    { value: "Moderate", icon: Volume1 },
                    { value: "Loud", icon: Volume2 }
                  ].map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange("noiseLevel", option.value)}
                        className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                          formData.noiseLevel === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                            : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 dark:text-gray-300" />
                          <span className="font-medium text-sm sm:text-base dark:text-gray-200">{option.value}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Listen to music while studying?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Yes", "Sometimes", "No"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("musicWhileStudying", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.musicWhileStudying === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Temperature preference *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "Warm", icon: Flame },
                    { value: "Moderate", icon: Thermometer },
                    { value: "Cool", icon: Snowflake }
                  ].map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange("temperaturePreference", option.value)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          formData.temperaturePreference === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                            : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                          <IconComponent className="w-5 h-5 sm:w-5 sm:h-5 dark:text-gray-300" />
                          <span className="font-medium text-xs sm:text-base dark:text-gray-200">{option.value}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Comfortable sharing personal items? *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Yes", "Sometimes", "Prefer Not To"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("sharingItems", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.sharingItems === option
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Any allergies or health considerations? (optional)
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  placeholder="e.g., Dust allergies, asthma, etc."
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm sm:text-base"
                />
              </div>
            </div>
          )}

          {/* Step 6: Interests & Qualities */}
          {currentStep === 6 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Interests & Qualities</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What are your interests? (Select at least 1) *
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">Click to select multiple interests</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Reading", icon: BookOpen },
                    { name: "Gaming", icon: Gamepad2 },
                    { name: "Cooking", icon: Utensils },
                    { name: "Traveling", icon: Plane },
                    { name: "Music", icon: Music },
                    { name: "Sports", icon: Dumbbell },
                    { name: "Art", icon: Palette },
                    { name: "Photography", icon: Camera },
                    { name: "Movies", icon: Film },
                    { name: "Fitness", icon: Dumbbell },
                    { name: "Coding", icon: Code },
                    { name: "Coffee", icon: Coffee }
                  ].map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => toggleArrayItem("interests", option.name)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          formData.interests.includes(option.name)
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                            : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 dark:text-gray-300" />
                          <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formData.interests.length > 0 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What are YOUR best qualities? (Select at least 1) *
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">Tell potential roommates about yourself</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Friendly",
                    "Supportive",
                    "Honest",
                    "Reliable",
                    "Adaptable",
                    "Respectful",
                    "Easygoing",
                    "Communicative"
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleArrayItem("personalQualities", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.personalQualities.includes(option)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
                {formData.personalQualities.length > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    {formData.personalQualities.length} qualit{formData.personalQualities.length !== 1 ? 'ies' : 'y'} selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What are the most important qualities in a roommate? (Select at least 1) *
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">Click to select multiple qualities</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Friendly",
                    "Supportive",
                    "Honest",
                    "Reliable",
                    "Adaptable",
                    "Respectful",
                    "Easygoing",
                    "Communicative",
                    "Clean",
                    "Organized",
                    "Social",
                    "Quiet"
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleArrayItem("importantQualities", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.importantQualities.includes(option)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
                {formData.importantQualities.length > 0 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    {formData.importantQualities.length} qualit{formData.importantQualities.length !== 1 ? 'ies' : 'y'} selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What are your deal-breakers? (Select at least 1) *
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">Things you absolutely cannot tolerate</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Smoking",
                    "Drinking",
                    "Loud Noise",
                    "Pets",
                    "Messiness",
                    "Late Night Activity",
                    "Too Social",
                    "Frequent Guests",
                    "Different Temps",
                    "Not Sharing"
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleArrayItem("dealBreakers", option)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.dealBreakers.includes(option)
                          ? "border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 dark:bg-gray-700/50"
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm dark:text-gray-200">{option}</span>
                    </button>
                  ))}
                </div>
                {formData.dealBreakers.length > 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    {formData.dealBreakers.length} deal-breaker{formData.dealBreakers.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base cursor-pointer"
              >
                Back
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base cursor-pointer ${
                  isStepComplete()
                    ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepComplete()}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer ${
                  isStepComplete()
                    ? "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 shadow-lg shadow-green-500/30"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Complete & Continue
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 sm:mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-400 flex items-start gap-2">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
            <span><strong>Why this matters:</strong> Your answers help us match you with roommates who have similar lifestyles and habits, so you're more likely to get along well.</span>
          </p>
        </div>
      </div>
        
      </div>
    </div>
  );
}