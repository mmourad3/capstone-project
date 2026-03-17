import { User } from "lucide-react";

/**
 * Reusable ProfilePicture component
 * Displays user profile picture or default "no picture" avatar
 */
export function ProfilePicture({ 
  src, 
  alt = "User", 
  size = "md", // sm, md, lg, xl
  className = "" 
}) {
  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12 sm:w-14 sm:h-14",
    lg: "w-16 h-16 sm:w-20 sm:h-20",
    xl: "w-24 h-24 sm:w-32 sm:h-32"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6 sm:w-7 sm:h-7",
    lg: "w-8 h-8 sm:w-10 sm:h-10",
    xl: "w-12 h-12 sm:w-16 sm:h-16"
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const iconSize = iconSizes[size] || iconSizes.md;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover border-2 border-blue-500 dark:border-blue-400 flex-shrink-0 ${className}`}
      />
    );
  }

  // Default "no picture" placeholder
  return (
    <div className={`${sizeClass} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 ${className}`}>
      <User className={`${iconSize} text-gray-500 dark:text-gray-400`} />
    </div>
  );
}
