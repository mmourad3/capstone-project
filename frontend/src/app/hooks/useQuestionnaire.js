import { useEffect, useState } from "react";
import { questionnaireAPI } from "../services/api";

export function useQuestionnaire() {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [hasQuestionnaire, setHasQuestionnaire] = useState(false);
  const [isLoadingQuestionnaire, setIsLoadingQuestionnaire] = useState(true);

  useEffect(() => {
    const loadQuestionnaire = async () => {
      try {
        const data = await questionnaireAPI.getMe();
        setQuestionnaire(data);
        setHasQuestionnaire(true);
      } catch {
        setQuestionnaire(null);
        setHasQuestionnaire(false);
      } finally {
        setIsLoadingQuestionnaire(false);
      }
    };

    loadQuestionnaire();
  }, []);

  return {
    questionnaire,
    setQuestionnaire,
    hasQuestionnaire,
    isLoadingQuestionnaire,
  };
}
