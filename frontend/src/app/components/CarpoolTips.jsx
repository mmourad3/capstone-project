import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * Carpool Tips Component
 * Displays tips for riders or drivers
 */
export function CarpoolTips({ type = 'rider' }) {
  if (type === 'rider') {
    return (
      <div className="mt-6 sm:mt-8 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          Tips for Riders
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-blue-900 dark:text-blue-300">
          <li>• Contact drivers early to confirm your spot</li>
          <li>• Be punctual at the pickup location</li>
          <li>• Confirm ride details via WhatsApp before the trip</li>
          <li>• Respect the driver and other passengers</li>
          <li>• Pay the agreed price per seat</li>
        </ul>
      </div>
    );
  }

  if (type === 'driver') {
    return (
      <div className="mt-6 sm:mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm sm:text-base">
          Tips for Drivers
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <li>• Always confirm the number of passengers before departure</li>
          <li>• Share your contact info via WhatsApp for easy communication</li>
          <li>• Be punctual and communicate if you're running late</li>
          <li>• Set clear expectations about payment and meeting points</li>
          <li>• Drive safely and follow all traffic rules</li>
          <li>• Keep your vehicle clean and well-maintained</li>
          <li>• Remember to delete your listing when it's no longer needed</li>
        </ul>
      </div>
    );
  }

  return null;
}