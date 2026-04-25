import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from 'react-toastify';
import { PasswordStrengthField } from '../components/form/PasswordStrengthField';
import { PhoneCountryInput } from '../components/form/PhoneCountryInput';
import { ClassScheduleBuilder } from '../components/form/ClassScheduleBuilder';
import { ProfilePictureUpload } from '../components/form/ProfilePictureUpload';
import { EMAIL_UNIVERSITY_MAP, isValidUniversityEmail, getGroupedUniversities } from '../config/universityConfig';
import { AVAILABLE_COUNTRIES as countries, getGroupedRegions } from '../config/appConfig';
import { normalizeGender } from '../utils/genderHelpers';
import { validatePassword, getPasswordErrorMessage } from '../utils/passwordValidation';
import { createExistenceChecker } from '../utils/validationHelpers';
import { createScheduleHelpers } from '../utils/scheduleHelpers';
import { handleProfilePictureUpload } from '../utils/profileHelpers';
import { authAPI } from "../services/api";
import { navigateToDashboard } from "../utils/navigationHelpers";
import { saveAuthUser } from "../utils/authStorage";

const groupedUniversities = getGroupedUniversities();

// Helper to check if phone is valid
const isPhoneValid = () => true; // Will be replaced by actual validation

export default function SignUp() {
  const navigate = useNavigate();
  
  // Refs for scrolling to errors
  const emailRef = useRef(null);
  const universityRef = useRef(null);
  const phoneRef = useRef(null);
  
  // Initialize state variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryISO, setCountryISO] = useState("");
  const [university, setUniversity] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [emailError, setEmailError] = useState("");
  const [universityError, setUniversityError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailExistsInDB, setEmailExistsInDB] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneExistsInDB, setPhoneExistsInDB] = useState(false);
  const [carpoolRegion, setCarpoolRegion] = useState("");
  const [classSchedule, setClassSchedule] = useState([]);

  // Schedule management helpers (imported from utils)
  const { addScheduleBlock, removeScheduleBlock, toggleDayInBlock, updateBlockTime, isDayUsedElsewhere } = createScheduleHelpers(classSchedule, setClassSchedule);

  // Function to save current form state
  const saveFormData = () => {
    return {
      firstName,
      lastName,
      email,
      phone,
      gender,
      role,
      country,
      countryCode,
      countryISO,
      university,
      profilePicturePreview,
      carpoolRegion,
      classSchedule
    };
  };

  // Validate university email format (using imported config)
  const validateUniversityEmail = (emailValue) => {
    if (!emailValue) return false;
    
    const isValid = isValidUniversityEmail(emailValue);
    
    if (!isValid) {
      setEmailError("Please use a valid university email address");
      return false;
    } else {
      // Only clear error if it's NOT about email existence
      if (!emailExistsInDB) {
        setEmailError("");
      }
      return true;
    }
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    // Reset email exists flag when email changes
    setEmailExistsInDB(false);
    
    validateUniversityEmail(emailValue);
  };

  // Check if current email is valid for visual indicator (using imported config)
  function isEmailValid() {
    if (!email) return false;
    return isValidUniversityEmail(email);
  }

  // Create existence checkers using the helper utility
  const checkEmailExists = createExistenceChecker({
    apiMethod: authAPI.checkEmailExists,
    setError: setEmailError,
    setExistsFlag: setEmailExistsInDB,
    setIsChecking: setIsCheckingEmail,
    isValid: isEmailValid,
    errorMessage: 'This email is already registered. Please login or use a different email.',
  });

  const checkPhoneExists = createExistenceChecker({
    apiMethod: authAPI.checkPhoneExists,
    setError: setPhoneError,
    setExistsFlag: setPhoneExistsInDB,
    setIsChecking: setIsCheckingPhone,
    isValid: isPhoneValid,
    errorMessage: 'This phone number is already registered. Please use a different phone number.',
  });

  // Check email exists when user leaves the email field
  const handleEmailBlur = () => {
    if (email && isEmailValid()) {
      checkEmailExists(email.toLowerCase().trim());
    }
  };

  // Effect to validate university match whenever email or university changes
  useEffect(() => {
    validateUniversityMatch();
  }, [email, university]);

  // Validate that university selection matches email domain (only for major universities)
  const validateUniversityMatch = () => {
    if (!email || !university) {
      setUniversityError("");
      return true;
    }

    const emailLower = email.toLowerCase().trim();
    
    // Check if email matches any major university domain (using imported config)
    for (const [domain, expectedUniversity] of Object.entries(EMAIL_UNIVERSITY_MAP)) {
      if (emailLower.endsWith(domain)) {
        // For universities with multiple campuses, accept any campus variant
        // e.g., "Lebanese American University (LAU) - Beirut" or "Lebanese American University (LAU) - Byblos"
        const isMatch = university === expectedUniversity || university.startsWith(expectedUniversity);
        
        if (!isMatch) {
          setUniversityError(`Your email belongs to ${expectedUniversity}. Please select the correct university.`);
          return false;
        }
      }
    }

    // For all other emails (generic .edu.lb, international, etc.) - no validation needed
    setUniversityError("");
    return true;
  };

  // Handle university change with validation
  const handleUniversityChange = (e) => {
    setUniversity(e.target.value);
  };

  // Handle country change
  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    setCountry(selectedCountryName);
    
    const selectedCountry = countries.find(c => c.name === selectedCountryName);
    if (selectedCountry) {
      setCountryCode(selectedCountry.code); // Phone code for display
      setCountryISO(selectedCountry.iso);   // ISO code for geocoding
      setPhone(''); // Clear phone when country changes
    }
  };

  // Validate phone number (only numbers, spaces, hyphens, parentheses)
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and common phone symbols
    const phoneRegex = /^[0-9\s\-\(\)]*$/;
    
    if (phoneRegex.test(value) || value === '') {
      setPhone(value);
      validatePhoneNumber(value);
    }
  };

  // Validate phone number length based on selected country
  const validatePhoneNumber = (phoneValue) => {
    if (!country || !phoneValue) {
      setPhoneError("");
      return true;
    }

    // Remove all non-digit characters to count actual digits
    const digitsOnly = phoneValue.replace(/\D/g, '');
    
    const selectedCountry = countries.find(c => c.name === country);
    if (!selectedCountry) {
      setPhoneError("");
      return true;
    }

    const { minDigits, maxDigits } = selectedCountry;

    if (digitsOnly.length < minDigits) {
      setPhoneError(`Phone number must be ${minDigits} digits for ${country}`);
      return false;
    }

    if (digitsOnly.length > maxDigits) {
      setPhoneError(`Phone number must be ${maxDigits} digits for ${country}`);
      return false;
    }

    // Valid phone number
    setPhoneError("");
    return true;
  };

  // Handle phone blur to check existence
  const handlePhoneBlur = () => {
    if (phone && isPhoneValid()) {
      checkPhoneExists(phone);
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    
    if (passwordValue) {
      const validation = validatePassword(passwordValue);
      const allRequirementsMet = Object.values(validation).every(Boolean);
      
      if (!allRequirementsMet) {
        const errorMessage = getPasswordErrorMessage(validation);
        setPasswordError(errorMessage);
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      handleProfilePictureUpload(file, (result) => {
        setProfilePicturePreview(result);
      });
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    
    // Run validations (email check already done in real-time!)
    const isEmailValidResult = validateUniversityEmail(email);
    const isUniversityValid = validateUniversityMatch();
    const isPhoneValidResult = validatePhoneNumber(phone);
    
    // Check if password meets all requirements
    const passwordValidationResult = validatePassword(password);
    const allPasswordRequirementsMet = Object.values(passwordValidationResult).every(Boolean);
    
    if (!allPasswordRequirementsMet) {
      const errorMessage = getPasswordErrorMessage(passwordValidationResult);
      toast.error(errorMessage);
      return;
    }
    
    // Find the first error and scroll to it (instant - no async!)
    if (!isEmailValidResult || emailExistsInDB) {
      emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    if (!isUniversityValid) {
      universityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    if (!isPhoneValidResult || phoneExistsInDB) {
      phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Validate class schedule for carpool users
    if (role === 'carpool') {
      if (classSchedule.length === 0) {
        toast.error('Please add at least one class schedule block');
        return;
      }

      // Validate each schedule block
      for (let i = 0; i < classSchedule.length; i++) {
        const block = classSchedule[i];
        if (block.days.length === 0) {
          toast.error(`Schedule #${i + 1}: Please select at least one day`);
          return;
        }
        if (!block.startTime || !block.endTime) {
          toast.error(`Schedule #${i + 1}: Please set both start and end times`);
          return;
        }
      }
    }
    
    // All validations passed - proceed with signup
    setIsLoading(true);
    
    try {
      const signupData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: `${countryCode}${phone}`,
        gender: normalizeGender(gender),
        role,
        country,
        countryCode: countryISO,
        university,
        region: role === "carpool" ? carpoolRegion : null,
        classSchedule: role === "carpool" ? classSchedule : [],
        profilePicture: null,
      };

      const response = await authAPI.register(signupData);

      saveAuthUser(response);

      if (response.user.role === "carpool") {
        navigateToDashboard(response.user.role, navigate);
      } else {
        navigate("/lifestyle-questionnaire", {
          state: { role: response.user.role },
        });
      }
    } catch (error) {
      setApiError(error.message || "Signup failed. Please try again.");
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 sm:py-12">
      {/* Back to Home Button */}
      <div className="absolute top-3 sm:top-8 left-4 sm:left-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base cursor-pointer mb-6 sm:mb-0"
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

        
          {/* Sign Up Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Join the UniMate community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* First Name and Last Name in a grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    First Name <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Last Name <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  University Email <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="relative" ref={emailRef}>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="yourname@university.edu"
                    required
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-lg border ${
                      emailError 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400' 
                        : isEmailValid() 
                        ? 'border-green-300 dark:border-green-700 focus:ring-green-500 dark:focus:ring-green-400' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent outline-none transition-all text-sm sm:text-base pr-10`}
                  />
                  {email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isEmailValid() ? (
                        <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {emailError}
                  </p>
                )}
                {isEmailValid() && !emailError && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Valid university email address
                  </p>
                )}
              </div>

              <PasswordStrengthField
                value={password}
                onChange={handlePasswordChange}
                required
                showStrengthMeter
              />

              <PhoneCountryInput
                ref={phoneRef}
                country={country}
                countryCode={countryCode}
                phone={phone}
                onCountryChange={handleCountryChange}
                onPhoneChange={handlePhoneChange}
                onPhoneBlur={handlePhoneBlur}
                error={phoneError}
                required
                isChecking={isCheckingPhone}
                existsInDB={phoneExistsInDB}
              />

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Gender <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base cursor-pointer"
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  I am a... <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base cursor-pointer"
                >
                  <option value="">Select your role</option>
                  <option value="dorm_seeker">Student looking for dorm</option>
                  <option value="dorm_provider">Student offering dorm</option>
                  <option value="carpool">Student looking for carpool</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="university"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  University <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div ref={universityRef}>
                  <select
                    id="university"
                    value={university}
                    onChange={handleUniversityChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base cursor-pointer"
                  >
                    <option value="">Select your university</option>
                    {Object.keys(groupedUniversities).map(groupName => (
                      <optgroup key={groupName} label={groupName}>
                        {groupedUniversities[groupName].map(uni => (
                          <option key={uni.name} value={uni.name}>
                            {uni.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {universityError && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {universityError}
                  </p>
                )}
              </div>

              {/* Carpool Region Selection - Only shown for carpool users */}
              {role === 'carpool' && (
                <div>
                  <label
                    htmlFor="carpoolRegion"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Region / City
                    <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                  </label>
                  <select
                    id="carpoolRegion"
                    value={carpoolRegion}
                    onChange={(e) => setCarpoolRegion(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base cursor-pointer"
                  >
                    <option value="">Select your region/city</option>
                    {Object.keys(getGroupedRegions()).map(regionGroup => (
                      <optgroup key={regionGroup} label={regionGroup}>
                        {getGroupedRegions()[regionGroup].map(location => (
                          <option key={location.name} value={location.name}>
                            {location.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    You'll only see carpools starting from your selected region to your university
                  </p>
                </div>
              )}

              {/* Class Schedule - Only shown for carpool users */}
              {role === 'carpool' && (
                <ClassScheduleBuilder
                  schedule={classSchedule}
                  scheduleHelpers={{
                    addScheduleBlock,
                    removeScheduleBlock,
                    toggleDayInBlock,
                    updateBlockTime,
                    isDayUsedElsewhere
                  }}
                  required
                />
              )}

              <ProfilePictureUpload
                preview={profilePicturePreview}
                onChange={handleProfilePictureChange}
                onRemove={removeProfilePicture}
              />

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 mt-1 cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => navigate('/terms', { state: { from: 'signup', formData: saveFormData() } })}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer text-xs sm:text-sm font-semibold"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => navigate('/privacy', { state: { from: 'signup', formData: saveFormData() } })}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer text-xs sm:text-sm font-semibold"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30 text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {apiError && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-2 text-center">
                {apiError}
              </p>
            )}

            <div className="mt-5 sm:mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium cursor-pointer">
                  Login
                </Link>
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}