import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/translations/en.json";
import fr from "@/translations/fr.json";
import ar from "@/translations/ar.json";

export type Language = "en" | "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Record<Language, any> = {
  en,
  fr,
  ar,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or browser language
    const saved = localStorage.getItem("preferred_language") as Language | null;
    if (saved && ["en", "fr", "ar"].includes(saved)) {
      return saved;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split("-")[0];
    if (["en", "fr", "ar"].includes(browserLang)) {
      return browserLang as Language;
    }
    
    return "en";
  });

  const isRTL = language === "ar";

  // Apply RTL to document
  useEffect(() => {
    if (isRTL) {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = language;
    }
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_language", lang);
  };

  const getNestedValue = (obj: any, path: string): string => {
    const keys = path.split(".");
    let value = obj;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return path; // Return the key if translation not found
      }
    }
    return typeof value === "string" ? value : path;
  };

  const t = (key: string): string => {
    return getNestedValue(translations[language], key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
