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
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <Mountain className="text-primary text-lg" />
              </div>
              <span className="font-heading font-bold text-xl">TRAIL<span className="text-accent-light">RUN</span></span>
            </div>
            <p className="text-white text-opacity-80 mb-4">
              {t('footer.about')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent-light transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent-light transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent-light transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent-light transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/races" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('nav.races')}
                </Link>
              </li>
              <li>
                <Link href="/registration" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('nav.registration')}
                </Link>
              </li>
              <li>
                <Link href="/participants" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('nav.participants')}
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('nav.rules')}
                </Link>
              </li>
              <li>
                <Link href="/program" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('nav.program')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('footer.resources1')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('footer.resources2')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('footer.resources3')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('footer.resources4')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('footer.resources5')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-opacity-80 hover:text-accent-light transition-colors duration-300">
                  {t('footer.resources6')}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t('footer.subscribe')}</h4>
            <p className="text-white text-opacity-80 mb-4">
              {t('footer.subscribeText')}
            </p>
            <form className="mb-4" onSubmit={handleSubscribe}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder={t('footer.emailPlaceholder')}
                  className="px-4 py-2 rounded-l-md focus:outline-none text-neutral-gray flex-grow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="bg-accent hover:bg-accent-dark text-white font-bold px-4 rounded-r-md transition-colors duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
            <p className="text-sm text-white text-opacity-60">
              {t('footer.privacyNotice')}
            </p>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white text-opacity-60 mb-4 md:mb-0">
            {t('footer.copyright')}
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white text-opacity-60 hover:text-accent-light transition-colors duration-300">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-white text-opacity-60 hover:text-accent-light transition-colors duration-300">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-white text-opacity-60 hover:text-accent-light transition-colors duration-300">
              {t('footer.cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
