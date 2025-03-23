import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ContactForm as ContactFormType } from "@/lib/types";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [accordionValue, setAccordionValue] = useState<string>("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormType) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: t('contact.form.success.title'),
        description: t('contact.form.success.message'),
      });
      reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('contact.form.error.title'),
        description: error.message || t('contact.form.error.message'),
      });
    }
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    await contactMutation.mutate(data);
  };

  // FAQ items
  const faqItems = [
    {
      question: t('contact.faq.registration.question'),
      answer: t('contact.faq.registration.answer')
    },
    {
      question: t('contact.faq.equipment.question'),
      answer: t('contact.faq.equipment.answer')
    },
    {
      question: t('contact.faq.stations.question'),
      answer: t('contact.faq.stations.answer')
    },
    {
      question: t('contact.faq.change.question'),
      answer: t('contact.faq.change.answer')
    }
  ];

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('contact.title')}</h2>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-8 shadow-md h-full">
                <h3 className="font-heading font-bold text-xl mb-6">{t('contact.info.title')}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary rounded-full p-3 mr-4 text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t('contact.info.email')}</h4>
                      <a href="mailto:info@trailrun.com" className="text-primary hover:underline">info@trailrun.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary rounded-full p-3 mr-4 text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t('contact.info.phone')}</h4>
                      <a href="tel:+40123456789" className="text-primary hover:underline">+40 123 456 789</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary rounded-full p-3 mr-4 text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t('contact.info.location')}</h4>
                      <p>{t('contact.info.address')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary rounded-full p-3 mr-4 text-white">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{t('contact.info.hours')}</h4>
                      <p>{t('contact.info.weekdays')}<br/>{t('contact.info.weekend')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-bold mb-3">{t('contact.info.social')}</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-neutral-light hover:bg-neutral-gray hover:text-white transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-neutral-light hover:bg-neutral-gray hover:text-white transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-neutral-light hover:bg-neutral-gray hover:text-white transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-neutral-light hover:bg-neutral-gray hover:text-white transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center">
                      <Youtube className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-8 shadow-md">
                <h3 className="font-heading font-bold text-xl mb-6">{t('contact.form.title')}</h3>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-neutral-gray mb-2">
                        {t('contact.form.name')} *
                      </label>
                      <input 
                        type="text" 
                        id="contactName" 
                        {...register("name")}
                        className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-neutral-gray mb-2">
                        {t('contact.form.email')} *
                      </label>
                      <input 
                        type="email" 
                        id="contactEmail" 
                        {...register("email")}
                        className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="contactSubject" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('contact.form.subject')} *
                    </label>
                    <input 
                      type="text" 
                      id="contactSubject" 
                      {...register("subject")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="contactMessage" className="block text-sm font-medium text-neutral-gray mb-2">
                      {t('contact.form.message')} *
                    </label>
                    <textarea 
                      id="contactMessage" 
                      rows={5} 
                      {...register("message")}
                      className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? t('common.submitting') : t('contact.form.submitButton')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h3 className="font-heading font-bold text-2xl mb-8 text-center">{t('contact.faq.title')}</h3>
            
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <Accordion
                type="single"
                collapsible
                value={accordionValue}
                onValueChange={setAccordionValue}
                className="w-full"
              >
                {faqItems.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-neutral-light">
                    <AccordionTrigger className="p-6 text-left font-bold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-neutral-gray">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
