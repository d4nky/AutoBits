import { useTranslation } from "@/hooks/use-translation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en" as const, label: "English", flag: "🇬🇧" },
    { code: "fr" as const, label: "Français", flag: "🇫🇷" },
    { code: "ar" as const, label: "العربية", flag: "🇸🇦" },
  ];

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-secondary transition-colors text-sm font-medium"
      >
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.label}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-border rounded-lg shadow-lg z-50 animate-slide-up">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-secondary transition-colors ${
                language === lang.code
                  ? "bg-primary/10 text-primary font-semibold"
                  : ""
              } ${lang.code === "en" ? "rounded-t-lg" : ""} ${
                lang.code === "ar" ? "rounded-b-lg" : ""
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span>{lang.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
