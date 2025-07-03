import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Trophy, Medal, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Declare global RRPublish for TypeScript
declare global {
  interface Window {
    RRPublish: any;
  }
}

export default function ResultsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    // Load external CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://my.raceresult.com/RRPublish/style.css?v=v1.0.549';
    document.head.appendChild(link);

    // Add custom styling to match page design
    const customStyle = document.createElement('style');
    customStyle.textContent = `
      .RRPublish {
        font-family: inherit !important;
      }
      .RRPublish .TileHead {
        background: linear-gradient(135deg, #2E7D32, #1B5E20) !important;
        color: white !important;
        border-radius: 8px 8px 0 0 !important;
        font-weight: 600 !important;
      }
      .RRPublish .TilesList {
        border-radius: 0 0 8px 8px !important;
        border: 1px solid #e0e0e0 !important;
      }
      .RRPublish .Tile {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        border-radius: 8px !important;
        margin-bottom: 16px !important;
        border: none !important;
      }
      .RRPublish .TilesList tr:nth-child(odd) {
        background-color: #f8f9fa !important;
      }
      .RRPublish .TilesList tr:hover {
        background-color: #e8f5e8 !important;
      }
    `;
    document.head.appendChild(customStyle);

    // Load external scripts
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    // Load scripts in sequence
    Promise.all([
      loadScript('//my.raceresult.com/RRPublish/load.js.php?lang=en'),
      loadScript('https://my.raceresult.com/RRPublish/lang.js?lang=en&v=v1.0.549'),
      loadScript('https://my.raceresult.com/RRPublish/RRPublish.js?v=v1.0.549')
    ]).then(() => {
      // Initialize the widget after scripts are loaded
      setTimeout(() => {
        if ((window as any).RRPublish) {
          const element = document.getElementById('divRRPublish_results');
          if (element) {
            new (window as any).RRPublish(element, 349747, 'results');
          }
        }
      }, 500);
    }).catch(error => {
      console.error('Error loading race results scripts:', error);
    });

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="raceresult.com"]');
      scripts.forEach(script => script.remove());
      const links = document.querySelectorAll('link[href*="raceresult.com"]');
      links.forEach(link => link.remove());
    };
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

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardTitle className="flex items-center text-2xl">
                <Medal className="mr-3 h-8 w-8" />
                {t('results.33km.title', 'Trail Run 33K Results')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t('results.categories.open', 'Open Category')}</span>
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t('results.categories.national', 'National Championship')}</span>
                  <Award className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t('results.categories.ema', 'EMA Classification')}</span>
                  <Award className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
              <CardTitle className="flex items-center text-2xl">
                <Medal className="mr-3 h-8 w-8" />
                {t('results.11km.title', 'Trail Run 11K Results')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t('results.categories.open', 'Open Category')}</span>
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t('results.categories.national', 'National Championship')}</span>
                  <Award className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t('results.categories.ema', 'EMA Classification')}</span>
                  <Award className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Embedded Results */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white">
            <CardTitle className="text-2xl md:text-3xl text-center">
              {t('results.official.title', 'Official Race Results')}
            </CardTitle>
            <p className="text-center text-green-100 mt-2">
              {t('results.official.subtitle', 'Complete rankings and classifications')}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Race Results Widget */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div 
                id="divRRPublish_results" 
                className="RRPublish min-h-[400px]" 
                style={{ marginLeft: '0px', marginRight: '0px' }}
              >
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-[#2E7D32] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading race results...</p>
                </div>
              </div>
            </div>
            
            {/* Custom styling for race results will be injected via CSS */}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <ExternalLink className="h-8 w-8 text-yellow-600 mr-3" />
                <h3 className="text-2xl font-bold text-yellow-800">
                  {t('results.external.title', 'View Full Results')}
                </h3>
              </div>
              <p className="text-yellow-700 mb-6 text-lg">
                {t('results.external.description', 'For the complete results with all details, visit the official results page.')}
              </p>
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-md"
                onClick={() => window.open('https://my-run.ro/stana-de-vale-trail-race-2025-rezultate/', '_blank')}
              >
                {t('results.external.button', 'Open Full Results Page')}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}