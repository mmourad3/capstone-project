// Simple utility to check if someone has the qualities based on their questionnaire answers

export function getPersonQualities(questionnaire) {
  // Start with the personalQualities they selected themselves
  const selfReportedQualities = questionnaire.personalQualities || [];
  
  // Add derived qualities based on their other answers
  const derivedQualities = [];
  
  // Clean: if cleanliness is "Very Neat" or "Moderately Clean"
  if (questionnaire.cleanliness === "Very Neat" || questionnaire.cleanliness === "Moderately Clean") {
    derivedQualities.push("Clean");
  }
  
  // Organized: if organization level is "Very Organized" or "Moderately Organized"
  if (questionnaire.organizationLevel === "Very Organized" || questionnaire.organizationLevel === "Moderately Organized") {
    derivedQualities.push("Organized");
  }
  
  // Social: if social level is "Very Social" or "Moderately Social"
  if (questionnaire.socialLevel === "Very Social" || questionnaire.socialLevel === "Moderately Social") {
    derivedQualities.push("Social");
  }
  
  // Quiet: if noise level is "Very Quiet" or "Moderate"
  if (questionnaire.noiseLevel === "Very Quiet" || questionnaire.noiseLevel === "Moderate") {
    derivedQualities.push("Quiet");
  }
  
  // Combine self-reported and derived qualities (remove duplicates)
  return [...new Set([...selfReportedQualities, ...derivedQualities])];
}