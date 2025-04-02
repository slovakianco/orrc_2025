import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/lib/queryClient';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EmailTestPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    sendgridConfigured?: boolean;
    possibleIssues?: string[];
  } | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    sendgridConfigured: boolean;
    emailServiceReady: boolean;
    message: string;
  } | null>(null);

  // Check email service status on component mount
  React.useEffect(() => {
    const checkEmailStatus = async () => {
      try {
        const response = await apiRequest('GET', '/api/email-status');
        const data = await response.json();
        setEmailStatus(data);
      } catch (error) {
        console.error('Failed to check email status:', error);
      }
    };
    
    checkEmailStatus();
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t('emailTest.emailRequired'),
        description: t('emailTest.pleaseEnterValidEmail'),
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await apiRequest('POST', '/api/test-email', { email, language });
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        toast({
          title: t('emailTest.success'),
          description: t('emailTest.emailSentSuccessfully'),
        });
      } else {
        toast({
          title: t('emailTest.failed'),
          description: data.message || t('emailTest.failedToSendEmail'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setResult({
        success: false,
        message: t('emailTest.errorOccurred'),
      });
      toast({
        title: t('emailTest.error'),
        description: t('emailTest.failedToSendEmail'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={t('emailTest.title')} subtitle={t('emailTest.subtitle')} />
      
      {emailStatus && (
        <Alert className={emailStatus.sendgridConfigured ? "bg-green-50 mb-6" : "bg-amber-50 mb-6"}>
          <div className="flex items-center gap-2">
            {emailStatus.sendgridConfigured ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <AlertTitle>{emailStatus.sendgridConfigured ? t('emailTest.configured') : t('emailTest.notConfigured')}</AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            {emailStatus.message}
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('emailTest.sendTestEmail')}</CardTitle>
          <CardDescription>{t('emailTest.verifyEmailFunctionality')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendTestEmail} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="font-medium">
                {t('emailTest.recipientEmail')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="language" className="font-medium">
                {t('emailTest.language')}
              </label>
              <Select
                value={language}
                onValueChange={setLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('emailTest.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ro">Română</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('emailTest.sending') : t('emailTest.sendTestEmail')}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {result && (
            <div className={`w-full ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.message}
              
              {result.possibleIssues && result.possibleIssues.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">{t('emailTest.possibleIssues')}:</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {result.possibleIssues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}