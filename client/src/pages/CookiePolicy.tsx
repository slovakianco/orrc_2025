import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CookiePolicy() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div>
      <PageHeader
        title={t("cookiePolicy.title")}
        subtitle={t("cookiePolicy.subtitle")}
      />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("cookiePolicy.introduction.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("cookiePolicy.introduction.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("cookiePolicy.whatAreCookies.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("cookiePolicy.whatAreCookies.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("cookiePolicy.cookiesWeUse.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("cookiePolicy.cookiesWeUse.intro")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-semibold">
                        {t("cookiePolicy.cookiesWeUse.necessary.title")}:
                      </span>{" "}
                      {t("cookiePolicy.cookiesWeUse.necessary.description")}
                    </li>
                    <li>
                      <span className="font-semibold">
                        {t("cookiePolicy.cookiesWeUse.preferences.title")}:
                      </span>{" "}
                      {t("cookiePolicy.cookiesWeUse.preferences.description")}
                    </li>
                    <li>
                      <span className="font-semibold">
                        {t("cookiePolicy.cookiesWeUse.statistics.title")}:
                      </span>{" "}
                      {t("cookiePolicy.cookiesWeUse.statistics.description")}
                    </li>
                    <li>
                      <span className="font-semibold">
                        {t("cookiePolicy.cookiesWeUse.marketing.title")}:
                      </span>{" "}
                      {t("cookiePolicy.cookiesWeUse.marketing.description")}
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("cookiePolicy.managingCookies.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("cookiePolicy.managingCookies.content")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t("cookiePolicy.managingCookies.browsers.chrome")}</li>
                    <li>{t("cookiePolicy.managingCookies.browsers.firefox")}</li>
                    <li>{t("cookiePolicy.managingCookies.browsers.safari")}</li>
                    <li>{t("cookiePolicy.managingCookies.browsers.edge")}</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("cookiePolicy.updates.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("cookiePolicy.updates.content")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-heading font-semibold text-[#2E7D32] mb-3">
                    {t("cookiePolicy.contact.title")}
                  </h2>
                  <p className="text-neutral-dark mb-4">
                    {t("cookiePolicy.contact.content1")}
                  </p>
                  <p className="text-neutral-dark mb-4">
                    <a
                      href="mailto:contact@stanatrailrace.ro"
                      className="text-[#2E7D32] hover:underline font-medium"
                    >
                      contact@stanatrailrace.ro
                    </a>
                  </p>
                  <p className="text-neutral-dark">
                    {t("cookiePolicy.contact.content2")}
                  </p>
                </div>

                <div className="text-sm text-neutral-dark/70 mt-8 pt-4 border-t">
                  <p>
                    {t("cookiePolicy.lastUpdated")}: {new Date().toLocaleDateString(currentLang, {
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