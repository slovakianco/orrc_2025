import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertParticipantSchema } from "@shared/schema";
import { Race } from "@/lib/types";
import { getLocalizedRaceName } from "@/lib/utils";
import { useEffect, useState } from "react";
import StripePaymentForm from "./StripePaymentForm";

// Extend schema to add form-specific validations
const registrationFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(6, { message: "Please enter a valid phone number" }),
  country: z.string().min(1, { message: "Please select your country" }),
  birthDate: z.string().min(1, { message: "Please enter your date of birth" }),
  isEmaParticipant: z.boolean().default(false),
  tshirtSize: z.string().optional(),
  raceId: z.number({ invalid_type_error: "Please select a race" }),
  emergencyContactName: z.string().min(2, { message: "Emergency contact name is required" }),
  emergencyContactPhone: z.string().min(6, { message: "Emergency contact phone is required" }),
  medicalInfo: z.string().optional(),
  gender: z.enum(["M", "F"], { errorMap: () => ({ message: "Please select your gender" }) }),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
}).refine((data) => {
  // If EMA participant is selected, t-shirt size is required
  if (data.isEmaParticipant && (!data.tshirtSize || data.tshirtSize === "")) {
    return false;
  }
  return true;
}, {
  message: "T-shirt size is required for EMA participants",
  path: ["tshirtSize"]
});

type RegistrationFormInputs = z.infer<typeof registrationFormSchema>;

// Interface for the registered participant data
interface RegisteredParticipant {
  id: number;
  firstName: string;
  lastName: string;
  raceId: number;
  amount: number;
  raceName: string;
}

