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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    senderVerificationNote?: string;
    setupInstructions?: string[];
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
        <>
          <Alert className={emailStatus.sendgridConfigured ? "bg-green-50 mb-4" : "bg-amber-50 mb-4"}>
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
          
          {emailStatus.senderVerificationNote && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <AlertTitle className="ml-2 text-blue-800 font-medium">Sender Verification Required</AlertTitle>
              <AlertDescription className="mt-2 text-blue-700">
                {emailStatus.senderVerificationNote}
              </AlertDescription>
            </Alert>
          )}
          
          {emailStatus.setupInstructions && emailStatus.setupInstructions.length > 0 && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="ml-2 text-green-800 font-medium">Setup Instructions</AlertTitle>
              <AlertDescription className="mt-2 text-green-700">
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {emailStatus.setupInstructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
      
      <div className="mb-8">
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          <AccordionItem value="sendgrid-setup">
            <AccordionTrigger className="text-lg font-medium text-gray-800">
              SendGrid Setup Guide
            </AccordionTrigger>
            <AccordionContent className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1. API Key Setup</h3>
                  <p className="text-gray-700">
                    To use SendGrid for sending emails, you need a valid API key:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>Log in to your SendGrid account at <a href="https://app.sendgrid.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">app.sendgrid.com</a></li>
                    <li>Navigate to Settings → API Keys and create a new API key with "Mail Send" permissions</li>
                    <li>Copy the API key (starts with "SG.") and add it to your environment variables as SENDGRID_API_KEY</li>
                    <li>Make sure the API key is not prefixed with "Bearer " - our system will handle authentication properly</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2. Sender Verification</h3>
                  <p className="text-gray-700">
                    SendGrid requires you to verify the "From" email address:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>Go to Settings → Sender Authentication in your SendGrid dashboard</li>
                    <li>Either verify a single sender email (easier option) or verify an entire domain</li>
                    <li>For domain verification, you'll need to add DNS records to your domain's DNS settings</li>
                    <li>Our application uses <code className="bg-gray-200 px-1 py-0.5 rounded">registration@stanatrailrace.ro</code> as the sender email</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">3. Implementation Details</h3>
                  <p className="text-gray-700">
                    This application uses SendGrid's official Node.js library:
                  </p>
                  <div className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                    <pre className="text-xs text-gray-800">
{`// Using SendGrid's v3 Node.js Library
import { MailService } from "@sendgrid/mail";

const sgMail = new MailService();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "recipient@example.com",
  from: "sender@yourdomain.com", // Verified sender
  subject: "Sending with SendGrid",
  text: "Email content in plain text",
  html: "<strong>Email content in HTML</strong>",
};

// Send the email
await sgMail.send(msg);`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">4. Troubleshooting</h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>If you get authentication errors, ensure your API key is correct and hasn't expired</li>
                    <li>If you get sender verification errors, make sure the sender email is verified in SendGrid</li>
                    <li>Check the server logs for detailed error messages from SendGrid</li>
                    <li>Use this test page to verify your email configuration is working</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

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
        <CardFooter className="flex flex-col">
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