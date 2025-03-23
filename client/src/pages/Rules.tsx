import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Rules() {
  const { t } = useTranslation();

  const ruleCategories = [
    {
      id: "general",
      title: "rules.general.title",
      items: [
        "rules.general.item1",
        "rules.general.item2",
        "rules.general.item3",
        "rules.general.item4",
        "rules.general.item5"
      ]
    },
    {
      id: "equipment",
      title: "rules.equipment.title",
      items: [
        "rules.equipment.item1",
        "rules.equipment.item2",
        "rules.equipment.item3",
        "rules.equipment.item4"
      ]
    },
    {
      id: "conduct",
      title: "rules.conduct.title",
      items: [
        "rules.conduct.item1",
        "rules.conduct.item2",
        "rules.conduct.item3",
        "rules.conduct.item4"
      ]
    },
    {
      id: "safety",
      title: "rules.safety.title",
      items: [
        "rules.safety.item1",
        "rules.safety.item2",
        "rules.safety.item3",
        "rules.safety.item4"
      ]
    },
    {
      id: "environment",
      title: "rules.environment.title",
      items: [
        "rules.environment.item1",
        "rules.environment.item2",
        "rules.environment.item3"
      ]
    }
  ];

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
                        {category.items.map((item, index) => (
                          <li key={index}>{t(item)}</li>
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
