import { useTranslation } from 'react-i18next';
import { Trophy, Medal, Award, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const { t } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        // Since we can't directly fetch from the external site due to CORS,
        // we'll create a backend endpoint to fetch the content
        const response = await fetch('/api/results-content');
        
        if (!response.ok) {
          throw new Error('Failed to fetch results content');
        }
        
        const data = await response.json();
        setContent(data.content || '');
      } catch (err) {
        console.error('Error fetching results content:', err);
        setError('Failed to load results content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-[#2E7D32] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Trophy className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              {t('results.title', 'Race Results')}
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              {t('results.subtitle', 'Official results from Stana de Vale Trail Race 2025')}
            </p>
          </div>
        </div>
      </div>

      {/* Race Categories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Medal className="h-6 w-6" />
                {t('results.33km.title', 'Trail Run 33K Results')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4" />
                  {t('results.categories.open', 'Open Category')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4" />
                  {t('results.categories.national', 'National Championship')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4" />
                  {t('results.categories.ema', 'EMA Classification')}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Medal className="h-6 w-6" />
                {t('results.11km.title', 'Trail Run 11K Results')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4" />
                  {t('results.categories.open', 'Open Category')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-8 w-8 text-yellow-600" />
              {t('results.official.title', 'Official Race Results')}
            </CardTitle>
            <p className="text-gray-600">
              {t('results.official.subtitle', 'Complete rankings and classifications')}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Loading results...</span>
              </div>
            )}
            
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={() => window.open('https://my-run.ro/stana-de-vale-trail-race-2025-rezultate/', '_blank')}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Results on Official Site
                </Button>
              </div>
            )}
            
            {content && (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </CardContent>
        </Card>

        {/* Fallback Link */}
        <Card className="mt-8 bg-gray-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {t('results.external.title', 'View Full Results')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('results.external.description', 'For the complete results with all details, visit the official results page.')}
            </p>
            <Button 
              onClick={() => window.open('https://my-run.ro/stana-de-vale-trail-race-2025-rezultate/', '_blank')}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('results.external.button', 'Open Full Results Page')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}