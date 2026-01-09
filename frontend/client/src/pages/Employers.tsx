/**
 * Employers Page - Executive Precision Design System
 * Information and services for hiring companies
 */

import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  ArrowRight, 
  Target, 
  Users, 
  Building2,
  Clock,
  Shield,
  Award,
  CheckCircle2,
  TrendingUp,
  Zap,
  BarChart3,
  Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const benefits = [
  {
    icon: Clock,
    title: "Faster Time-to-Hire",
    description: "Our average placement time is 30 days, significantly faster than industry average of 42 days."
  },
  {
    icon: Target,
    title: "Quality Candidates",
    description: "98% of our placements pass probation, thanks to our rigorous screening process."
  },
  {
    icon: Shield,
    title: "Placement Guarantee",
    description: "We offer up to 12-month placement guarantees, giving you peace of mind."
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Access salary benchmarking, talent market data, and competitive intelligence."
  },
  {
    icon: Zap,
    title: "Dedicated Support",
    description: "Your dedicated account manager ensures seamless communication throughout."
  },
  {
    icon: BarChart3,
    title: "Transparent Reporting",
    description: "Real-time dashboards and regular updates on your recruitment pipeline."
  }
];

const solutions = [
  {
    title: "Executive Search",
    description: "Find transformational leaders for C-suite and senior leadership roles.",
    features: ["Confidential search", "Global reach", "12-month guarantee"],
    link: "/services#executive-search"
  },
  {
    title: "Direct Hire",
    description: "Access top professional and management talent across all functions.",
    features: ["Extensive network", "Skills assessment", "90-day guarantee"],
    link: "/services#direct-hire"
  },
  {
    title: "RPO Solutions",
    description: "Scale your hiring with our recruitment process outsourcing services.",
    features: ["Dedicated team", "Cost optimization", "Full-cycle support"],
    link: "/services#rpo"
  }
];

const testimonials = [
  {
    quote: "Talent Horizon helped us fill 15 critical engineering positions in just 6 weeks. Their understanding of our tech stack and culture was impressive.",
    author: "David Kim",
    role: "VP of Engineering",
    company: "CloudScale Technologies"
  },
  {
    quote: "The quality of executive candidates they presented exceeded our expectations. We found our new CFO through their search.",
    author: "Maria Santos",
    role: "CEO",
    company: "FinanceFirst Corp"
  }
];

export default function Employers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/images/team-collaboration.jpg" 
              alt="Team collaboration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/70" />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                For Employers
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Build Your <span className="text-orange italic">Dream Team</span> With Us
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Partner with industry-leading recruiters who understand your business 
                and deliver exceptional talent that drives results.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-orange hover:bg-orange-dark text-white text-lg px-8">
                    Start Hiring
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy text-lg px-8">
                    View Services
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "30", label: "Day Avg. Placement" },
                { value: "98%", label: "Retention Rate" },
                { value: "5000+", label: "Successful Hires" },
                { value: "150+", label: "Partner Companies" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-navy mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <AnimatedSection className="py-20 md:py-28">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Why Partner With Us</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                The Talent Horizon Advantage
              </h2>
              <p className="text-slate-600 text-lg">
                We go beyond traditional recruitment to deliver a partnership 
                experience that drives your hiring success.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-6 border border-gray-100 hover:border-orange/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange transition-colors">
                    <benefit.icon className="w-6 h-6 text-orange group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Solutions Section */}
        <AnimatedSection className="py-20 md:py-28 bg-gray-50">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Our Solutions</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Tailored Recruitment Solutions
              </h2>
              <p className="text-slate-600 text-lg">
                Choose the service model that best fits your hiring needs and budget.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {solutions.map((solution) => (
                <motion.div
                  key={solution.title}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="font-display text-2xl font-bold text-navy mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-slate-600 mb-6">{solution.description}</p>
                  <ul className="space-y-3 mb-8">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-orange" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={solution.link}>
                    <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy hover:text-white">
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Process Section */}
        <AnimatedSection className="py-20 md:py-28">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeInUp}>
                <span className="text-orange font-medium mb-4 block">How It Works</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-6">
                  Simple, Effective Process
                </h2>
                <p className="text-slate-600 text-lg mb-8">
                  Our streamlined recruitment process ensures you get the best 
                  candidates quickly and efficiently.
                </p>

                <div className="space-y-6">
                  {[
                    { step: "1", title: "Share Your Needs", desc: "Tell us about your role, requirements, and company culture." },
                    { step: "2", title: "We Search & Screen", desc: "Our team identifies and evaluates top candidates." },
                    { step: "3", title: "Review Candidates", desc: "We present a curated shortlist with detailed profiles." },
                    { step: "4", title: "Interview & Hire", desc: "We coordinate interviews and facilitate offers." }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-10 h-10 bg-orange text-white rounded-full flex items-center justify-center font-display font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-navy mb-1">{item.title}</h4>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-navy rounded-2xl p-8 text-white">
                  <Handshake className="w-12 h-12 text-orange mb-6" />
                  <h3 className="font-display text-2xl font-bold mb-4">
                    Ready to Transform Your Hiring?
                  </h3>
                  <p className="text-white/80 mb-6">
                    Schedule a free consultation with our recruitment experts 
                    to discuss your hiring needs and how we can help.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "No obligation consultation",
                      "Custom recruitment strategy",
                      "Transparent pricing"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-white/80">
                        <CheckCircle2 className="w-4 h-4 text-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact">
                    <Button size="lg" className="w-full bg-orange hover:bg-orange-dark text-white">
                      Schedule Consultation
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection className="py-20 md:py-28 bg-gray-50">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Client Success</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                What Our Clients Say
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.author}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Award key={i} className="w-5 h-5 fill-orange text-orange" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-display font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-navy">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <section className="py-20 bg-navy">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Start Building Your Dream Team Today
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join 150+ companies who trust Talent Horizon for their recruitment needs.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-orange hover:bg-orange-dark text-white text-lg px-8">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
