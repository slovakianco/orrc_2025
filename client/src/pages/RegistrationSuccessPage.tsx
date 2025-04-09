import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, CreditCard } from 'lucide-react';
import StripePaymentForm from '@/components/StripePaymentForm';

interface ParticipantData {
  id: number;
  firstname: string;
  lastname: string;
  raceid: number;
  raceName: string;
  isEmaParticipant: boolean;
}

const RegistrationSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State to hold participant data for payment
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [amount, setAmount] = useState(0);
  
  // Parse URL search params manually since wouter doesn't have useSearchParams
  const searchParams = new URLSearchParams(window.location.search);
  
  // Extract payment_intent and payment_intent_client_secret from URL (from Stripe redirect)
  const paymentIntentId = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
  
  // Extract participantId and raceid from URL (from email link)
  const participantId = searchParams.get('participantId');
  const raceid = searchParams.get('raceid');
  
  // Check if we've been redirected after payment completion
  const paymentSuccess = searchParams.get('payment_success') === 'true';
  
  // Calculate price based on race and EMA status
  const calculatePrice = (raceid: number, isEma: boolean): number => {
    if (raceid === 1) { // 33km race
      return isEma ? 200 : 170;
    } else { // 11km race
      return isEma ? 150 : 120;
    }
  };
  
  // Function to handle payment success
  const handlePaymentSuccess = () => {
    toast({
      title: t('payment.success'),
      description: t('payment.successMessage'),
    });
    
    // Redirect to participants page
    setTimeout(() => {
      setLocation('/participants');
    }, 1500);
  };
  
  // Function to cancel payment and return to home
  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    
    toast({
      title: t('payment.cancel'),
      description: t('registration.paymentLater'),
      variant: "default"
    });
  };
  
  // Load participant data if we have the IDs
  useEffect(() => {
    const loadParticipantData = async () => {
      if (!participantId || !raceid) return;
      
      setLoading(true);
      try {
        // Get participant data
        const participantResponse = await apiRequest('GET', `/api/participants/${participantId}`);
        if (!participantResponse.ok) {
          throw new Error('Failed to fetch participant data');
        }
        
        const participantData = await participantResponse.json();
        
        // Get race data
        const raceResponse = await apiRequest('GET', `/api/races/${raceid}`);
        if (!raceResponse.ok) {
          throw new Error('Failed to fetch race data');
        }
        
        const raceData = await raceResponse.json();
        
        // Calculate the correct price
        const calculatedAmount = calculatePrice(
          parseInt(raceid), 
          participantData.isemaparticipant || participantData.isEmaParticipant
        );
        
        setAmount(calculatedAmount);
        
        // Store participant data for payment form
        setParticipant({
          id: parseInt(participantId),
          firstname: participantData.firstname || participantData.firstname,
          lastname: participantData.lastname || participantData.lastname,
          raceid: parseInt(raceid),
          raceName: raceData.name,
          isEmaParticipant: participantData.isemaparticipant || participantData.isEmaParticipant
        });
        
        setShowPaymentForm(true);
      } catch (error) {
        console.error('Error loading participant data:', error);
        toast({
          variant: "destructive",
          title: t('error.title'),
          description: t('error.participantNotFound')
        });
      } finally {
        setLoading(false);
      }
    };
    
    // If we have participantId and raceid from the URL, load the participant data
    if (participantId && raceid) {
      loadParticipantData();
    }
  }, [participantId, raceid, toast, t, setLocation]);
  
  // Handle payment confirmation from any payment method
  useEffect(() => {
    // Log params for debugging
    console.log("Payment Intent ID:", paymentIntentId);
    console.log("Participant ID from URL:", participantId);
    console.log("Race ID from URL:", raceid);
    console.log("Payment success flag:", paymentSuccess);
    
    // Function to confirm payment using payment intent
    const confirmPaymentByIntent = async () => {
      if (!paymentIntentId || !paymentIntentClientSecret) {
        console.warn("Missing payment intent information");
        return false;
      }
      
      try {
        // Call to manually confirm the payment by payment intent ID
        // This is a backup in case the webhook didn't work
        const response = await apiRequest('POST', '/api/confirm-payment-by-intent', {
          paymentIntentId
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("Payment confirmed by intent:", result);
          
          if (result.success) {
            toast({
              title: t('payment.success'),
              description: t('payment.successMessage'),
            });
            
            return true;
          }
        } else {
          console.error("Failed to confirm payment by intent");
        }
      } catch (error) {
        console.error("Error confirming payment by intent:", error);
      }
      
      return false;
    };
    
    // Function to confirm payment using participant ID directly
    const confirmPaymentByParticipant = async () => {
      if (!participantId) {
        console.warn("Missing participant ID");
        return false;
      }
      
      try {
        // Call to manually confirm the payment by participant ID
        const response = await apiRequest('POST', '/api/confirm-payment', {
          participantId
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("Payment confirmed via participant ID:", result);
          
          toast({
            title: t('payment.success'),
            description: t('payment.successMessage'),
          });
          
          return true;
        } else {
          console.error("Failed to confirm payment via participant ID");
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
      
      return false;
    };
    
    // Main function to handle payment confirmation from any source
    const handlePaymentConfirmation = async () => {
      let success = false;
      
      // First, try to confirm via payment intent if we have one
      if (paymentIntentId && paymentIntentClientSecret) {
        success = await confirmPaymentByIntent();
      }
      
      // If that didn't work or we don't have a payment intent but we have the payment_success flag,
      // try to confirm via participant ID
      if (!success && paymentSuccess && participantId) {
        success = await confirmPaymentByParticipant();
      }
      
      // If either method succeeded, redirect to participants page
      if (success) {
        setTimeout(() => {
          setLocation('/participants');
        }, 2000);
      }
    };
    
    // Execute payment confirmation if we have either a payment intent or payment success flag
    if ((paymentIntentId && paymentIntentClientSecret) || (paymentSuccess && participantId)) {
      handlePaymentConfirmation();
    }
  }, [paymentIntentId, paymentIntentClientSecret, paymentSuccess, participantId, toast, t, setLocation]);

  return (
    <div className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <Card className="p-8 shadow-lg">
          {/* Payment success view (from direct redirect) */}
          {paymentSuccess && participantId && (
            <>
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
            </>
          )}
          
          {/* From payment intent */}
          {!paymentSuccess && paymentIntentId && (
            <>
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
            </>
          )}
          
          {/* From email link with participantId and raceid */}
          {!paymentSuccess && !paymentIntentId && participantId && raceid && (
            <>
              {loading ? (
                <div className="py-8">
                  <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4">{t('common.loading')}</p>
                </div>
              ) : showPaymentForm && participant ? (
                <>
                  <div className="mb-6">
                    <CreditCard className="w-16 h-16 text-primary mx-auto" />
                  </div>
                  <h1 className="text-3xl font-bold text-primary mb-4">
                    {t('registration.completePayment')}
                  </h1>
                  <p className="text-lg mb-6">
                    {t('registration.completePaymentInfo')}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-medium mb-2">{t('registration.yourRegistration')}</h3>
                    <div className="text-left">
                      <p className="mb-1"><strong>{t('registration.form.name')}:</strong> {participant.firstname} {participant.lastname}</p>
                      <p className="mb-1"><strong>{t('registration.form.race')}:</strong> {participant.raceName}</p>
                      <p className="mb-4"><strong>{t('registration.form.amount')}:</strong> {amount} RON</p>
                    </div>
                    
                    <StripePaymentForm 
                      amount={amount}
                      raceid={participant.raceid}
                      participantId={participant.id}
                      raceName={participant.raceName}
                      isEmaParticipant={participant.isEmaParticipant}
                      onSuccess={handlePaymentSuccess}
                      onCancel={handlePaymentCancel}
                    />
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/')}
                    className="mt-4"
                  >
                    {t('general.backToHome')}
                  </Button>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-primary mb-4">
                    {t('error.title')}
                  </h1>
                  <p className="text-lg mb-8">
                    {t('error.participantNotFound')}
                  </p>
                  
                  <Button 
                    onClick={() => setLocation('/')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {t('general.backToHome')}
                  </Button>
                </>
              )}
            </>
          )}
          
          {/* Default view when no parameters are provided */}
          {!paymentSuccess && !paymentIntentId && !participantId && !raceid && (
            <>
              <h1 className="text-3xl font-bold text-primary mb-4">
                {t('registration.title')}
              </h1>
              <p className="text-lg mb-8">
                {t('registration.startNewRegistration')}
              </p>
              
              <Button 
                onClick={() => setLocation('/registration')}
                className="bg-primary hover:bg-primary/90"
              >
                {t('navigation.register')}
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;