import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Mail, Phone } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "validation.name" }),
  email: z.string().email({ message: "validation.email" }),
  subject: z.string().min(2, { message: "validation.subject" }),
  message: z.string().min(10, { message: "validation.message" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Contact form data:", data);
      setSubmitting(false);

      toast({
        title: t("contact.form.successTitle"),
        description: t("contact.form.successMessage"),
      });

      form.reset();
    }, 1500);
  };

  const faqs = [
    {
      question: "contact.faq.q1",
      answer: "contact.faq.a1",
    },
    {
      question: "contact.faq.q2",
      answer: "contact.faq.a2",
    },
    {
      question: "contact.faq.q3",
      answer: "contact.faq.a3",
    },
    {
      question: "contact.faq.q4",
      answer: "contact.faq.a4",
    },
    {
      question: "contact.faq.q5",
      answer: "contact.faq.a5",
    },
  ];

  return (
    <div>
      <section className="py-8 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {t("contact.title")}
          </h1>
          <p className="text-lg opacity-90">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6 text-neutral-dark">
                {t("contact.info.title")}
              </h2>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-1">
                        {t("contact.info.addressTitle")}
                      </h3>
                      <p className="text-neutral-dark">
                        123 Mountain Trail, <br />
                        Brasov, Romania
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-1">
                        {t("contact.info.emailTitle")}
                      </h3>
                      <p className="text-neutral-dark">
                        <a
                          href="mailto:slovak.ianco@gmail.com"
                          className="text-[#2E7D32] hover:underline"
                        >
                          slovak.ianco@gmail.com
                        </a>
                        <br />
                        <a
                          href="mailto:slovak.ianco@gmail.com"
                          className="text-[#2E7D32] hover:underline"
                        >
                          slovak.ianco@gmail.com
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-1">
                        {t("contact.info.phoneTitle")}
                      </h3>
                      <p className="text-neutral-dark">
                        <a
                          href="tel:+40744534802"
                          className="text-[#2E7D32] hover:underline"
                        >
                          +40744534802
                        </a>
                        <br />
                        <a
                          href="tel:+40744534802"
                          className="text-[#2E7D32] hover:underline"
                        >
                          +40744534802
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-2xl font-heading font-bold mb-6 mt-12 text-neutral-dark">
                {t("contact.faq.title")}
              </h2>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-lg font-medium text-neutral-dark">
                      {t(faq.question)}
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-dark">
                      {t(faq.answer)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6 text-neutral-dark">
                {t("contact.form.title")}
              </h2>

              <Card>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.name")}</FormLabel>
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.email")}</FormLabel>
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
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.subject")}</FormLabel>
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
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.message")}</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={5}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-300 resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-accent font-bold py-3 px-4 rounded-md transition duration-300 shadow-md hover:shadow-lg"
                      >
                        {submitting
                          ? t("contact.form.sending")
                          : t("contact.form.send")}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
