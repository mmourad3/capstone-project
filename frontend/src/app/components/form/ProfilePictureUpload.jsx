import { Upload, XCircle } from "lucide-react";

/**
 * Reusable ProfilePictureUpload component
 * Used in SignUp and Profile pages
 * 
 * @param {string} preview - Base64 preview URL
 * @param {function} onChange - Callback when file is selected (receives event)
 * @param {function} onRemove - Callback to remove picture
 * @param {boolean} required - Whether the field is required
 * @param {string} label - Custom label text
 */
export function ProfilePictureUpload({ 
  preview, 
  onChange, 
  onRemove, 
  required = false,
  label = "Profile Picture"
}) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {!required && <span className="text-gray-500 dark:text-gray-500 text-xs">(optional)</span>}
        {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      
      {!preview ? (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="profilePicture"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
            </div>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <img
            src={preview}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Profile picture uploaded</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Ready to use</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}