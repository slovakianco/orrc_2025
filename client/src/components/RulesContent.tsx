import { useTranslation } from "react-i18next";
import { File } from "lucide-react";

const RulesContent = () => {
  const { t } = useTranslation();

  // Rule sections
  const ruleSections = [
    {
      title: t('rules.sections.general.title'),
      rules: [
        t('rules.sections.general.rules.1'),
        t('rules.sections.general.rules.2'),
        t('rules.sections.general.rules.3'),
        t('rules.sections.general.rules.4')
      ]
    },
    {
      title: t('rules.sections.equipment.title'),
      rules: [
        t('rules.sections.equipment.rules.1'),
        t('rules.sections.equipment.rules.2'),
        t('rules.sections.equipment.rules.3'),
        t('rules.sections.equipment.rules.4')
      ]
    },
    {
      title: t('rules.sections.timeLimits.title'),
      rules: [
        t('rules.sections.timeLimits.rules.1'),
        t('rules.sections.timeLimits.rules.2'),
        t('rules.sections.timeLimits.rules.3')
      ]
    },
    {
      title: t('rules.sections.penalties.title'),
      rules: [
        t('rules.sections.penalties.rules.1'),
        t('rules.sections.penalties.rules.2'),
        t('rules.sections.penalties.rules.3'),
        t('rules.sections.penalties.rules.4')
      ]
    }
  ];

  return (
    <section id="rules" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('rules.title')}</h2>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
            {t('rules.subtitle')}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-8 shadow-md">
          {ruleSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              <h3 className="font-heading font-bold text-xl mb-4 flex items-center">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  {sectionIndex + 1}
                </span>
                {section.title}
              </h3>
              <ul className="space-y-3 text-neutral-gray pl-12">
                {section.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex} className="flex items-start">
                    <span className="text-primary mt-1 mr-2">✓</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="mt-8 text-center">
            <a href="#" className="inline-flex items-center text-primary font-medium hover:underline">
              <File className="mr-2 h-5 w-5" />
              {t('rules.downloadButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesContent;
