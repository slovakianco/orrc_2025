import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div>
      <PageHeader
        title={t("privacyPolicy.title")}
        subtitle={t("privacyPolicy.subtitle")}
      />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.introduction.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.introduction.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.informationWeCollect.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.informationWeCollect.intro")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-semibold">
                        {t("privacyPolicy.informationWeCollect.personal.title")}:
                      </span>{" "}
                      {t("privacyPolicy.informationWeCollect.personal.description")}
                    </li>
                    <li>
                      <span className="font-semibold">
                        {t("privacyPolicy.informationWeCollect.race.title")}:
                      </span>{" "}
                      {t("privacyPolicy.informationWeCollect.race.description")}
                    </li>
                    <li>
                      <span className="font-semibold">
                        {t("privacyPolicy.informationWeCollect.payment.title")}:
                      </span>{" "}
                      {t("privacyPolicy.informationWeCollect.payment.description")}
                    </li>
                    <li>
                      <span className="font-semibold">
                        {t("privacyPolicy.informationWeCollect.automatic.title")}:
                      </span>{" "}
                      {t("privacyPolicy.informationWeCollect.automatic.description")}
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.howWeUseInformation.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.howWeUseInformation.intro")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t("privacyPolicy.howWeUseInformation.uses.registration")}</li>
                    <li>{t("privacyPolicy.howWeUseInformation.uses.communication")}</li>
                    <li>{t("privacyPolicy.howWeUseInformation.uses.improve")}</li>
                    <li>{t("privacyPolicy.howWeUseInformation.uses.safety")}</li>
                    <li>{t("privacyPolicy.howWeUseInformation.uses.legal")}</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.dataSharing.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.dataSharing.intro")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t("privacyPolicy.dataSharing.cases.partners")}</li>
                    <li>{t("privacyPolicy.dataSharing.cases.serviceProviders")}</li>
                    <li>{t("privacyPolicy.dataSharing.cases.legal")}</li>
                    <li>{t("privacyPolicy.dataSharing.cases.results")}</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.dataRetention.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.dataRetention.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.yourRights.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.yourRights.intro")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t("privacyPolicy.yourRights.rights.access")}</li>
                    <li>{t("privacyPolicy.yourRights.rights.rectification")}</li>
                    <li>{t("privacyPolicy.yourRights.rights.erasure")}</li>
                    <li>{t("privacyPolicy.yourRights.rights.restriction")}</li>
                    <li>{t("privacyPolicy.yourRights.rights.objection")}</li>
                    <li>{t("privacyPolicy.yourRights.rights.portability")}</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.security.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.security.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.changes.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.changes.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("privacyPolicy.contact.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("privacyPolicy.contact.content")}
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
                    {t("privacyPolicy.lastUpdated")}: {new Date().toLocaleDateString(currentLang, {
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