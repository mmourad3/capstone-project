import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  MessageCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const carpoolRules = [
  {
    icon: UserCheck,
    title: 'Students Only',
    text: 'Only registered students can create or join carpools.',
  },
  {
    icon: Clock,
    title: 'Respect Schedule',
    text: 'Be on time and notify others quickly if you are running late.',
  },
  {
    icon: MapPin,
    title: 'Pickup & Drop Clarity',
    text: 'Define the pickup location, destination, departure time, and return time clearly.',
  },
  {
    icon: DollarSign,
    title: 'Fair Cost Sharing',
    text: 'Fuel costs should be shared fairly. Carpools are not for profit-making.',
  },
  {
    icon: MessageCircle,
    title: 'Communication',
    text: 'Use WhatsApp to confirm ride details and coordinate with the group.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety First',
    text: 'Share only necessary info, meet in safe public places, drive safely, and avoid harassment or illegal behavior.',
  },
];

/**
 * Carpool Tips Component
 * Displays rules for riders or a checklist for drivers.
 */
export function CarpoolTips({ type = 'rider' }) {
  if (type === 'rider') {
    return (
      <div className="mt-6 sm:mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 text-sm sm:text-base">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          Carpool Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {carpoolRules.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-3"
            >
              <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                  {title}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'driver') {
    return (
      <div className="mt-6 sm:mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          Driver Checklist
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc pl-5">
          <li>Only registered students can join your carpool.</li>
          <li>Confirm passengers, pickup location, destination, time, and cost on WhatsApp.</li>
          <li>Be punctual and notify passengers if you are running late.</li>
          <li>Share fuel costs fairly and do not use carpools for profit.</li>
          <li>Drive safely, follow traffic rules, and keep the ride respectful.</li>
          <li>Delete your listing when it is no longer needed.</li>
        </ul>
      </div>
    );
  }

  return null;
}
