/**
 * Contact Page - Executive Precision Design System
 * Contact form and company contact information
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle2,
  Linkedin,
  Twitter,
  Facebook
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@talenthorizon.com", "hr@talenthorizon.com"],
    description: "We'll respond within 24 hours"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (234) 567-890", "+1 (234) 567-891"],
    description: "Mon-Fri from 8am to 6pm EST"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Business Avenue", "New York, NY 10001"],
    description: "Schedule an appointment first"
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Friday: 8am - 6pm", "Saturday: 9am - 1pm"],
    description: "Closed on Sundays"
  }
];

const inquiryTypes = [
  "Executive Search",
  "Direct Hire",
  "RPO Solutions",
  "Job Application",
  "Partnership Inquiry",
  "General Question"
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent successfully! We'll be in touch soon.");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-navy overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                Get In Touch
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Let's Start a <span className="text-orange italic">Conversation</span>
              </h1>
              <p className="text-xl text-white/80">
                Whether you're looking to hire exceptional talent or explore career 
                opportunities, we're here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 -mt-12 relative z-10">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-orange" />
                  </div>
                  <h3 className="font-display font-bold text-navy mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-slate-600">{detail}</p>
                  ))}
                  <p className="text-sm text-slate-400 mt-2">{info.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl font-bold text-navy mb-2">
                  Send Us a Message
                </h2>
                <p className="text-slate-600 mb-8">
                  Fill out the form below and our team will get back to you within 
                  24 hours.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-50 rounded-xl p-8 text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold text-navy mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Thank you for reaching out. One of our team members will 
                      contact you shortly.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          firstName: "",
                          lastName: "",
                          email: "",
                          phone: "",
                          company: "",
                          inquiryType: "",
                          message: ""
                        });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => handleChange("firstName", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => handleChange("lastName", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleChange("company", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="inquiryType">Inquiry Type *</Label>
                        <Select 
                          value={formData.inquiryType} 
                          onValueChange={(value) => handleChange("inquiryType", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell us about your recruitment needs or career goals..."
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-start gap-2">
                      <input type="checkbox" id="consent" required className="mt-1" />
                      <Label htmlFor="consent" className="text-sm text-slate-600 font-normal">
                        I agree to receive communications from Talent Horizon. You can 
                        view our privacy policy <a href="/privacy" className="text-orange hover:underline">here</a>.
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-orange hover:bg-orange-dark text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>

              {/* Map & Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-xl h-80 mb-8 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1635959481000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                </div>

                {/* Quick Contact */}
                <div className="bg-navy rounded-xl p-8 text-white">
                  <h3 className="font-display text-2xl font-bold mb-4">
                    Need Immediate Assistance?
                  </h3>
                  <p className="text-white/80 mb-6">
                    For urgent hiring needs or time-sensitive inquiries, 
                    reach out to us directly.
                  </p>
                  <div className="space-y-4 mb-8">
                    <a 
                      href="tel:+1234567890" 
                      className="flex items-center gap-3 text-white/80 hover:text-orange transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>+1 (234) 567-890</span>
                    </a>
                    <a 
                      href="mailto:urgent@talenthorizon.com" 
                      className="flex items-center gap-3 text-white/80 hover:text-orange transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>urgent@talenthorizon.com</span>
                    </a>
                  </div>

                  {/* Social Links */}
                  <div>
                    <p className="text-sm text-white/60 mb-3">Follow Us</p>
                    <div className="flex gap-3">
                      {[
                        { icon: Linkedin, href: "#" },
                        { icon: Twitter, href: "#" },
                        { icon: Facebook, href: "#" }
                      ].map((social, i) => (
                        <a
                          key={i}
                          href={social.href}
                          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange transition-colors"
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 bg-gray-50">
          <div className="container text-center">
            <h2 className="font-display text-2xl font-bold text-navy mb-4">
              Have Questions?
            </h2>
            <p className="text-slate-600 mb-6">
              Check out our frequently asked questions or reach out to our team.
            </p>
            <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              View FAQ
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
