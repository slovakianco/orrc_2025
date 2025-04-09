import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Race } from '@/types/race';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('race-images');

  const { data: races, isLoading: isLoadingRaces } = useQuery<Race[]>({
    queryKey: ['/api/races'],
    retry: 3
  });

  const updateRaceImageMutation = useMutation({
    mutationFn: async ({ raceid, imageUrl }: { raceid: number, imageUrl: string }) => {
      const response = await apiRequest(
        'PATCH',
        `/api/races/${raceid}`,
        { imageUrl }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/races'] });
      toast({
        title: t('admin.imageUpdateSuccess'),
        description: t('admin.imageUpdatedDescription'),
        variant: 'default',
      });
      setNewImageUrl('');
    },
    onError: (error) => {
      console.error('Error updating race image:', error);
      toast({
        title: t('admin.imageUpdateFailed'),
        description: error.toString(),
        variant: 'destructive',
      });
    }
  });

  // When races are loaded, select the first one by default
  useEffect(() => {
    if (races && races.length > 0 && !selectedRace) {
      setSelectedRace(races[0]);
    }
  }, [races, selectedRace]);

  const handleRaceSelect = (race: Race) => {
    setSelectedRace(race);
    setNewImageUrl('');
  };

  const handleImageUpdate = () => {
    if (!selectedRace || !newImageUrl.trim()) return;
    
    updateRaceImageMutation.mutate({
      raceid: selectedRace.id,
      imageUrl: newImageUrl.trim()
    });
  };

  if (isLoadingRaces) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">{t('admin.title')}</h1>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-10 h-10 border-t-2 border-b-2 border-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  const availableImages = [
    { name: '33km Trail Image', url: '/33km.jpg' },
    { name: '11km Trail Image', url: '/11km.jpg' },
    { name: 'Stana de Vale', url: '/stana-de-vale.jpg' }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t('admin.title')}</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="race-images">{t('admin.raceImages')}</TabsTrigger>
          <TabsTrigger value="participants">{t('admin.participants')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="race-images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.raceImages')}</CardTitle>
              <CardDescription>
                {t('admin.imageUpdatedDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium mb-2">{t('races.title')}</h3>
                  <div className="space-y-2">
                    {races && races.map((race: Race) => (
                      <Button 
                        key={race.id}
                        variant={selectedRace?.id === race.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleRaceSelect(race)}
                      >
                        {race.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  {selectedRace && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{selectedRace.name}</h3>
                      
                      <div>
                        <h4 className="text-md font-medium mb-2">{t('admin.currentImage')}</h4>
                        {selectedRace.imageUrl ? (
                          <div className="relative h-48 md:h-64 rounded-md overflow-hidden">
                            <img 
                              src={selectedRace.imageUrl} 
                              alt={selectedRace.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-48 md:h-64 bg-muted flex items-center justify-center rounded-md">
                            <span className="text-muted-foreground">{t('common.notAvailable')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium mb-2">{t('admin.enterNewImageUrl')}</h4>
                        <div className="flex space-x-2">
                          <Input
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-grow"
                          />
                          <Button 
                            onClick={handleImageUpdate}
                            disabled={updateRaceImageMutation.isPending || !newImageUrl.trim()}
                          >
                            {updateRaceImageMutation.isPending 
                              ? t('common.updating') 
                              : t('admin.updateImage')
                            }
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium mb-2">{t('admin.availableImages')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {availableImages.map((image, index) => (
                            <div 
                              key={index}
                              className="border rounded-md overflow-hidden cursor-pointer hover:border-primary"
                              onClick={() => setNewImageUrl(image.url)}
                            >
                              <div className="h-24 bg-muted">
                                <img 
                                  src={image.url}
                                  alt={image.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-2 text-sm text-center truncate">
                                {image.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.participantsManagement')}</CardTitle>
              <CardDescription>
                {t('admin.participantsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTitle>{t('common.notAvailable')}</AlertTitle>
                <AlertDescription>{t('admin.comingSoon')}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;