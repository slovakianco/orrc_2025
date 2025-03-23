import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Races from "@/pages/Races";
import Registration from "@/pages/Registration";
import Participants from "@/pages/Participants";
import Rules from "@/pages/Rules";
import Program from "@/pages/Program";
import Contact from "@/pages/Contact";
import Sponsors from "@/pages/Sponsors";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMemo } from "react";
import { LanguageProvider } from "./lib/hooks/useLanguage";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/races" component={Races} />
          <Route path="/registration" component={Registration} />
          <Route path="/participants" component={Participants} />
          <Route path="/rules" component={Rules} />
          <Route path="/program" component={Program} />
          <Route path="/contact" component={Contact} />
          <Route path="/sponsors" component={Sponsors} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router />
      <Toaster />
    </LanguageProvider>
  );
}

export default App;
