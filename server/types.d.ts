import Stripe from 'stripe';

declare global {
  var stripe: Stripe | null;
  
  namespace NodeJS {
    interface Global {
      stripe: Stripe | null;
    }
  }
}