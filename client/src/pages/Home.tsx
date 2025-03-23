import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mountain, Trophy, Star } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

  const featuredRaces = [
    {
      id: 1,
      name: "race.ultra.name",
      image: "https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "ULTRA",
      date: "home.featuredRaces.raceDate1",
      elevation: 3500,
      difficulty: "race.difficulty.expert",
      path: "/races"
    },
    {
      id: 2,
      name: "race.half.name",
      image: "https://images.unsplash.com/photo-1452573992436-6d508f200b30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "HALF MARATHON",
      date: "home.featuredRaces.raceDate2",
      elevation: 850,
      difficulty: "race.difficulty.intermediate",
      path: "/races"
    },
    {
      id: 3,
      name: "race.10k.name",
      image: "https://images.unsplash.com/photo-1502786129293-79981df4e689?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "10K",
      date: "home.featuredRaces.raceDate3",
      elevation: 350,
      difficulty: "race.difficulty.beginner",
      path: "/races"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "Ultra Runner, UK",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      text: "home.testimonials.quote1"
    },
    {
      id: 2,
      name: "Maria Sanchez",
      role: "Trail Runner, Spain",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      text: "home.testimonials.quote2"
    },
    {
      id: 3,
      name: "Jan Novak",
      role: "Marathon Runner, Czech Republic",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      text: "home.testimonials.quote3"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cover bg-center h-96 flex items-center" style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl mb-8">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/registration">
                <Button className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-accent font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                  {t("home.hero.registerButton")}
                </Button>
              </Link>
              <Link href="/races">
                <Button variant="outline" className="bg-transparent hover:bg-white/20 text-white font-accent font-bold py-3 px-6 rounded-md border-2 border-white transition duration-300 ease-in-out">
                  {t("home.hero.exploreButton")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold mb-12 text-center text-neutral-dark">
            {t("home.highlights.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-neutral-light rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
              <CardContent className="p-0">
                <div className="h-12 w-12 bg-[#2E7D32] rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2 text-[#2E7D32]">
                  {t("home.highlights.date")}
                </h3>
                <p className="text-neutral-dark">
                  {t("home.highlights.dateDescription")}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-neutral-light rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
              <CardContent className="p-0">
                <div className="h-12 w-12 bg-[#2E7D32] rounded-full flex items-center justify-center mb-4">
                  <Mountain className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2 text-[#2E7D32]">
                  {t("home.highlights.categories")}
                </h3>
                <p className="text-neutral-dark">
                  {t("home.highlights.categoriesDescription")}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-neutral-light rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
              <CardContent className="p-0">
                <div className="h-12 w-12 bg-[#2E7D32] rounded-full flex items-center justify-center mb-4">
                  <Trophy className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2 text-[#2E7D32]">
                  {t("home.highlights.prize")}
                </h3>
                <p className="text-neutral-dark">
                  {t("home.highlights.prizeDescription")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Races */}
      <section className="py-16 bg-gray-50 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Cpath fill=%22%23e0e0e0%22 fill-opacity=%220.3%22 d=%22M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z%22%3E%3C/path%3E%3C/svg%3E')]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold mb-12 text-center text-neutral-dark">
            {t("home.featuredRaces.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRaces.map((race) => (
              <Card key={race.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                <div className="w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url(${race.image})` }}></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`bg-${race.category === 'ULTRA' ? 'secondary-light' : race.category === 'HALF MARATHON' ? 'primary-light' : 'accent-light'} text-white text-xs font-accent font-bold px-2 py-1 rounded`}>
                      {race.category}
                    </span>
                    <span className="text-neutral-medium text-sm">{t(race.date)}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2 text-neutral-dark">
                    {t(race.name)}
                  </h3>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Mountain className="text-[#2E7D32] mr-2 h-4 w-4" />
                      <span className="text-sm text-neutral-dark">
                        {t("race.elevation", { elevation: race.elevation })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="text-[#2E7D32] mr-2 h-4 w-4" />
                      <span className="text-sm text-neutral-dark">
                        {t("race.difficulty.label")}: {t(race.difficulty)}
                      </span>
                    </div>
                  </div>
                  <div className="elevation-chart h-[60px] rounded-md relative overflow-hidden mb-4 bg-gradient-to-b from-transparent via-[#2E7D32] to-[#C62828]" aria-hidden="true">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 25%22%3E%3Cpath fill=%22none%22 stroke=%22white%22 stroke-width=%220.5%22 d=%22M0,25 L15,15 Q25,5 35,15 T55,10 T75,20 T100,5 L100,25 Z%22/%3E%3C/svg%3E')] bg-no-repeat"></div>
                  </div>
                  <Link href={race.path}>
                    <Button className="w-full text-center bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-accent font-medium py-2 px-4 rounded transition duration-300">
                      {t("home.featuredRaces.viewDetails")}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/races">
              <Button className="inline-block bg-[#FF5722] hover:bg-[#E64A19] text-white font-accent font-bold py-3 px-8 rounded-md transition duration-300 ease-in-out shadow-md hover:shadow-lg">
                {t("home.featuredRaces.viewAllButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#1B5E20] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold mb-12 text-center">
            {t("home.testimonials.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-cover bg-center mr-4" style={{ backgroundImage: `url('${testimonial.image}')` }}></div>
                  <div>
                    <h4 className="font-heading font-semibold">{testimonial.name}</h4>
                    <p className="text-sm opacity-75">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic opacity-90">
                  {t(testimonial.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Banner */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-heading font-bold mb-6 text-center text-neutral-dark">
            {t("home.sponsors.title")}
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((sponsor) => (
              <div key={sponsor} className="w-24 h-12 bg-neutral-light flex items-center justify-center rounded">
                <div className="text-neutral-medium font-bold">SPONSOR {sponsor}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
