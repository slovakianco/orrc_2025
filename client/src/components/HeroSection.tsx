import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import CountdownTimer from "./CountdownTimer";

interface HeroSectionProps {
  imageUrl?: string;
}

const HeroSection = ({ imageUrl }: HeroSectionProps) => {
  const { t } = useTranslation();
  const eventDate = new Date("2025-07-05T08:30:00");

  return (
    <section className="relative min-h-[800px] bg-gradient-to-b from-stone-beige to-white">
      {/* Dynamic mountain silhouette */}
      <div className="absolute inset-x-0 bottom-0 h-32 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-full"
        >
          <path
            fill="#2A6D50"
            fillOpacity="0.1"
            d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,154.7C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-20 pb-32 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center gap-x-10">
          {/* Left Content */}
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            {/* Event date badge */}
            <div className="inline-flex items-center gap-2 bg-alpine text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {t("hero.date")}
            </div>

            {/* Main title */}
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-slate-gray leading-tight mb-6">
              <span className="block">{t("hero.title")}</span>
              <span className="text-alpine block mt-2">2025</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-gray mb-10 leading-relaxed max-w-xl">
              {t("hero.subtitle")}
            </p>

            {/* Countdown Timer - circular design */}
            <div className="mb-10">
              <h3 className="text-slate-gray font-semibold mb-3 text-xl">
                {t("countdown.title")}
              </h3>
              <CountdownTimer targetDate={eventDate} className="mt-4" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/registration"
                className="btn btn-lg bg-sunset hover:bg-sunset/90 text-stone-beige font-bold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {t("hero.registerButton")}
              </Link>
              <Link
                href="/races"
                className="btn btn-lg bg-alpine hover:bg-alpine/90 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                {t("hero.exploreButton")}
              </Link>
            </div>
          </div>

          {/* Right Content - Info Cards */}
          <div className="lg:w-1/2 space-y-6">
            {/* Card 1 - Enhanced description */}
            <div className="bg-sky/10 p-6 rounded-xl border border-sky/20 transform transition-all duration-300 hover:translate-y-[-5px] shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-sky/20 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-sky"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-gray mb-2">
                    EMA Circuit 2025
                  </h3>
                  <p className="text-slate-gray leading-relaxed">
                    {t("hero.enhancedDescription")}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Event highlights */}
            <div className="bg-alpine/10 p-6 rounded-xl border border-alpine/20 transform transition-all duration-300 hover:translate-y-[-5px] shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-alpine/20 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-alpine"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-gray mb-2">
                    {t("quickInfo.participants.title")}
                  </h3>
                  <p className="text-slate-gray leading-relaxed">
                    {t("quickInfo.participants.content")}
                  </p>
                  <Link
                    href="/participants"
                    className="inline-flex items-center text-sunset hover:text-alpine mt-2 transition-colors"
                  >
                    {t("quickInfo.participants.linkText")}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
