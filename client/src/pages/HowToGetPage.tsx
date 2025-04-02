import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Plane, Car, Train, Bus, Car as CarIcon, Hotel } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const HowToGetPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <PageHeader 
        title={t('howToGet.title')} 
        subtitle={t('howToGet.subtitle')}
      />

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Introduction */}
        <div className="mb-8 md:mb-10">
          <p className="text-base md:text-lg mb-6 md:mb-8">{t('howToGet.introduction')}</p>
          
          <Alert className="mb-6 md:mb-8 bg-[#FFF8E1] border-[#FFB300] text-[#BF6800]">
            <AlertTitle className="flex items-start md:items-center gap-2 text-base md:text-lg font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#F57F17] mt-0.5 md:mt-0 flex-shrink-0">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              {t('howToGet.importantNote')}
            </AlertTitle>
            <AlertDescription className="text-[#BF6800] text-base pl-7 md:pl-8 mt-1">{t('howToGet.weatherNote')}</AlertDescription>
          </Alert>
        </div>

        {/* Location Overview Card */}
        <Card className="mb-8 md:mb-10">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <MapPin className="text-primary h-5 w-5 md:h-6 md:w-6" />
              <CardTitle className="text-lg md:text-2xl">{t('howToGet.locationTitle')}</CardTitle>
            </div>
            <CardDescription className="text-sm md:text-base">{t('howToGet.locationDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <div className="aspect-video w-full overflow-hidden rounded-md border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21895.53139450509!2d22.595973799999998!3d46.678557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4748781358b12579%3A0xaf4a20faa6fa97e8!2sStana%20de%20Vale!5e0!3m2!1sen!2sro!4v1680000000000!5m2!1sen!2sro" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </CardContent>
        </Card>

        {/* Transportation Tabs */}
        <Tabs defaultValue="air" className="mb-10">
          <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4 mb-6 bg-primary">
            <TabsTrigger value="air" className="flex items-center gap-1 text-xs md:text-sm text-white data-[state=active]:text-white">
              <Plane className="h-3 w-3 md:h-4 md:w-4" /> {t('howToGet.byAir.title')}
            </TabsTrigger>
            <TabsTrigger value="car" className="flex items-center gap-1 text-xs md:text-sm text-white data-[state=active]:text-white">
              <Car className="h-3 w-3 md:h-4 md:w-4" /> {t('howToGet.byCar.title')}
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center gap-1 text-xs md:text-sm text-white data-[state=active]:text-white">
              <Train className="h-3 w-3 md:h-4 md:w-4" /> {t('howToGet.byTrain.title')}
            </TabsTrigger>
            <TabsTrigger value="bus" className="flex items-center gap-1 text-xs md:text-sm text-white data-[state=active]:text-white">
              <Bus className="h-3 w-3 md:h-4 md:w-4" /> {t('howToGet.byBus.title')}
            </TabsTrigger>
          </TabsList>

          {/* By Air Tab */}
          <TabsContent value="air">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">{t('howToGet.byAir.title')}</CardTitle>
                <CardDescription className="text-sm">{t('howToGet.byAir.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="border-2 border-primary/10">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-base md:text-lg">{t('howToGet.byAir.oradea.title')}</CardTitle>
                      <CardDescription className="text-sm">{t('howToGet.byAir.oradea.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.oradea.distance')}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.oradea.travelTime')}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.oradea.transport')}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary/10">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-base md:text-lg">{t('howToGet.byAir.cluj.title')}</CardTitle>
                      <CardDescription className="text-sm">{t('howToGet.byAir.cluj.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.cluj.distance')}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.cluj.travelTime')}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.cluj.transport')}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-primary/10">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-base md:text-lg">Budapest Airport (BUD)</CardTitle>
                      <CardDescription className="text-sm">International airport with numerous European connections</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Distance: Approximately 300 km (186 miles)</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Travel time: 4-5 hours by car</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Connection: Car rental or private transfer recommended</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary/10">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-base md:text-lg">Debrecen Airport (DEB)</CardTitle>
                      <CardDescription className="text-sm">Smaller international airport in eastern Hungary</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Distance: Approximately 160 km (99 miles)</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Travel time: 2.5-3 hours by car</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Connection: Car rental available at the airport</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Car Tab */}
          <TabsContent value="car">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">{t('howToGet.byCar.title')}</CardTitle>
                <CardDescription className="text-sm">{t('howToGet.byCar.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">{t('howToGet.byCar.fromOradea.title')}</h3>
                    <p className="mb-2 text-sm md:text-base">{t('howToGet.byCar.fromOradea.description')}</p>
                    <ul className="space-y-2 ml-6 list-disc text-sm md:text-base">
                      <li>{t('howToGet.byCar.fromOradea.route1')}</li>
                      <li>{t('howToGet.byCar.fromOradea.route2')}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">{t('howToGet.byCar.fromCluj.title')}</h3>
                    <p className="mb-2 text-sm md:text-base">{t('howToGet.byCar.fromCluj.description')}</p>
                    <ul className="space-y-2 ml-6 list-disc text-sm md:text-base">
                      <li>{t('howToGet.byCar.fromCluj.route')}</li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">{t('howToGet.byCar.parking.title')}</h3>
                    <p className="text-sm md:text-base">{t('howToGet.byCar.parking.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Train Tab */}
          <TabsContent value="train">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">{t('howToGet.byTrain.title')}</CardTitle>
                <CardDescription className="text-sm">{t('howToGet.byTrain.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">{t('howToGet.byTrain.connections.title')}</h3>
                    <ul className="space-y-2 ml-6 list-disc text-sm md:text-base">
                      <li>{t('howToGet.byTrain.connections.connection1')}</li>
                      <li>{t('howToGet.byTrain.connections.connection2')}</li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">{t('howToGet.byTrain.lastLeg.title')}</h3>
                    <p className="text-sm md:text-base">{t('howToGet.byTrain.lastLeg.description')}</p>
                  </div>
                  
                  <div className="bg-primary p-3 md:p-4 rounded-lg mt-4">
                    <p className="text-xs md:text-sm text-white">
                      <span className="font-medium">Tip:</span> Use <a href="https://www.cfrcalatori.ro/" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2">CFR Călători</a> for Romanian train schedules.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Bus Tab */}
          <TabsContent value="bus">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">{t('howToGet.byBus.title')}</CardTitle>
                <CardDescription className="text-sm">{t('howToGet.byBus.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">{t('howToGet.byBus.services.title')}</h3>
                    <ul className="space-y-2 ml-6 list-disc text-sm md:text-base">
                      <li>{t('howToGet.byBus.services.service1')}</li>
                      <li>{t('howToGet.byBus.services.service2')}</li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">{t('howToGet.byBus.schedules.title')}</h3>
                    <p className="text-sm md:text-base">{t('howToGet.byBus.schedules.description')}</p>
                  </div>
                  
                  <div className="bg-primary p-3 md:p-4 rounded-lg mt-4">
                    <p className="text-xs md:text-sm text-white">
                      <span className="font-medium">Tip:</span> <a href="https://www.autogari.ro/" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2">autogari.ro</a> is a useful resource for bus schedules in Romania.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Local Transportation */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
            <CarIcon className="h-5 w-5 md:h-6 md:w-6" /> {t('howToGet.localTransport.title')}
          </h2>
          <p className="mb-6 text-sm md:text-base">{t('howToGet.localTransport.description')}</p>
          
          {/* Important Transportation Notice */}
          <div className="mb-8 bg-primary/10 border-l-4 border-primary p-6 rounded-lg shadow-md">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-4">
              {t('howToGet.localTransport.shuttles.notice')}
            </h3>
            <p className="font-medium text-gray-700 mb-3">
              {t('howToGet.localTransport.shuttles.description')}
            </p>
            
            <div className="mt-4">
              <p className="font-semibold text-primary-dark mb-4">
                {t('howToGet.localTransport.shuttles.shuttle')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* To Destination */}
                <Card className="bg-white border-2 border-primary/20">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base font-bold">{t('howToGet.localTransport.shuttles.toDestination.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-primary-dark">
                          {t('howToGet.localTransport.shuttles.toDestination.friday')}
                        </p>
                        <p>{t('howToGet.localTransport.shuttles.toDestination.fridayTimes')}</p>
                      </div>
                      <div>
                        <p className="font-medium text-primary-dark">
                          {t('howToGet.localTransport.shuttles.toDestination.saturday')}
                        </p>
                        <p>{t('howToGet.localTransport.shuttles.toDestination.saturdayTimes')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* From Destination */}
                <Card className="bg-white border-2 border-primary/20">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base font-bold">{t('howToGet.localTransport.shuttles.fromDestination.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-primary-dark">
                          {t('howToGet.localTransport.shuttles.fromDestination.friday')}
                        </p>
                        <p>{t('howToGet.localTransport.shuttles.fromDestination.fridayTimes')}</p>
                      </div>
                      <div>
                        <p className="font-medium text-primary-dark">
                          {t('howToGet.localTransport.shuttles.fromDestination.saturday')}
                        </p>
                        <p>{t('howToGet.localTransport.shuttles.fromDestination.saturdayTimes')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">{t('howToGet.localTransport.taxis.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <p className="text-sm md:text-base">{t('howToGet.localTransport.taxis.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accommodation */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
            <Hotel className="h-5 w-5 md:h-6 md:w-6" /> {t('howToGet.accommodation.title')}
          </h2>
          <p className="mb-6 text-sm md:text-base">{t('howToGet.accommodation.description')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">{t('howToGet.accommodation.options.option1.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <p className="text-sm md:text-base">{t('howToGet.accommodation.options.option1.description')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">{t('howToGet.accommodation.options.option2.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <p className="text-sm md:text-base">{t('howToGet.accommodation.options.option2.description')}</p>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">{t('howToGet.accommodation.options.option3.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <p className="text-sm md:text-base">{t('howToGet.accommodation.options.option3.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToGetPage;