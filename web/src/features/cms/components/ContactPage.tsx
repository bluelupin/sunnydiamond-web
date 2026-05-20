"use client";

import Layout from "@/shared/ui/layout/Layout";
import SectionHeader from "@/shared/ui/SectionHeader";
import { FormInput, FormTextarea } from "@/shared/ui/FormInput";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { useToast } from "@/shared/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";
import { contactContent } from "@/features/cms/data/content";
import { siteConfig } from "@/shared/lib/siteConfig";

const contactInfo = [
  { icon: MapPin, label: "Visit Us", value: siteConfig.contact.address },
  { icon: Phone, label: "Call Us", value: siteConfig.contact.phone },
  { icon: Mail, label: "Email Us", value: siteConfig.contact.email },
];

const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent", description: "We'll get back to you within 24 hours." });
  };

  return (
    <Layout>
      <div className="container py-10 md:py-16">
        <SectionHeader
          subtitle={contactContent.header.subtitle}
          title={contactContent.header.title}
          as="h1"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-8">
            <p className="font-body text-sm leading-relaxed text-muted-foreground">
              {contactContent.description}
            </p>
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <Icon size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                    {label}
                  </p>
                  <p className="font-body text-sm text-foreground mt-1">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput type="text" placeholder="Your name" label="Name" required />
            <FormInput type="email" placeholder="Your email" label="Email" required />
            <FormTextarea placeholder="Your message" label="Message" rows={5} required />
            <PrimaryButton type="submit" className="w-full">
              Send Message
            </PrimaryButton>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
