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

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Introduction */}
        <div className="mb-10">
          <p className="text-lg text-gray-700 mb-8">{t('howToGet.introduction')}</p>
          
          <Alert className="mb-8 bg-amber-50 border-amber-200">
            <AlertTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              {t('howToGet.importantNote')}
            </AlertTitle>
            <AlertDescription>{t('howToGet.weatherNote')}</AlertDescription>
          </Alert>
        </div>

        {/* Location Overview Card */}
        <Card className="mb-10">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-primary h-6 w-6" />
              <CardTitle className="text-2xl">{t('howToGet.locationTitle')}</CardTitle>
            </div>
            <CardDescription>{t('howToGet.locationDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
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
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="air" className="flex items-center gap-2">
              <Plane className="h-4 w-4" /> {t('howToGet.byAir.title')}
            </TabsTrigger>
            <TabsTrigger value="car" className="flex items-center gap-2">
              <Car className="h-4 w-4" /> {t('howToGet.byCar.title')}
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center gap-2">
              <Train className="h-4 w-4" /> {t('howToGet.byTrain.title')}
            </TabsTrigger>
            <TabsTrigger value="bus" className="flex items-center gap-2">
              <Bus className="h-4 w-4" /> {t('howToGet.byBus.title')}
            </TabsTrigger>
          </TabsList>

          {/* By Air Tab */}
          <TabsContent value="air">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('howToGet.byAir.title')}</CardTitle>
                <CardDescription>{t('howToGet.byAir.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg">{t('howToGet.byAir.oradea.title')}</CardTitle>
                      <CardDescription>{t('howToGet.byAir.oradea.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.oradea.distance')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.oradea.travelTime')}</span>
                        </li>
                        <li className="flex items-start gap-2">
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
                    <CardHeader>
                      <CardTitle className="text-lg">{t('howToGet.byAir.cluj.title')}</CardTitle>
                      <CardDescription>{t('howToGet.byAir.cluj.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.cluj.distance')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="min-w-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>{t('howToGet.byAir.cluj.travelTime')}</span>
                        </li>
                        <li className="flex items-start gap-2">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Car Tab */}
          <TabsContent value="car">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('howToGet.byCar.title')}</CardTitle>
                <CardDescription>{t('howToGet.byCar.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t('howToGet.byCar.fromOradea.title')}</h3>
                    <p className="text-muted-foreground mb-2">{t('howToGet.byCar.fromOradea.description')}</p>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>{t('howToGet.byCar.fromOradea.route1')}</li>
                      <li>{t('howToGet.byCar.fromOradea.route2')}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t('howToGet.byCar.fromCluj.title')}</h3>
                    <p className="text-muted-foreground mb-2">{t('howToGet.byCar.fromCluj.description')}</p>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>{t('howToGet.byCar.fromCluj.route')}</li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">{t('howToGet.byCar.parking.title')}</h3>
                    <p>{t('howToGet.byCar.parking.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Train Tab */}
          <TabsContent value="train">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('howToGet.byTrain.title')}</CardTitle>
                <CardDescription>{t('howToGet.byTrain.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t('howToGet.byTrain.connections.title')}</h3>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>{t('howToGet.byTrain.connections.connection1')}</li>
                      <li>{t('howToGet.byTrain.connections.connection2')}</li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">{t('howToGet.byTrain.lastLeg.title')}</h3>
                    <p>{t('howToGet.byTrain.lastLeg.description')}</p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <p className="text-sm">
                      <span className="font-medium">Tip:</span> Use <a href="https://www.cfrcalatori.ro/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">CFR Călători</a> for Romanian train schedules.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Bus Tab */}
          <TabsContent value="bus">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('howToGet.byBus.title')}</CardTitle>
                <CardDescription>{t('howToGet.byBus.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t('howToGet.byBus.services.title')}</h3>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>{t('howToGet.byBus.services.service1')}</li>
                      <li>{t('howToGet.byBus.services.service2')}</li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">{t('howToGet.byBus.schedules.title')}</h3>
                    <p>{t('howToGet.byBus.schedules.description')}</p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <p className="text-sm">
                      <span className="font-medium">Tip:</span> <a href="https://www.autogari.ro/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">autogari.ro</a> is a useful resource for bus schedules in Romania.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Local Transportation */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
            <CarIcon className="h-6 w-6" /> {t('howToGet.localTransport.title')}
          </h2>
          <p className="text-gray-700 mb-6">{t('howToGet.localTransport.description')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('howToGet.localTransport.taxis.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('howToGet.localTransport.taxis.description')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('howToGet.localTransport.shuttles.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('howToGet.localTransport.shuttles.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accommodation */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
            <Hotel className="h-6 w-6" /> {t('howToGet.accommodation.title')}
          </h2>
          <p className="text-gray-700 mb-6">{t('howToGet.accommodation.description')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('howToGet.accommodation.options.option1.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('howToGet.accommodation.options.option1.description')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('howToGet.accommodation.options.option2.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('howToGet.accommodation.options.option2.description')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('howToGet.accommodation.options.option3.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('howToGet.accommodation.options.option3.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToGetPage;