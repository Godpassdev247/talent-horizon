/**
 * About Page - Executive Precision Design System
 * Company information, mission, values, and leadership team
 */

import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  ArrowRight, 
  Target, 
  Heart, 
  Lightbulb, 
  Users,
  Award,
  Globe,
  TrendingUp,
  Linkedin
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

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We pursue excellence in every placement, ensuring the perfect match between talent and opportunity."
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Honest, transparent relationships form the foundation of our business partnerships."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously evolve our methods to stay ahead in the dynamic recruitment landscape."
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We view every client relationship as a long-term partnership built on mutual success."
  }
];

const milestones = [
  { year: "2004", title: "Founded", description: "Started with a vision to transform executive recruitment" },
  { year: "2010", title: "National Expansion", description: "Expanded operations across all major US markets" },
  { year: "2015", title: "1000+ Placements", description: "Reached milestone of 1000 successful executive placements" },
  { year: "2020", title: "Digital Transformation", description: "Launched AI-powered candidate matching platform" },
  { year: "2024", title: "Industry Leader", description: "Recognized as Forbes Top Recruiting Firm" }
];

const leadership = [
  {
    name: "James Mitchell",
    role: "Founder & CEO",
    bio: "20+ years of executive recruitment experience. Former VP of HR at Fortune 500 company.",
    image: "/images/executive-search.jpg"
  },
  {
    name: "Sarah Chen",
    role: "President & Partner",
    bio: "Expert in technology sector recruitment with a track record of C-suite placements.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  },
  {
    name: "Michael Roberts",
    role: "Chief Revenue Officer",
    bio: "Drives business development and strategic partnerships across industries.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  },
  {
    name: "Emily Johnson",
    role: "VP of Operations",
    bio: "Oversees recruitment operations and ensures exceptional service delivery.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
  }
];

const awards = [
  { title: "Forbes Top Recruiting Firm", years: "2022, 2023, 2024" },
  { title: "Best & Brightest Award", years: "2019-2024" },
  { title: "Inc. 5000 Fastest Growing", years: "2020-2023" },
  { title: "LinkedIn Top Staffing Brand", years: "2023, 2024" }
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/images/about-hero.jpg" 
              alt="Corporate headquarters" 
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
                About Talent Horizon
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Building Exceptional Teams Since 2004
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                We're more than recruiters—we're strategic partners dedicated to 
                connecting world-class talent with organizations ready to grow.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <AnimatedSection className="py-20 md:py-28">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeInUp}>
                <span className="text-orange font-medium mb-4 block">Our Mission</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-6">
                  Transforming How Organizations Find Exceptional Talent
                </h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  At Talent Horizon, we believe that the right hire can transform an 
                  organization. Our mission is to bridge the gap between exceptional 
                  talent and forward-thinking companies, creating partnerships that 
                  drive mutual success.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                  With deep industry expertise and a commitment to understanding each 
                  client's unique culture and needs, we deliver recruitment solutions 
                  that go beyond filling positions—we build teams that shape the future.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6">
                {[
                  { icon: Globe, value: "50+", label: "Countries Served" },
                  { icon: Users, value: "5000+", label: "Placements Made" },
                  { icon: Award, value: "98%", label: "Client Retention" },
                  { icon: TrendingUp, value: "20+", label: "Years Experience" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-6 text-center">
                    <stat.icon className="w-8 h-8 text-orange mx-auto mb-3" />
                    <div className="font-display text-3xl font-bold text-navy mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Values Section */}
        <AnimatedSection className="py-20 md:py-28 bg-gray-50">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Our Values</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Principles That Guide Us
              </h2>
              <p className="text-slate-600 text-lg">
                Our core values shape every interaction and decision, ensuring we 
                deliver exceptional results for our clients and candidates.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <motion.div
                  key={value.title}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-orange" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline Section */}
        <AnimatedSection className="py-20 md:py-28">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Our Journey</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Two Decades of Excellence
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    variants={fadeInUp}
                    className={`flex flex-col md:flex-row items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 inline-block">
                        <div className="font-display text-2xl font-bold text-orange mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="font-display text-xl font-bold text-navy mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-slate-600">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-orange rounded-full border-4 border-white shadow-md z-10" />
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Leadership Team */}
        <AnimatedSection id="team" className="py-20 md:py-28 bg-gray-50">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Leadership</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Meet Our Leadership Team
              </h2>
              <p className="text-slate-600 text-lg">
                Experienced professionals dedicated to delivering exceptional 
                recruitment solutions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leadership.map((leader) => (
                <motion.div
                  key={leader.name}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={leader.image} 
                        alt={leader.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-navy mb-1">
                        {leader.name}
                      </h3>
                      <p className="text-orange font-medium text-sm mb-3">
                        {leader.role}
                      </p>
                      <p className="text-slate-600 text-sm mb-4">
                        {leader.bio}
                      </p>
                      <a 
                        href="#" 
                        className="inline-flex items-center text-navy hover:text-orange transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Awards Section */}
        <AnimatedSection className="py-20 md:py-28">
          <div className="container">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange font-medium mb-4 block">Recognition</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Recognized as Industry Leaders
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {awards.map((award) => (
                <motion.div
                  key={award.title}
                  variants={fadeInUp}
                  className="text-center p-6 bg-gray-50 rounded-xl"
                >
                  <Award className="w-10 h-10 text-orange mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-navy mb-2">
                    {award.title}
                  </h3>
                  <p className="text-sm text-slate-500">{award.years}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <section className="py-20 bg-navy">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Partner With Us?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Let's discuss how we can help you build your dream team.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-orange hover:bg-orange-dark text-white text-lg px-8">
                  Contact Our Team
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
