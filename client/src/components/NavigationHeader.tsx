import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { NavItem } from "@/lib/types";
import { Menu, X, Mountain } from "lucide-react";
import LanguageSelectorWithFlags from "./LanguageSelectorWithFlags";

const NavigationHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { label: t("nav.home"), path: "/", isActive: location === "/" },
    { label: t("nav.races"), path: "/races", isActive: location === "/races" },
    {
      label: t("nav.registration"),
      path: "/registration",
      isActive: location === "/registration",
    },
    {
      label: t("nav.participants"),
      path: "/participants",
      isActive: location === "/participants",
    },
    { label: t("nav.rules"), path: "/rules", isActive: location === "/rules" },
    {
      label: t("nav.program"),
      path: "/program",
      isActive: location === "/program",
    },
    {
      label: t("nav.contact"),
      path: "/contact",
      isActive: location === "/contact",
    },
    {
      label: t("nav.sponsors"),
      path: "/sponsors",
      isActive: location === "/sponsors",
    },
    {
      label: t("nav.emaCircuit"),
      path: "/ema-circuit",
      isActive: location === "/ema-circuit",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-alpine shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-sunset rounded-full flex items-center justify-center mr-3">
                <Mountain className="text-white text-lg" />
              </div>
              <span className="font-heading font-bold text-lg md:text-xl text-stone-beige">
                Stana de Vale Trail Race
              </span>
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            {/* Mobile language selector - always visible */}
            <div className="mr-3">
              <LanguageSelectorWithFlags />
            </div>
            
            {/* Mobile menu toggle */}
            <button
              onClick={toggleMenu}
              className="text-stone-beige focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="text-2xl" />
              ) : (
                <Menu className="text-2xl" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-4 lg:space-x-6 items-center mr-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-item font-medium transition-all duration-200 text-stone-beige hover:text-white hover:transform hover:-translate-y-1 text-sm lg:text-base ${
                    item.isActive
                      ? "active text-white font-semibold border-b-2 border-sunset"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Desktop language selector */}
            <LanguageSelectorWithFlags />
            
            {/* Registration button */}
            <Link
              href="/registration"
              className="ml-4 bg-sunset hover:bg-sunset-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 hidden lg:flex items-center"
            >
              {t("nav.registerButton")}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 overflow-hidden">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`nav-item font-medium py-2 border-b border-white/10 text-stone-beige transition-colors ${
                    item.isActive ? "active text-white font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/registration"
                onClick={() => setIsMenuOpen(false)}
                className="bg-sunset hover:bg-sunset/90 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors duration-300 mt-2 shadow-md"
              >
                {t("nav.registerButton")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
