/**
 * Services Page - Executive Precision Design System
 * Comprehensive service offerings with detailed descriptions
 */

import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  ArrowRight, 
  Target, 
  Users, 
  Building2,
  Briefcase,
  TrendingUp,
  Shield,
  Clock,
  Award,
  CheckCircle2,
  Cpu,
  HeartPulse,
  Factory,
  BarChart3,
  Megaphone,
  Cog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

function AnimatedSection({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const services = [
  {
    id: "executive-search",
    icon: Target,
    title: "Executive Search",
    subtitle: "C-Suite & Senior Leadership",
    description: "Headhunt top-tier leaders and executives capable of propelling your organization forward. Our executive search practice specializes in identifying and attracting transformational leaders.",
    features: [
      "Comprehensive market mapping and talent identification",
      "Confidential search process with discretion guaranteed",
      "In-depth candidate assessment and evaluation",
      "Cultural fit analysis and leadership profiling",
      "Onboarding support and integration planning",
      "12-month placement guarantee"
    ],
    image: "/images/executive-search.jpg"
  },
  {
    id: "direct-hire",
    icon: Users,
    title: "Direct Hire",
    subtitle: "Professional & Management Roles",
    description: "Access entry-level and mid-management professionals who are the best at what they do. Our direct hire services connect you with top talent across all functional areas.",
    features: [
      "Extensive candidate database and network",
      "Rigorous screening and qualification process",
      "Skills assessment and technical evaluation",
      "Reference verification and background checks",
      "Salary benchmarking and offer negotiation",
      "90-day placement guarantee"
    ],
    image: "/images/team-collaboration.jpg"
  },
  {
    id: "rpo",
    icon: Building2,
    title: "RPO Solutions",
    subtitle: "Recruitment Process Outsourcing",
    description: "Outsource full-cycle, project-based, or hybrid hiring to our expert recruiters for fast, flexible talent solutions that scale with your business needs.",
    features: [
      "Dedicated recruitment team integration",
      "Scalable solutions for high-volume hiring",
      "Employer branding and candidate experience",
      "ATS implementation and optimization",
      "Recruitment analytics and reporting",
      "Cost-per-hire optimization"
    ],
    image: "/images/about-hero.jpg"
  }
];

const industries = [
  { icon: Cpu, title: "Technology", description: "Software, hardware, and IT services" },
  { icon: BarChart3, title: "Finance", description: "Banking, investment, and insurance" },
  { icon: HeartPulse, title: "Healthcare", description: "Hospitals, pharma, and biotech" },
  { icon: Factory, title: "Manufacturing", description: "Industrial and consumer goods" },
  { icon: Megaphone, title: "Marketing", description: "Agencies and brand management" },
  { icon: Cog, title: "Operations", description: "Supply chain and logistics" },
];

const process = [
  { step: "01", title: "Discovery", description: "We learn about your organization, culture, and specific hiring needs." },
  { step: "02", title: "Strategy", description: "We develop a customized recruitment strategy and timeline." },
  { step: "03", title: "Search", description: "Our team identifies and engages top candidates through multiple channels." },
  { step: "04", title: "Evaluation", description: "Rigorous screening ensures only qualified candidates advance." },
  { step: "05", title: "Presentation", description: "We present a shortlist of exceptional candidates with detailed profiles." },
  { step: "06", title: "Placement", description: "We facilitate interviews, negotiations, and successful onboarding." },
];

export default function Services() {
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
                Our Services
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Comprehensive <span className="text-orange italic">Recruitment</span> Solutions
              </h1>
              <p className="text-xl text-white/80">
                From executive search to full-cycle recruitment outsourcing, we deliver 
                tailored solutions to meet your unique talent acquisition needs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Tabs */}
        <AnimatedSection className="py-20 md:py-28">
          <div className="container">
            <Tabs defaultValue="executive-search" className="w-full">
              <motion.div variants={fadeInUp} className="flex justify-center mb-12">
                <TabsList className="bg-gray-100 p-1">
                  <TabsTrigger value="executive-search" className="px-6 py-3">
                    Executive Search
                  </TabsTrigger>
                  <TabsTrigger value="direct-hire" className="px-6 py-3">
                    Direct Hire
                  </TabsTrigger>
                  <TabsTrigger value="rpo" className="px-6 py-3">
                    RPO Solutions
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              {services.map((service) => (
                <TabsContent key={service.id} value={service.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid lg:grid-cols-2 gap-12 items-center"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-orange/10 rounded-xl flex items-center justify-center">
                          <service.icon className="w-7 h-7 text-orange" />
                        </div>
                        <div>
                          <h2 className="font-display text-3xl font-bold text-navy">
                            {service.title}
                          </h2>
                          <p className="text-orange font-medium">{service.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="space-y-4 mb-8">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                            <span className="text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href="/contact">
                        <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                          Get Started
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="rounded-2xl overflow-hidden shadow-2xl">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </AnimatedSection>

        {/* Industries Section */}
        <AnimatedSection id="industries" className="py-20 md:py-28 bg-gray-50">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Industries</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Industry Expertise
              </h2>
              <p className="text-slate-600 text-lg">
                Our specialized recruiters have deep knowledge across diverse industries, 
                enabling us to find the perfect fit for your organization.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry) => (
                <motion.div
                  key={industry.title}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-6 border border-gray-100 hover:border-orange/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange transition-colors">
                      <industry.icon className="w-6 h-6 text-orange group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-navy mb-1">
                        {industry.title}
                      </h3>
                      <p className="text-sm text-slate-500">{industry.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Process Section */}
        <AnimatedSection className="py-20 md:py-28">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Our Process</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                How We Work
              </h2>
              <p className="text-slate-600 text-lg">
                Our proven six-step process ensures we deliver exceptional candidates 
                who align with your requirements and culture.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  variants={fadeInUp}
                  className="relative"
                >
                  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow h-full">
                    <div className="font-display text-5xl font-bold text-orange/20 mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-display text-xl font-bold text-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange/30" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Benefits Section */}
        <AnimatedSection className="py-20 md:py-28 bg-navy text-white">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeInUp}>
                <span className="text-orange font-medium mb-4 block">Why Choose Us</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Partnership Benefits
                </h2>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  When you partner with Talent Horizon, you gain access to more than 
                  just recruitment services—you get a strategic partner committed to 
                  your success.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: Clock, title: "Fast Turnaround", desc: "Average 30-day placement" },
                    { icon: Award, title: "Quality Guarantee", desc: "Industry-leading retention" },
                    { icon: Shield, title: "Confidential", desc: "Discreet search process" },
                    { icon: TrendingUp, title: "Market Insights", desc: "Salary & trend data" },
                  ].map((benefit) => (
                    <div key={benefit.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-orange" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-white/60">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <h3 className="font-display text-2xl font-bold mb-6">Ready to Get Started?</h3>
                  <p className="text-white/80 mb-6">
                    Contact our team today to discuss your recruitment needs and 
                    discover how we can help you build a world-class team.
                  </p>
                  <Link href="/contact">
                    <Button size="lg" className="w-full bg-orange hover:bg-orange-dark text-white">
                      Schedule a Consultation
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
