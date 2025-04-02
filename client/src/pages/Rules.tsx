import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Types for our rule categories
interface RuleCategory {
  id: string;
  title: string;
  content: string[];
}

export default function Rules() {
  const { t } = useTranslation();
  const [ruleCategories, setRuleCategories] = useState<RuleCategory[]>([]);
  
  // Helper function to safely extract rules from translations
  const getRulesContent = (path: string): string[] => {
    try {
      // Using any here to bypass TypeScript's strict checks on the returnObjects option
      const rules = t(path, { returnObjects: true }) as any;
      return rules ? Object.values(rules) : [];
    } catch (error) {
      console.error(`Error getting rules for ${path}:`, error);
      return [];
    }
  };
  
  useEffect(() => {
    const categories: RuleCategory[] = [
      {
        id: "general",
        title: "rules.sections.general.title",
        content: getRulesContent('rules.sections.general.rules')
      },
      {
        id: "equipment",
        title: "rules.sections.equipment.title",
        content: getRulesContent('rules.sections.equipment.rules')
      },
      {
        id: "recommendations",
        title: "rules.sections.recommendations.title",
        content: getRulesContent('rules.sections.recommendations.rules')
      },
      {
        id: "timeLimits",
        title: "rules.sections.timeLimits.title",
        content: getRulesContent('rules.sections.timeLimits.rules')
      },
      {
        id: "aidStations",
        title: "rules.sections.aidStations.title",
        content: getRulesContent('rules.sections.aidStations.rules')
      },
      {
        id: "penalties",
        title: "rules.sections.penalties.title",
        content: getRulesContent('rules.sections.penalties.rules')
      },
      {
        id: "safety",
        title: "rules.sections.safety.title",
        content: getRulesContent('rules.sections.safety.rules')
      },
      {
        id: "environment",
        title: "rules.sections.environment.title",
        content: getRulesContent('rules.sections.environment.rules')
      },
      {
        id: "registration",
        title: "rules.sections.registration.title",
        content: getRulesContent('rules.sections.registration.rules')
      }
    ];
    
    setRuleCategories(categories);
  }, [t]);

  return (
    <div>
      <section className="py-8 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("rules.title")}
          </h1>
          <p className="text-lg opacity-90">
            {t("rules.subtitle")}
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Alert className="mb-8 border-[#E64A19] bg-orange-50">
            <AlertCircle className="h-4 w-4 text-[#E64A19]" />
            <AlertTitle className="text-[#E64A19] font-heading font-semibold">
              {t("rules.important")}
            </AlertTitle>
            <AlertDescription>
              {t("rules.importantDescription")}
            </AlertDescription>
          </Alert>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="mb-6 text-lg">{t("rules.introduction")}</p>
              
              <Accordion type="single" collapsible className="w-full">
                {ruleCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="text-lg font-heading font-semibold text-[#2E7D32]">
                      {t(category.title)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        {category.content.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-neutral-dark mb-4">
              {t("rules.contactQuestion")}
            </p>
            <a 
              href="mailto:rules@trailrunpro.com" 
              className="text-[#2E7D32] hover:underline font-medium"
            >
              rules@trailrunpro.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
