import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { validatePassword, getPasswordStrength } from "../../utils/passwordValidation";

/**
 * Reusable PasswordStrengthField component
 * Used in SignUp and ChangePassword components
 * Displays password input with strength meter and requirements checklist
 * 
 * @param {string} value - Password value
 * @param {function} onChange - Callback when password changes (receives event)
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether the field is required
 * @param {boolean} showStrengthMeter - Whether to show strength meter
 * @param {string} label - Custom label text
 * @param {string} id - Input ID
 */
export function PasswordStrengthField({ 
  value = "",
  onChange,
  placeholder = "••••••••",
  required = false,
  showStrengthMeter = true,
  label = "Password",
  id = "password"
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Password validation
  const passwordRequirements = validatePassword(value);
  const passwordStrengthData = getPasswordStrength(value);
  
  const passwordValidation = {
    requirements: passwordRequirements,
    strength: passwordStrengthData.label,
    strengthColor: passwordStrengthData.color,
    strengthPercentage: passwordStrengthData.percentage
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
      
      {/* Password Requirements */}
      {value && (
        <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${passwordValidation.requirements.minLength ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span>At least 8 characters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasUpperCase ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span>At least one uppercase letter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasLowerCase ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span>At least one lowercase letter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasNumber ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span>At least one number</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasSpecialChar ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span>At least one special character</span>
          </div>
        </div>
      )}
      
      {/* Password Strength Bar */}
      {value && showStrengthMeter && passwordValidation.strength && (
        <div className="mt-2">
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className={`absolute left-0 top-0 h-2 ${passwordValidation.strengthColor} rounded-full transition-all duration-300`}
              style={{ width: `${passwordValidation.strengthPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{passwordValidation.strength}</p>
        </div>
      )}
    </div>
  );
}