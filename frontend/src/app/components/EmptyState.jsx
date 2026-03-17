export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionButton 
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 sm:p-12 text-center">
      {Icon && <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />}
      <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm sm:text-base">{title}</p>
      {description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{description}</p>
      )}
      {actionButton}
    </div>
  );
}