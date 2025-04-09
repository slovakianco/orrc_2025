import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstname: z.string().min(2, { message: "validation.firstname" }),
  lastname: z.string().min(2, { message: "validation.lastname" }),
  email: z.string().email({ message: "validation.email" }),
  phone: z.string().min(6, { message: "validation.phone" }),
  country: z.string().min(1, { message: "validation.country" }),
  dateOfBirth: z.string().min(1, { message: "validation.dateOfBirth" }),
  raceCategory: z.string().min(1, { message: "validation.raceCategory" }),
  emergencyContactName: z.string().min(2, { message: "validation.emergencyContactName" }),
  emergencyContactPhone: z.string().min(6, { message: "validation.emergencyContactPhone" }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "validation.termsAccepted" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Registration() {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      country: "",
      dateOfBirth: "",
      raceCategory: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Registration data:", data);
      setSubmitting(false);
      
      toast({
        title: t("registration.successTitle"),
        description: t("registration.successMessage"),
      });
      
      form.reset();
    }, 1500);
  };

  return (
    <div>
      <section className="py-8 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("registration.title")}
          </h1>
          <p className="text-lg opacity-90">
            {t("registration.subtitle")}
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-neutral-light p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-heading font-bold mb-6 text-neutral-dark">
              {t("registration.formTitle")}
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                          {t("registration.firstname")} *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                          {t("registration.lastname")} *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                        {t("registration.email")} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="email"
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                        {t("registration.phone")} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="tel"
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                        {t("registration.country")} *
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300">
                            <SelectValue placeholder={t("registration.selectCountry")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ro">Romania</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="es">Spain</SelectItem>
                          <SelectItem value="it">Italy</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                        {t("registration.dateOfBirth")} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="date"
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="raceCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                        {t("registration.raceCategory")} *
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300">
                            <SelectValue placeholder={t("registration.selectRace")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ultra">{t("race.ultra.name")}</SelectItem>
                          <SelectItem value="marathon">{t("race.marathon.name")}</SelectItem>
                          <SelectItem value="half">{t("race.half.name")}</SelectItem>
                          <SelectItem value="25k">{t("race.25k.name")}</SelectItem>
                          <SelectItem value="10k">{t("race.10k.name")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                        {t("registration.emergencyName")} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-accent font-medium text-neutral-dark">
                        {t("registration.emergencyPhone")} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="tel"
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium text-neutral-dark">
                          {t("registration.termsText")}{" "}
                          <Link href="/terms">
                            <a className="text-[#2E7D32] hover:underline">{t("registration.termsLink")}</a>
                          </Link>{" "}
                          {t("registration.andText")}{" "}
                          <Link href="/privacy">
                            <a className="text-[#2E7D32] hover:underline">{t("registration.privacyLink")}</a>
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <div>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-accent font-bold py-3 px-4 rounded-md transition duration-300 shadow-md hover:shadow-lg"
                  >
                    {submitting ? t("registration.submitting") : t("registration.submitButton")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
