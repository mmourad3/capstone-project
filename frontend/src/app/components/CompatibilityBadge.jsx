import { Sparkles } from 'lucide-react';
import { getCompatibilityColor } from '../utils/comprehensiveCompatibilityCalculator';

// Helper: Get color classes for compatibility badge
const getCompatibilityColorClasses = (score) => {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800"
  };
  return colorMap[getCompatibilityColor(score)];
};

// Compatibility Badge Component
export function CompatibilityBadge({ score, size = "sm" }) {
  if (score === undefined) return null;
  const sizeClasses = size === "lg" ? "px-[20px] py-[10px] text-lg" : "px-3 py-2 text-base";
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg ${getCompatibilityColorClasses(score)} ${sizeClasses}`}>
      <Sparkles className={size === "lg" ? "w-4 h-4" : "w-4 h-4"} />
      <span className="font-semibold">{score}% Match</span>
    </div>
  );
}
