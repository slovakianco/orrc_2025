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
      label: "CN Masters",
      path: "/cn-masters",
      isActive: location === "/cn-masters",
    },
    {
      label: t("nav.howToGet"),
      path: "/how-to-get-there",
      isActive: location === "/how-to-get-there",
    },
    {
      label: t("nav.accommodation"),
      path: "/accommodation",
      isActive: location === "/accommodation",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#2a6d50] shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-auto mr-2 overflow-hidden flex items-center">
                <img 
                  src="/logo.jpeg" 
                  alt="Stana de Vale Logo" 
                  className="h-full w-auto object-cover rounded-md"
                />
              </div>
              <span className="font-heading font-bold text-sm md:text-base text-white">
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
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="text-xl" />
              ) : (
                <Menu className="text-xl" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-2 lg:space-x-4 items-center mr-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-item font-medium transition-all duration-200 text-white hover:text-stone-beige text-xs lg:text-sm py-1 px-2 ${
                    item.isActive
                      ? "active bg-sunset/20 font-semibold rounded-md"
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
              className="ml-2 bg-sunset hover:bg-sunset-dark text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300 hidden lg:flex items-center text-sm"
            >
              {t("nav.registerButton")}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 overflow-hidden">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`nav-item font-medium py-2 border-b border-white/10 text-white transition-colors ${
                    item.isActive ? "active bg-sunset/20 font-semibold rounded-t-md" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/registration"
                onClick={() => setIsMenuOpen(false)}
                className="bg-sunset hover:bg-sunset/90 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors duration-300 mt-1 shadow-md"
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
