import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { validatePassword, getPasswordStrength } from "../../utils/passwordValidation";

export function ChangePasswordSection({ 
  showChangePassword, 
  setShowChangePassword, 
  passwordData, 
  setPasswordData, 
  handleChangePassword 
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = validatePassword(passwordData.newPassword);
  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Password & Security</h2>
        {!showChangePassword && (
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium cursor-pointer self-start sm:self-auto text-sm sm:text-base"
          >
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            Change Password
          </button>
        )}
      </div>

      {showChangePassword && (
        <form onSubmit={handleChangePassword} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 sm:right-3 top-2 sm:top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 sm:right-3 top-2 sm:top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${passwordRequirements.minLength ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${passwordRequirements.hasUpperCase ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <span>At least one uppercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${passwordRequirements.hasLowerCase ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <span>At least one lowercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <span>At least one number</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${passwordRequirements.hasSpecialChar ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <span>At least one special character</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="relative h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className={`absolute left-0 top-0 h-1.5 sm:h-2 ${passwordStrength.color} rounded-full`}
                  style={{ width: `${passwordStrength.percentage}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{passwordStrength.label}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 sm:right-3 top-2 sm:top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 dark:bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium cursor-pointer text-sm sm:text-base"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={() => {
                setShowChangePassword(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
              }}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 sm:py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium cursor-pointer text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showChangePassword && (
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
          Keep your account secure by using a strong password and updating it regularly.
        </p>
      )}
    </div>
  );
}