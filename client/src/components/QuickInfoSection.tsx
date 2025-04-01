import { useTranslation } from "react-i18next";
import { MapPin, Calendar, Users } from "lucide-react";
import { Link } from "wouter";

const QuickInfoSection = () => {
  const { t } = useTranslation();

  const infoItems = [
    {
      icon: <MapPin className="text-white text-xl" />,
      title: t("quickInfo.location.title"),
      content: t("quickInfo.location.content"),
      link: "/how-to-get-there",
      linkText: t("quickInfo.location.linkText"),
    },
    {
      icon: <Calendar className="text-white text-xl" />,
      title: t("quickInfo.date.title"),
      content: t("quickInfo.date.content"),
      link: "/program",
      linkText: t("quickInfo.date.linkText"),
    },
    {
      icon: <Users className="text-white text-xl" />,
      title: t("quickInfo.participants.title"),
      content: t("quickInfo.participants.content"),
      link: "/participants",
      linkText: t("quickInfo.participants.linkText"),
    },
  ];

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="bg-neutral-light bg-opacity-50 rounded-lg p-6 flex items-start"
            >
              <div className="bg-primary rounded-full p-3 mr-4">
                {item.icon}
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-gray">{item.content}</p>
                <Link
                  href={item.link}
                  className="text-primary font-medium mt-2 inline-block hover:underline"
                >
                  {item.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickInfoSection;
