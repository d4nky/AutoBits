import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, logout as logoutAuth } from "@/lib/auth";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setIsAuth(!!getToken());
  }, []);

  const handleLogout = () => {
    logoutAuth();
    setIsAuth(false);
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                💼
              </span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              {t("header.jobMarket")}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/marketplace"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("header.browseJobs")}
            </a>
            {isAuth && (
              <a
                href="/creator-dashboard"
                className="text-foreground hover:text-primary transition-colors"
              >
                {t("common.dashboard")}
              </a>
            )}
            <a
              href="/about"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("header.about")}
            </a>
          </nav>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {isAuth ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-2 h-10 px-3 border border-primary/30 bg-secondary hover:bg-secondary/80 text-foreground rounded-md font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  {t("common.profile")}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg animate-slide-up">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-foreground hover:bg-secondary transition-colors first:rounded-t-lg"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {t("header.myProfile")}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-foreground hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 last:rounded-b-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("common.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center h-10 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
                >
                  {t("header.signIn")}
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors"
                >
                  {t("header.getStarted")}
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-3 animate-slide-up">
            <a
              href="/marketplace"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("header.browseJobs")}
            </a>
            {isAuth && (
              <a
                href="/creator-dashboard"
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("common.dashboard")}
              </a>
            )}
            <a
              href="/about"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("header.about")}
            </a>
            <div className="py-2 border-t border-border">
              <LanguageSwitcher />
            </div>
            {isAuth ? (
              <>
                <a
                  href="/profile"
                  className="block text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("header.myProfile")}
                </a>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-foreground hover:text-red-600 transition-colors py-2"
                >
                  {t("common.logout")}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center w-full h-10 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
                >
                  {t("header.signIn")}
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center w-full h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors"
                >
                  {t("header.getStarted")}
                </a>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
