import { AlertTriangle, Trash2 } from "lucide-react";

export function DeleteAccountSection({ 
  showDeleteConfirm, 
  setShowDeleteConfirm, 
  deleteConfirmText, 
  setDeleteConfirmText, 
  handleDeleteAccount 
}) {
  return (
    <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl shadow-lg border-2 border-red-200 dark:border-red-800 p-4 sm:p-6 md:p-8 mt-6">
      <div className="flex flex-col sm:flex-row items-start gap-3 mb-4">
        <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full flex-shrink-0">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-red-900 dark:text-red-300 mb-2">Danger Zone</h2>
          <p className="text-red-700 dark:text-red-400 text-xs sm:text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
      </div>

      {!showDeleteConfirm && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 bg-red-600 dark:bg-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors font-medium cursor-pointer text-sm sm:text-base w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Delete My Account
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-red-300 dark:border-red-700">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Are you absolutely sure?</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone. This will permanently delete your account, all your listings, carpool data, and remove your data from our servers.
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2">
              Please type <span className="text-red-600 dark:text-red-400 font-bold">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-red-300 dark:border-red-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE'}
              className="flex-1 bg-red-600 dark:bg-red-700 text-white py-2.5 sm:py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm md:text-base"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="break-words">I understand, delete my account</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText('');
              }}
              className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium cursor-pointer text-xs sm:text-sm md:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}