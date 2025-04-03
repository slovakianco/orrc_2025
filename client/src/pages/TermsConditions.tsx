import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsConditions() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div>
      <PageHeader
        title={t("termsConditions.title")}
        subtitle={t("termsConditions.subtitle")}
      />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.introduction.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.introduction.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.registration.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.registration.intro")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t("termsConditions.registration.requirements.age")}</li>
                    <li>{t("termsConditions.registration.requirements.health")}</li>
                    <li>{t("termsConditions.registration.requirements.equipment")}</li>
                    <li>{t("termsConditions.registration.requirements.information")}</li>
                    <li>{t("termsConditions.registration.requirements.fees")}</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.participationRules.title")}
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t("termsConditions.participationRules.rules.bib")}</li>
                    <li>{t("termsConditions.participationRules.rules.route")}</li>
                    <li>{t("termsConditions.participationRules.rules.checkpoints")}</li>
                    <li>{t("termsConditions.participationRules.rules.timeLimits")}</li>
                    <li>{t("termsConditions.participationRules.rules.environment")}</li>
                    <li>{t("termsConditions.participationRules.rules.assistance")}</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.liability.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.liability.content1")}
                  </p>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.liability.content2")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.medicalResponsibility.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.medicalResponsibility.content1")}
                  </p>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.medicalResponsibility.content2")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.cancellationPolicy.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.cancellationPolicy.eventCancellation")}
                  </p>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.cancellationPolicy.participantCancellation")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.imageRights.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.imageRights.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.personalData.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.personalData.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.modifications.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.modifications.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("termsConditions.contact.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("termsConditions.contact.content")}
                  </p>
                  <p className="text-neutral-dark mb-4">
                    <a
                      href="mailto:contact@stanatrailrace.ro"
                      className="text-[#2E7D32] hover:underline font-medium"
                    >
                      contact@stanatrailrace.ro
                    </a>
                  </p>
                </div>

                <div className="text-sm text-neutral-dark/70 mt-8 pt-4 border-t">
                  <p>
                    {t("termsConditions.lastUpdated")}: {new Date().toLocaleDateString(currentLang, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}