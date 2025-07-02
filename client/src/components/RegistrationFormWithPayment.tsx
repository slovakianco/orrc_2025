import { useTranslation } from "react-i18next";

const RegistrationFormWithPayment = () => {
  const { t } = useTranslation();

  return (
    <section id="registration" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('registration.title')}</h2>
            <p className="text-lg text-neutral-gray">{t('registration.subtitle')}</p>
          </div>

          {/* Registration Closed Notice */}
          <div className="bg-red-100 border border-red-400 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xl font-bold text-red-800 text-center">
                {t('registration.closed.title', 'REGISTRATIONS ARE CLOSED')}
              </h3>
            </div>
            <p className="text-red-700 text-center mt-3 text-lg">
              {t('registration.closed.message', 'Registration for this event has ended. Thank you for your interest!')}
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {t('registration.closed.thankYou', 'Thank You for Your Interest!')}
              </h3>
              <p className="text-blue-700">
                {t('registration.closed.futureEvents', 'Stay tuned for future trail running events and competitions. Follow us on social media for updates!')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationFormWithPayment;