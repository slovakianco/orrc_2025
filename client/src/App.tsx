import { Switch, Route, useLocation } from "wouter";
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
import HowToGetPage from "@/pages/HowToGetPage";
import EmailTestPage from "@/pages/EmailTestPage";

// Import Components
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import LanguageSelector from "@/components/LanguageSelector";

function Router() {
  // Get current location
  const [location] = useLocation();
  
  // Scroll to top when location changes (page navigation)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader />
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
          <Route path="/how-to-get-there" component={HowToGetPage} />
          <Route path="/email-test" component={EmailTestPage} />
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
