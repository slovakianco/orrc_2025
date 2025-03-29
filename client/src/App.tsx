import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./lib/i18n";

// Import Pages
import HomePage from "@/pages/HomePage";
import RacesPage from "@/pages/RacesPage";
import RaceDetail from "@/pages/RaceDetail";
import RegistrationPage from "@/pages/RegistrationPage";
import ParticipantsPage from "@/pages/ParticipantsPage";
import RulesPage from "@/pages/RulesPage";
import ProgramPage from "@/pages/ProgramPage";
import ContactPage from "@/pages/ContactPage";
import SponsorsPage from "@/pages/SponsorsPage";
import EmaCircuitPage from "@/pages/EmaCircuitPage";

// Import Components
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import LanguageSelector from "@/components/LanguageSelector";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader className="bg-[#2a6d50]" />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/races" component={RacesPage} />
          <Route path="/races/:id" component={RaceDetail} />
          <Route path="/registration" component={RegistrationPage} />
          <Route path="/participants" component={ParticipantsPage} />
          <Route path="/rules" component={RulesPage} />
          <Route path="/program" component={ProgramPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/sponsors" component={SponsorsPage} />
          <Route path="/ema-circuit" component={EmaCircuitPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Set the document title
  useEffect(() => {
    document.title = "TrailRun Competition";
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
