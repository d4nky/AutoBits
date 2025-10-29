import { useLanguage } from "@/contexts/LanguageContext";

export function useTranslation() {
  const { t, language, setLanguage, isRTL } = useLanguage();
  return { t, language, setLanguage, isRTL };
}
