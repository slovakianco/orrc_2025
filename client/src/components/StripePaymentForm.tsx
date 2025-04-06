import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import type { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  raceName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// CheckoutForm component to be rendered inside Elements
const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  clientSecret, 
  amount, 
  raceName, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    // With 'redirect: always', this will redirect and the code below won't execute
    // unless there's an immediate error
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/registration-success',
      },
      redirect: 'always',
    });

    // This code will only run if there's an immediate error or
    // if the redirect fails for some reason
    if (result.error) {
      console.error('Payment error:', result.error);
      setPaymentError(result.error.message || t('payment.genericError'));
      toast({
        title: t('payment.failed'),
        description: result.error.message || t('payment.genericError'),
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
    // Note: With redirect='always', we shouldn't reach the success case here
    // as successful payments will redirect to the return_url
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-stone-100 p-4 rounded-md mb-6">
        <h3 className="text-lg font-semibold text-primary mb-2">{t('payment.summary')}</h3>
        <div className="flex justify-between">
          <span>{raceName}</span>
          <span className="font-semibold">{amount.toFixed(2)} €</span>
        </div>
      </div>

      <PaymentElement />

      {paymentError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {paymentError}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          {t('general.cancel')}
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="bg-primary text-white"
        >
          {isProcessing ? (
            <>
              <span className="mr-2">{t('payment.processing')}</span>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            </>
          ) : (
            t('payment.pay')
          )}
        </Button>
      </div>
    </form>
  );
};

interface StripePaymentFormProps {
  amount: number;
  raceId?: number;
  participantId?: number;
  raceName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  raceId,
  participantId,
  raceName,
  onSuccess,
  onCancel
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    // Create a PaymentIntent as soon as the component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-payment-intent', {
          amount,
          raceId,
          participantId
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.message || t('payment.intentError'));
          toast({
            title: t('payment.error'),
            description: data.message || t('payment.intentError'),
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(t('payment.connectionError'));
        toast({
          title: t('payment.error'),
          description: t('payment.connectionError'),
          variant: 'destructive',
        });
      }
    };

    createPaymentIntent();
  }, [amount, raceId, participantId, t, toast]);

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-red-700 mb-2">{t('payment.error')}</h3>
        <p className="text-red-600">{error}</p>
        <Button onClick={onCancel} className="mt-4">
          {t('general.goBack')}
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2A6D50', // Alpine Green (primary color)
        colorBackground: '#ffffff',
        colorText: '#3E4A59', // Slate Gray
        colorDanger: '#df1b41',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">{t('payment.title')}</h2>
      
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm 
          clientSecret={clientSecret} 
          amount={amount} 
          raceName={raceName}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </div>
  );
};

export default StripePaymentForm;