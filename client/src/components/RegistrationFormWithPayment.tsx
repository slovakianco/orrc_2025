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
import { useEffect, useMemo, useState } from "react";

// Function to calculate age for validation
const calculateAgeForValidation = (birthDate: string): number => {
  const birthDateObj = new Date(birthDate);
  // Race date is set to July 5, 2025
  const eventDate = new Date(2025, 6, 5); // Month is 0-indexed (6 = July)
  let age = eventDate.getFullYear() - birthDateObj.getFullYear();
  const m = eventDate.getMonth() - birthDateObj.getMonth();
  if (m < 0 || (m === 0 && eventDate.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
};

// Extend schema to add form-specific validations
const registrationFormSchema = z.object({
  firstname: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastname: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(6, { message: "Please enter a valid phone number" }),
  country: z.string().min(1, { message: "Please select your country" }),
  birthDate: z.string().min(1, { message: "Please enter your date of birth" }),
  isemaparticipant: z.boolean().default(false),
  tshirtsize: z.string().optional(),
  raceid: z.number({ invalid_type_error: "Please select a race" }),
  emergencyContactName: z.string().min(2, { message: "Emergency contact name is required" }),
  emergencyContactPhone: z.string().min(6, { message: "Emergency contact phone is required" }),
  medicalInfo: z.string().optional(),
  gender: z.enum(["M", "F"], { errorMap: () => ({ message: "Please select your gender" }) }),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
}).refine((data) => {
  // If EMA participant is selected, t-shirt size is required
  if (data.isemaparticipant && (!data.tshirtsize || data.tshirtsize === "")) {
    return false;
  }
  return true;
}, {
  message: "T-shirt size is required for EMA participants",
  path: ["tshirtsize"]
}).refine((data) => {
  // Calculate age based on race date
  const age = calculateAgeForValidation(data.birthDate);
  
  // EMA participants must be at least 35 years old
  if (data.isemaparticipant && age < 35) {
    return false;
  }
  return true;
}, {
  message: "You must be at least 35 years old to register as an EMA participant",
  path: ["isemaparticipant"]
}).refine((data) => {
  // Calculate age based on race date
  const age = calculateAgeForValidation(data.birthDate);
  
  // For 11km race (id=2), participants must be at least 16 years old
  if (data.raceid === 2 && age < 16) {
    return false;
  }
  return true;
}, {
  message: "You must be at least 16 years old to participate in the 11km race",
  path: ["birthDate"]
}).refine((data) => {
  // Calculate age based on race date
  const age = calculateAgeForValidation(data.birthDate);
  
  // For 33km race (id=1), participants must be at least 18 years old
  if (data.raceid === 1 && age < 18) {
    return false;
  }
  return true;
}, {
  message: "You must be at least 18 years old to participate in the 33km race",
  path: ["birthDate"]
});

type RegistrationFormInputs = z.infer<typeof registrationFormSchema>;

const RegistrationFormWithPayment = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: races, isLoading: racesLoading } = useQuery<Race[]>({
    queryKey: ['/api/races'],
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegistrationFormInputs>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      country: "",
      birthDate: "1989-01-01",
      isemaparticipant: false,
      tshirtsize: "",
      raceid: 0,
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalInfo: "",
      gender: "M",
      termsAccepted: false,
    }
  });

  const selectedRaceId = watch("raceid");
  const isemaparticipant = watch("isemaparticipant");
  const birthDateValue = watch("birthDate");
  
  // Calculate if the participant is eligible for EMA based on age
  const isEligibleForEma = useMemo(() => {
    if (!birthDateValue) return false;
    
    const age = calculateAgeForValidation(birthDateValue);
    return age >= 35;
  }, [birthDateValue]);
  
  // Auto-uncheck the EMA checkbox when age becomes invalid
  useEffect(() => {
    if (!isEligibleForEma && isemaparticipant) {
      setValue('isemaparticipant', false);
    }
  }, [isEligibleForEma, isemaparticipant, setValue]);
  
  const selectedRace = races?.find(race => race.id === Number(selectedRaceId));
  
  // Calculate the dynamic price based on race and EMA participation
  const calculatePrice = (race: Race | undefined, isema: boolean): number => {
    if (!race) return 0;
    
    // Race ID 1 is typically the 33km race, Race ID 2 is the 11km race
    if (race.id === 1) { // 33km race
      // Prices in lei - 200 lei for EMA (€40), 170 lei for non-EMA (€34)
      return isema ? 200 : 170; // Return the RON value for payment processing
    } else { // 11km race or others
      // Prices in lei - 150 lei for EMA (€30), 120 lei for non-EMA (€24)
      return isema ? 150 : 120; // Return the RON value for payment processing
    }
  };
  
  // Get the dynamic price for display and payment
  const dynamicPrice = calculatePrice(selectedRace, isemaparticipant);
  
  // Set default race if available and not already selected
  useEffect(() => {
    if (races && races.length > 0 && (!selectedRaceId || selectedRaceId === 0)) {
      setValue("raceid", races[0].id);
    }
  }, [races, selectedRaceId, setValue]);

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegistrationFormInputs, "termsAccepted">) => {
      // Transform data to match database column names
      // Make sure isemaparticipant is correctly transformed to a boolean
      const transformedData = {
        ...data,
        // Include BOTH camelCase AND lowercase versions for fields to ensure compatibility
        emergencyContactName: data.emergencyContactName || "",
        emergencycontactname: data.emergencyContactName || "",
        emergencyContactPhone: data.emergencyContactPhone || "", 
        emergencycontactphone: data.emergencyContactPhone || "",
        // For isemaparticipant, include only lowercase version for backend compatibility
        isemaparticipant: data.isemaparticipant === true, // Ensure it's a boolean
        // For t-shirt size, include only lowercase version for backend compatibility
        tshirtsize: data.tshirtsize || ""
      };
      
      console.log("Transformed data for API:", transformedData);
      
      return apiRequest("POST", "/api/participants", transformedData);
    },
    onSuccess: async (response) => {
      // Parse the response to get the participant data
      const participant = await response.json();
      
      console.log("Registration successful, participant:", participant);
      
      // Create a payment intent to obtain a payment link
      if (participant && participant.id) {
        try {
          // Get the necessary data from the participant - normalizing field names
          // The server may return either camelCase or lowercase field names
          const participantId = participant.id;
          const raceid = participant.raceid || participant.raceid;
          const isemaparticipant = participant.isemaparticipant || participant.isemaparticipant || false;
          
          // Calculate the price for the payment
          const race = races?.find(r => r.id === Number(raceid));
          const calculatedPrice = calculatePrice(race, isemaparticipant);
          
          console.log("Creating payment link for participant:", participantId, "race:", raceid, "isema:", isemaparticipant, "price:", calculatedPrice);
          
          // Make API request to create payment link
          const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
            amount: calculatedPrice,
            participantId: participantId,
            raceid: raceid,
            isemaparticipant: isemaparticipant
          });
          
          const paymentData = await paymentResponse.json();
          console.log("Payment link created:", paymentData);
          
          // Check if we got a payment link back
          if (paymentData.paymentLink) {
            // Show a success toast before redirecting
            toast({
              title: t('registration.success.title'),
              description: t('registration.success.redirectingToPayment', 'Registration successful! Redirecting to payment...'),
              duration: 3000
            });
            
            // Show a toast about the email backup option
            toast({
              title: t('registration.email.title', 'Email Confirmation Sent'),
              description: t('registration.email.paymentLink', 'We have also sent you an email with your registration details and payment link.'),
              variant: "default",
              duration: 3000
            });
            
            // Redirect to payment link automatically after a short delay
            setTimeout(() => {
              window.location.href = paymentData.paymentLink;
            }, 1500);
          } else {
            // Fallback to standard success message if no payment link
            toast({
              title: t('registration.success.title'),
              description: t('registration.success.message'),
            });
            
            // Show a detailed toast about the payment link in the confirmation email
            setTimeout(() => {
              toast({
                title: t('registration.email.title', 'Email Confirmation Sent'),
                description: t('registration.email.paymentLink', 'Please check your email inbox for registration confirmation and a link to make your payment.'),
                variant: "default",
                duration: 6000
              });
            }, 1000);
          }
        } catch (error) {
          console.error("Error creating payment link:", error);
          // Still show success toast for registration
          toast({
            title: t('registration.success.title'),
            description: t('registration.success.message'),
          });
          
          // Show fallback toast about email
          setTimeout(() => {
            toast({
              title: t('registration.email.title', 'Email Confirmation Sent'),
              description: t('registration.email.paymentLink', 'Please check your email inbox for registration confirmation and payment instructions.'),
              variant: "default",
              duration: 6000
            });
          }, 1000);
        }
      } else {
        // Fallback general success message
        toast({
          title: t('registration.success.title'),
          description: t('registration.success.message'),
        });
      }
      
      // Reset the form to clear inputs
      reset();
      
      // Invalidate the participants query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/participants'] });
      
      // Don't automatically redirect - either the user clicks the payment link 
      // or they will check their email for the payment link
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('registration.error.title'),
        description: error.message || t('registration.error.message'),
      });
    }
  });

  // Function to calculate age from birthDate based on event date (July 5, 2025)
  const calculateAge = (birthDate: string): number => {
    const birthDateObj = new Date(birthDate);
    // Race date is set to July 5, 2025
    const eventDate = new Date(2025, 6, 5); // Month is 0-indexed (6 = July)
    let age = eventDate.getFullYear() - birthDateObj.getFullYear();
    const m = eventDate.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && eventDate.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    // Remove termsAccepted as it's not part of the API schema
    const { termsAccepted, ...apiData } = data;
    
    // Calculate age from birthDate
    const age = calculateAge(apiData.birthDate);
    
    // Convert raceid from string to number if needed
    // Also add current language for email localization
    const formattedData = {
      ...apiData,
      raceid: typeof apiData.raceid === 'string' ? parseInt(apiData.raceid) : apiData.raceid,
      age, // Add calculated age
      language: i18n.language, // Add current language for email localization
      isemaparticipant: apiData.isemaparticipant === true, // Ensure it's a boolean
      // Add both camelCase and lowercase versions for emergency contact fields
      emergencyContactName: apiData.emergencyContactName || "",
      emergencycontactname: apiData.emergencyContactName || "",
      emergencyContactPhone: apiData.emergencyContactPhone || "",
      emergencycontactphone: apiData.emergencyContactPhone || ""
    };
    
    // Log EMA participant flag to debug
    console.log("Submitting registration with data:", formattedData);
    console.log("Is EMA participant:", formattedData.isemaparticipant, "Type:", typeof formattedData.isemaparticipant);
    await registerMutation.mutate(formattedData);
  };

  return (
    <section id="registration" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('registration.title')}</h2>
            <p className="text-lg text-neutral-gray">{t('registration.subtitle')}</p>
          </div>
          
          {/* Show registration form - payment handled via email link */}
          <div className="bg-gray-50 rounded-lg p-8 shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-neutral-gray mb-2">
                    {t('registration.form.firstname')} *
                  </label>
                  <input 
                    type="text" 
                    id="firstname" 
                    {...register("firstname")}
                    className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.firstname && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstname.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-neutral-gray mb-2">
                    {t('registration.form.lastname')} *
                  </label>
                  <input 
                    type="text" 
                    id="lastname" 
                    {...register("lastname")}
                    className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.lastname && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastname.message}</p>
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
                    id="isemaparticipant" 
                    {...register("isemaparticipant")}
                    className="mr-2 mt-1"
                    disabled={!isEligibleForEma}
                  />
                  <label 
                    htmlFor="isemaparticipant" 
                    className={`text-sm font-medium ${!isEligibleForEma ? 'text-neutral-light' : ''}`}
                  >
                    {t('registration.form.emaParticipation')}
                    {!isEligibleForEma && birthDateValue && (
                      <span className="ml-2 text-red-500 text-xs">
                        ({t('registration.form.mustBe35')})
                      </span>
                    )}
                  </label>
                </div>
                <div className="text-sm pl-6">
                  <p>{t('registration.form.emaInfo')}</p>
                  <p className="mt-2 text-primary-dark font-medium">{t('registration.form.emaIncludesTshirt')}</p>
                  <div className="mt-2 p-3 bg-white/80 rounded border border-neutral-light/50">
                    <p className="text-gray-600">{t('registration.form.emaEligibilityCriteria')}</p>
                  </div>
                  
                  {isemaparticipant && (
                    <div className="mt-4">
                      <label htmlFor="tshirtsize" className="block text-sm font-medium text-neutral-gray mb-2">
                        {t('registration.form.tshirtsize')} *
                      </label>
                      <select 
                        id="tshirtsize" 
                        {...register("tshirtsize")}
                        className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      >
                        <option value="">{t('registration.form.selecttshirtsize')}</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                      {errors.tshirtsize && (
                        <p className="text-sm text-red-500 mt-1">{errors.tshirtsize.message}</p>
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
                      onClick={() => setValue("raceid", race.id)}
                    >
                      <label htmlFor={`race${race.id}`} className="flex items-start cursor-pointer">
                        <input 
                          type="radio" 
                          id={`race${race.id}`} 
                          value={race.id} 
                          checked={Number(selectedRaceId) === race.id}
                          onChange={() => setValue("raceid", race.id)}
                          className="hidden"
                        />
                        <span className={`w-5 h-5 border-2 rounded-full flex-shrink-0 mr-2 mt-1 ${
                          Number(selectedRaceId) === race.id ? 'border-primary bg-primary' : 'border-neutral-light'
                        }`}></span>
                        <div>
                          <span className="block font-bold">{getLocalizedRaceName(race, i18n.language as any)}</span>
                          <span className="text-sm text-neutral-gray">{race.distance}km | {isemaparticipant ? 
                            <span className="font-medium text-primary-dark">{race.id === 1 ? '200 RON' : '150 RON'} (€{race.id === 1 ? '40' : '30'}) ({t('registration.form.emaPrice')})</span> : 
                            <span>{race.id === 1 ? '170 RON' : '120 RON'} (€{race.id === 1 ? '34' : '24'})</span>
                          }</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.raceid && (
                  <p className="text-sm text-red-500 mt-1">{errors.raceid.message}</p>
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
              
              <div className="text-center">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`bg-accent text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-dark'}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('common.submitting')}
                    </span>
                  ) : (
                    t('registration.form.submitButton')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationFormWithPayment;