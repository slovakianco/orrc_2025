import { useState } from "react";
import { Link, useLocation } from "wouter";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

const routes = [
  { href: "/", label: "nav.home" },
  { href: "/races", label: "nav.races" },
  { href: "/registration", label: "nav.registration" },
  { href: "/participants", label: "nav.participants" },
  { href: "/rules", label: "nav.rules" },
  { href: "/program", label: "nav.program" },
  { href: "/contact", label: "nav.contact" },
  { href: "/sponsors", label: "nav.sponsors" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="h-10 w-10 text-primary"
                    fill="currentColor"
                  >
                    <path d="M14,6 L20,6 L20,20 L4,20 L4,6 L10,6 L10,4 C10,2.89 10.89,2 12,2 C13.11,2 14,2.89 14,4 L14,6 Z M12,3.8 C11.5,3.8 11.2,4.1 11.2,4.5 C11.2,4.9 11.5,5.2 12,5.2 C12.5,5.2 12.8,4.9 12.8,4.5 C12.8,4.1 12.5,3.8 12,3.8 Z M13,18 L13,10 L7,16 L11,16 L11,24 L17,18 L13,18 Z" />
                  </svg>
                  <span className="ml-2 font-heading font-bold text-primary text-xl">TrailRunPro</span>
                </a>
              </Link>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              {routes.map((route) => (
                <Link key={route.href} href={route.href}>
                  <a
                    className={`px-3 py-2 text-sm font-accent font-medium border-b-2 transition duration-150 ease-in-out ${
                      location === route.href
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-dark hover:text-primary hover:border-primary-light"
                    }`}
                  >
                    {t(route.label)}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block mr-4">
              <Link href="/registration">
                <a className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
                  {t('nav.registerButton')}
                </a>
              </Link>
            </div>
            <div className="mr-4">
              <LanguageSwitcher />
            </div>
            <div className="flex items-center md:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-primary transition duration-150 ease-in-out"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <a
                  onClick={closeMenu}
                  className={`block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium transition duration-150 ease-in-out ${
                    location === route.href
                      ? "bg-primary-light text-white"
                      : "text-neutral-dark hover:bg-gray-100 hover:text-primary"
                  }`}
                >
                  {t(route.label)}
                </a>
              </Link>
            ))}
            <div className="px-4 pt-4">
              <Link href="/registration">
                <a
                  onClick={closeMenu}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                >
                  {t('nav.registerButton')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
