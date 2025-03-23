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
import { useEffect } from "react";

// Extend schema to add form-specific validations
const registrationFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(6, { message: "Please enter a valid phone number" }),
  country: z.string().min(1, { message: "Please select your country" }),
  birthDate: z.string().min(1, { message: "Please enter your date of birth" }),
  raceId: z.number({ invalid_type_error: "Please select a race" }),
  medicalInfo: z.string().optional(),
  gender: z.enum(["M", "F"], { errorMap: () => ({ message: "Please select your gender" }) }),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
});

type RegistrationFormInputs = z.infer<typeof registrationFormSchema>;

const RegistrationForm = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      raceId: 0,
      medicalInfo: "",
      gender: "M",
      termsAccepted: false,
    }
  });

  const selectedRaceId = watch("raceId");
  const selectedRace = races?.find(race => race.id === Number(selectedRaceId));
  
  // Set default race if available and not already selected
  useEffect(() => {
    if (races && races.length > 0 && (!selectedRaceId || selectedRaceId === 0)) {
      setValue("raceId", races[0].id);
    }
  }, [races, selectedRaceId, setValue]);

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegistrationFormInputs, "termsAccepted">) => {
      return apiRequest("POST", "/api/participants", data);
    },
    onSuccess: async () => {
      toast({
        title: t('registration.success.title'),
        description: t('registration.success.message'),
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ['/api/participants'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('registration.error.title'),
        description: error.message || t('registration.error.message'),
      });
    }
  });

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    // Remove termsAccepted as it's not part of the API schema
    const { termsAccepted, ...apiData } = data;
    
    // Convert raceId from string to number if needed
    const formattedData = {
      ...apiData,
      raceId: typeof apiData.raceId === 'string' ? parseInt(apiData.raceId) : apiData.raceId
    };
    
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
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
