import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const RegistrationSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Parse URL search params manually since wouter doesn't have useSearchParams
  const searchParams = new URLSearchParams(window.location.search);
  
  // Extract payment_intent and payment_intent_client_secret from URL
  const paymentIntentId = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
  
  useEffect(() => {
    // Log params for debugging
    console.log("Payment Intent ID:", paymentIntentId);
    
    const confirmPayment = async () => {
      if (!paymentIntentId || !paymentIntentClientSecret) {
        console.warn("Missing payment intent information");
        return;
      }
      
      try {
        // Call to manually confirm the payment by participant ID
        // This is a backup in case the webhook didn't work
        const response = await apiRequest('POST', '/api/confirm-payment-by-intent', {
          paymentIntentId
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("Payment confirmed:", result);
          
          if (result.success) {
            toast({
              title: t('payment.success'),
              description: t('payment.successMessage'),
            });
          }
        } else {
          console.error("Failed to confirm payment");
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    };
    
    if (paymentIntentId && paymentIntentClientSecret) {
      confirmPayment();
    }
  }, [paymentIntentId, paymentIntentClientSecret, toast, t]);
  
  return (
    <div className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <Card className="p-8 shadow-lg">
          <div className="mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">
            {t('registration.successTitle')}
          </h1>
          <p className="text-lg mb-8">
            {t('registration.successMessage')}
          </p>
          
          <div className="space-y-4">
            <p>
              {t('registration.checkEmail')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                onClick={() => setLocation('/participants')}
                className="bg-primary hover:bg-primary/90"
              >
                {t('registration.viewParticipants')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/')}
              >
                {t('general.backToHome')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;