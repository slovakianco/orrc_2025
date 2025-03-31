import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, Mountain, Send } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate subscription
    setTimeout(() => {
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className="bg-neutral-dark bg-opacity-95 backdrop-blur-sm text-neutral-light py-12 md:py-16">
      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="flex items-center mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-highlight rounded-full flex items-center justify-center mr-2 md:mr-3">
                <Mountain className="text-primary text-sm md:text-lg" />
              </div>
              <span className="font-heading font-bold text-lg md:text-xl">TRAIL<span className="text-accent">RUN</span></span>
            </div>
            <p className="text-neutral-light text-opacity-80 mb-3 md:mb-4 text-sm md:text-base">
              {t('footer.about')}
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a href="#" className="text-neutral-light hover:text-accent transition-colors duration-300">
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-neutral-light hover:text-accent transition-colors duration-300">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-neutral-light hover:text-accent transition-colors duration-300">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-neutral-light hover:text-accent transition-colors duration-300">
                <Youtube className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-base md:text-lg mb-3 md:mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link href="/" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/races" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('nav.races')}
                </Link>
              </li>
              <li>
                <Link href="/registration" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('nav.registration')}
                </Link>
              </li>
              <li>
                <Link href="/participants" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('nav.participants')}
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('nav.rules')}
                </Link>
              </li>
              <li>
                <Link href="/program" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('nav.program')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-base md:text-lg mb-3 md:mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <a href="#" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('footer.resources1')}
                </a>
              </li>
              <li>
                <Link href="/how-to-get-there" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('footer.resources2')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('footer.resources3')}
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('footer.resources4')}
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('footer.resources5')}
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300 text-sm md:text-base">
                  {t('footer.resources6')}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-base md:text-lg mb-3 md:mb-4">{t('footer.subscribe')}</h4>
            <p className="text-white text-opacity-80 mb-3 md:mb-4 text-sm md:text-base">
              {t('footer.subscribeText')}
            </p>
            <form className="mb-3 md:mb-4" onSubmit={handleSubscribe}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder={t('footer.emailPlaceholder')}
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-l-md focus:outline-none text-neutral-gray flex-grow text-sm md:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="bg-accent hover:bg-accent-dark text-white font-bold px-3 md:px-4 rounded-r-md transition-colors duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              </div>
            </form>
            <p className="text-xs md:text-sm text-white text-opacity-60">
              {t('footer.privacyNotice')}
            </p>
          </div>
        </div>
        
        <div className="border-t border-neutral-light border-opacity-20 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs md:text-sm text-neutral-light text-opacity-80 mb-4 md:mb-0">
            {t('footer.copyright')}
          </div>
          <div className="flex space-x-4 md:space-x-6 text-xs md:text-sm">
            <a href="#" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-neutral-light text-opacity-80 hover:text-accent transition-colors duration-300">
              {t('footer.cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