const RegistrationFormWithPayment = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [registeredParticipant, setRegisteredParticipant] = useState<RegisteredParticipant | null>(null);

  const { data: races, isLoading: racesLoading } = useQuery<Race[]>({
    queryKey: ['/api/races'],
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegistrationFormInputs>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      country: "",
      birthDate: "",
      isEmaParticipant: false,
      tshirtSize: "",
      raceId: 0,
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalInfo: "",
      gender: "M",
      termsAccepted: false,
    }
  });

  const selectedRaceId = watch("raceId");
  const isEmaParticipant = watch("isEmaParticipant");
  const selectedRace = races?.find(race => race.id === Number(selectedRaceId));
  
  // Set default race if available and not already selected
  useEffect(() => {
    if (races && races.length > 0 && (!selectedRaceId || selectedRaceId === 0)) {
      setValue("raceId", races[0].id);
    }
  }, [races, selectedRaceId, setValue]);

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegistrationFormInputs, "termsAccepted">) => {
      // Transform data to match database column names
      const transformedData = {
        ...data,
        emergencycontactname: data.emergencyContactName,
        emergencycontactphone: data.emergencyContactPhone,
        isemaparticipant: data.isEmaParticipant,
        tshirtsize: data.tshirtSize
      };
      
      // Remove original camelCase properties that have been transformed
      delete (transformedData as any).emergencyContactName;
      delete (transformedData as any).emergencyContactPhone;
      delete (transformedData as any).isEmaParticipant;
      delete (transformedData as any).tshirtSize;
      
      return apiRequest("POST", "/api/participants", transformedData);
    },
    onSuccess: async (response) => {
      // Parse the response to get the participant data
      const participantData = await response.json();
      
      toast({
        title: t('registration.success.title'),
        description: t('registration.success.message'),
      });
      
      // Show a follow-up toast about the confirmation email
      setTimeout(() => {
        toast({
          title: t('registration.email.title', 'Email Confirmation Sent'),
          description: t('registration.email.message', 'Please check your email inbox for registration confirmation details.'),
          variant: "default"
        });
      }, 1000);
      
      // Reset the form to clear inputs
      reset();
      
      // Invalidate the participants query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/participants'] });
      
      // Get the selected race details for payment
      const race = races?.find(r => r.id === Number(selectedRaceId));
      
      if (race && participantData) {
        // Store the participant data for payment processing
        setRegisteredParticipant({
          id: participantData.id,
          firstName: participantData.firstName,
          lastName: participantData.lastName,
          raceId: race.id,
          amount: race.price,
          raceName: getLocalizedRaceName(race, i18n.language as any)
        });
        
        // Scroll to top of page to show payment form
        window.scrollTo(0, 0);
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('registration.error.title'),
        description: error.message || t('registration.error.message'),
      });
    }
  });

  // Function to calculate age from birthDate
  const calculateAge = (birthDate: string): number => {
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    // Remove termsAccepted as it's not part of the API schema
    const { termsAccepted, ...apiData } = data;
    
    // Calculate age from birthDate
    const age = calculateAge(apiData.birthDate);
    
    // Convert raceId from string to number if needed
    // Also add current language for email localization
    const formattedData = {
      ...apiData,
      raceId: typeof apiData.raceId === 'string' ? parseInt(apiData.raceId) : apiData.raceId,
      age, // Add calculated age
      language: i18n.language // Add current language for email localization
    };
    
    console.log("Submitting registration with data:", formattedData);
    await registerMutation.mutate(formattedData);
  };

  // Function to handle payment success
  const handlePaymentSuccess = () => {
    toast({
      title: t('payment.success'),
      description: t('payment.successMessage'),
    });
    
    // Clear the registered participant state
    setRegisteredParticipant(null);
    
    // Redirect to participants page
    setTimeout(() => {
      window.location.href = "/participants";
      window.scrollTo(0, 0);
    }, 1500);
  };
  
  // Function to cancel payment and return to form
  const handlePaymentCancel = () => {
    // Simply clear the registered participant state to hide payment form
    setRegisteredParticipant(null);
    
    toast({
      title: t('payment.cancel'),
      description: t('registration.paymentLater'),
      variant: "default"
    });
  };

  return (
    <section id="registration" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('registration.title')}</h2>
            <p className="text-lg text-neutral-gray">{t('registration.subtitle')}</p>
          </div>
          
          {registeredParticipant ? (
            // Show payment form if registration was successful
            <div className="mb-12">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">{t('registration.paymentStep')}</h3>
                <p className="text-lg">{t('registration.completePayment')}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8 shadow-md">
                <StripePaymentForm
                  amount={registeredParticipant.amount}
                  raceId={registeredParticipant.raceId}
                  participantId={registeredParticipant.id}
                  raceName={registeredParticipant.raceName}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              </div>
            </div>
          ) : (
            // Show registration form if no registration has been submitted yet
            <div className="bg-gray-50 rounded-lg p-8 shadow-md">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.firstName')} *
                    </label>
                    <input 
                      type="text" 
                      id="firstName" 
                      {...register("firstName")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.lastName')} *
                    </label>
                    <input 
                      type="text" 
                      id="lastName" 
                      {...register("lastName")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.email')} *
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      {...register("email")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.phone')} *
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      {...register("phoneNumber")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.country')} *
                    </label>
                    <select 
                      id="country" 
                      {...register("country")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="">{t('registration.form.selectCountry')}</option>
                      <option value="RO">Romania</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="UK">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="PT">Portugal</option>
                      <option value="BE">Belgium</option>
                      <option value="NL">Netherlands</option>
                      <option value="CH">Switzerland</option>
                      <option value="AT">Austria</option>
                      <option value="HU">Hungary</option>
                      <option value="PL">Poland</option>
                      <option value="CZ">Czech Republic</option>
                    </select>
                    {errors.country && (
                      <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.birthDate')} *
                    </label>
                    <input 
                      type="date" 
                      id="birthDate" 
                      {...register("birthDate")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    />
                    {errors.birthDate && (
                      <p className="text-sm text-red-500 mt-1">{errors.birthDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.gender')} *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          value="M" 
                          {...register("gender")} 
                          className="mr-2"
                        />
                        {t('registration.form.male')}
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          value="F" 
                          {...register("gender")} 
                          className="mr-2"
                        />
                        {t('registration.form.female')}
                      </label>
                    </div>
                    {errors.gender && (
                      <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6 p-4 border border-primary/30 rounded-lg bg-primary/5">
                  <div className="flex items-start mb-3">
                    <input 
                      type="checkbox" 
                      id="isEmaParticipant" 
                      {...register("isEmaParticipant")}
                      className="mr-2 mt-1"
                    />
                    <label htmlFor="isEmaParticipant" className="text-sm font-medium">
                      {t('registration.form.emaParticipation')}
                    </label>
                  </div>
                  <div className="text-sm pl-6">
                    <p>{t('registration.form.emaInfo')}</p>
                    <p className="mt-2 text-primary-dark font-medium">{t('registration.form.emaIncludesTshirt')}</p>
                    <div className="mt-2 p-3 bg-white/80 rounded border border-neutral-light/50">
                      <p className="text-gray-600">{t('registration.form.emaEligibilityCriteria')}</p>
                    </div>
                    
                    {isEmaParticipant && (
                      <div className="mt-4">
                        <label htmlFor="tshirtSize" className="block text-sm font-medium text-neutral-gray mb-2">
                          {t('registration.form.tshirtSize')} *
                        </label>
                        <select 
                          id="tshirtSize" 
                          {...register("tshirtSize")}
                          className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                          <option value="">{t('registration.form.selectTshirtSize')}</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                        {errors.tshirtSize && (
                          <p className="text-sm text-red-500 mt-1">{errors.tshirtSize.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-gray mb-2">
                    {t('registration.form.selectRace')} *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {racesLoading ? (
                      <div className="col-span-3">
                        <p>{t('common.loading')}</p>
                      </div>
                    ) : races?.map(race => (
                      <div 
                        key={race.id}
                        className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                          Number(selectedRaceId) === race.id ? 'border-primary bg-primary/5' : 'border-neutral-light hover:border-primary hover:bg-primary/5'
                        }`}
                        onClick={() => setValue("raceId", race.id)}
                      >
                        <label htmlFor={`race${race.id}`} className="flex items-start cursor-pointer">
                          <input 
                            type="radio" 
                            id={`race${race.id}`} 
                            value={race.id} 
                            checked={Number(selectedRaceId) === race.id}
                            onChange={() => setValue("raceId", race.id)}
                            className="hidden"
                          />
                          <span className={`w-5 h-5 border-2 rounded-full flex-shrink-0 mr-2 mt-1 ${
                            Number(selectedRaceId) === race.id ? 'border-primary bg-primary' : 'border-neutral-light'
                          }`}></span>
                          <div>
                            <span className="block font-bold">{getLocalizedRaceName(race, i18n.language as any)}</span>
                            <span className="text-sm text-neutral-gray">{race.distance}km | €{race.price}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.raceId && (
                    <p className="text-sm text-red-500 mt-1">{errors.raceId.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="emergencyContactName" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.emergencyContactName')} *
                    </label>
                    <input 
                      type="text" 
                      id="emergencyContactName" 
                      {...register("emergencyContactName")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.emergencyContactName && (
                      <p className="text-sm text-red-500 mt-1">{errors.emergencyContactName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('registration.form.emergencyContactPhone')} *
                    </label>
                    <input 
                      type="tel" 
                      id="emergencyContactPhone" 
                      {...register("emergencyContactPhone")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.emergencyContactPhone && (
                      <p className="text-sm text-red-500 mt-1">{errors.emergencyContactPhone.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="medical" className="block text-sm font-medium text-neutral-gray mb-2">
                    {t('registration.form.medical')}
                  </label>
                  <textarea 
                    id="medical" 
                    rows={3} 
                    {...register("medicalInfo")}
                    className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder={t('registration.form.medicalPlaceholder')}
                  ></textarea>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      {...register("termsAccepted")}
                      className="mr-2 mt-1"
                    />
                    <label htmlFor="terms" className="text-sm">
                      {t('registration.form.termsText')} <a href="#" className="text-primary hover:underline">{t('registration.form.termsLink')}</a> {t('registration.form.andText')} <a href="#" className="text-primary hover:underline">{t('registration.form.privacyLink')}</a>. {t('registration.form.riskText')}
                    </label>
                  </div>
                  {errors.termsAccepted && (
                    <p className="text-sm text-red-500 mt-1">{errors.termsAccepted.message}</p>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? t('common.submitting') : t('registration.form.submitButton')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RegistrationFormWithPayment;