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
    <header className="bg-primary shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-highlight rounded-full flex items-center justify-center mr-3">
                <Mountain className="text-primary text-lg" />
              </div>
              <span className="font-heading font-bold text-xl text-neutral-light">
                Stana de Vale Trail Race
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item font-medium transition-all duration-200 text-neutral-light hover:text-white hover:transform hover:-translate-y-1 ${
                  item.isActive
                    ? "active text-highlight font-semibold border-b-2 border-highlight"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/registration"
              className="ml-4 bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              {t("nav.registerButton")}
            </Link>
            <div className="ml-2">
              <LanguageSelectorWithFlags />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-neutral-light focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="text-2xl" />
              ) : (
                <Menu className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`nav-item font-medium py-2 border-b border-primary-light text-neutral-light ${
                    item.isActive ? "active text-highlight font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/registration"
                onClick={() => setIsMenuOpen(false)}
                className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded text-center transition-colors duration-300"
              >
                {t("nav.registerButton")}
              </Link>
              <div className="pt-3 flex justify-center">
                <LanguageSelectorWithFlags />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
