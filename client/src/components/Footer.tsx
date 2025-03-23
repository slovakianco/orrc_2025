import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <svg 
                viewBox="0 0 24 24" 
                className="h-10 w-10 text-white"
                fill="currentColor"
              >
                <path d="M14,6 L20,6 L20,20 L4,20 L4,6 L10,6 L10,4 C10,2.89 10.89,2 12,2 C13.11,2 14,2.89 14,4 L14,6 Z M12,3.8 C11.5,3.8 11.2,4.1 11.2,4.5 C11.2,4.9 11.5,5.2 12,5.2 C12.5,5.2 12.8,4.9 12.8,4.5 C12.8,4.1 12.5,3.8 12,3.8 Z M13,18 L13,10 L7,16 L11,16 L11,24 L17,18 L13,18 Z" />
              </svg>
              <span className="ml-2 font-heading font-bold text-white text-xl">TrailRunPro</span>
            </div>
            <p className="text-gray-300 mb-4">{t("footer.tagline")}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {[
                { path: "/", label: "navbar.home" },
                { path: "/races", label: "navbar.races" },
                { path: "/registration", label: "navbar.registration" },
                { path: "/participants", label: "navbar.participants" },
                { path: "/rules", label: "navbar.rules" },
              ].map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>
                    <a className="text-gray-300 hover:text-white transition duration-300">
                      {t(link.label)}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{t("footer.contactUs")}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-2 text-primary-light" />
                <span className="text-gray-300">123 Mountain Trail, Brasov, Romania</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-2 text-primary-light" />
                <a href="mailto:info@trailrunpro.com" className="text-gray-300 hover:text-white transition duration-300">
                  info@trailrunpro.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-2 text-primary-light" />
                <a href="tel:+40123456789" className="text-gray-300 hover:text-white transition duration-300">
                  +40 123 456 789
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">{t("footer.newsletter")}</h3>
            <p className="text-gray-300 mb-4">{t("footer.subscribeMessage")}</p>
            <form className="flex">
              <Input 
                type="email" 
                placeholder={t("footer.emailPlaceholder")} 
                className="w-full text-neutral-dark border border-transparent rounded-r-none focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
              <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-accent py-2 px-4 rounded-l-none transition duration-300">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
