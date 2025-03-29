import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { MapPin, Calendar, Users, Flag, Award, BookOpen, Phone, Gift } from 'lucide-react';

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  colorClass: string;
}

const SectionCard = ({ title, description, icon, to, colorClass }: SectionCardProps) => {
  return (
    <div className="h-full" onClick={() => window.location.href = to}>
      <div className="card h-full flex flex-col transition-all duration-300 hover:translate-y-[-8px] cursor-pointer">
        <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-slate-gray flex-grow">{description}</p>
        <div className="mt-4 text-sm font-medium text-sky-blue hover:underline">
          {/* Learn more link text is implied by the card being clickable */}
        </div>
      </div>
    </div>
  );
};

const SectionsOverview = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('nav.races'),
      description: t('sectionsOverview.races'),
      icon: <Flag className="h-6 w-6 text-white" />,
      to: '/races',
      colorClass: 'bg-alpine'
    },
    {
      title: t('nav.participants'),
      description: t('sectionsOverview.participants'),
      icon: <Users className="h-6 w-6 text-white" />,
      to: '/participants',
      colorClass: 'bg-sky'
    },
    {
      title: t('nav.program'),
      description: t('sectionsOverview.program'),
      icon: <Calendar className="h-6 w-6 text-white" />,
      to: '/program',
      colorClass: 'bg-sunset'
    },
    {
      title: t('nav.rules'),
      description: t('sectionsOverview.rules'),
      icon: <BookOpen className="h-6 w-6 text-white" />,
      to: '/rules',
      colorClass: 'bg-primary'
    },
    {
      title: t('nav.emaCircuit'),
      description: t('sectionsOverview.emaCircuit'),
      icon: <Award className="h-6 w-6 text-white" />,
      to: '/ema-circuit',
      colorClass: 'bg-sunrise'
    },
    {
      title: t('nav.sponsors'),
      description: t('sectionsOverview.sponsors'),
      icon: <Gift className="h-6 w-6 text-white" />,
      to: '/sponsors',
      colorClass: 'bg-trail-brown'
    },
    {
      title: t('nav.registration'),
      description: t('sectionsOverview.registration'),
      icon: <Flag className="h-6 w-6 text-white" />,
      to: '/registration',
      colorClass: 'bg-alpine'
    },
    {
      title: t('nav.contact'),
      description: t('sectionsOverview.contact'),
      icon: <Phone className="h-6 w-6 text-white" />,
      to: '/contact',
      colorClass: 'bg-sky'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('sectionsOverview.title')}</h2>
          <p className="text-lg text-slate-gray max-w-3xl mx-auto">
            {t('sectionsOverview.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <SectionCard key={index} {...section} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionsOverview;