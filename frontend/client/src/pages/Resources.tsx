/**
 * Resources Page - Career Resources Hub
 * Central hub for all career resources and guides
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  FileText, Video, BookOpen, Target, TrendingUp, Award,
  ArrowRight, Download, Clock, Users, Lightbulb, GraduationCap
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

const resourceCategories = [
  {
    title: "Career Advice",
    description: "Expert guidance on career development, job searching, and professional growth strategies.",
    icon: Lightbulb,
    href: "/resources/career-advice",
    color: "bg-slate-600",
    articles: 45,
    featured: ["Building Your Personal Brand", "Networking Strategies", "Career Transitions"]
  },
  {
    title: "Salary Guide",
    description: "Comprehensive salary data and compensation insights across industries and roles.",
    icon: TrendingUp,
    href: "/resources/salary-guide",
    color: "bg-slate-700",
    articles: 32,
    featured: ["Tech Salary Trends 2026", "Negotiation Tactics", "Benefits Comparison"]
  },
  {
    title: "Resume Tips",
    description: "Create a standout resume with our expert tips, templates, and ATS optimization guides.",
    icon: FileText,
    href: "/resources/resume-tips",
    color: "bg-slate-500",
    articles: 28,
    featured: ["ATS-Friendly Formats", "Action Words Guide", "Resume Templates"]
  },
  {
    title: "Interview Prep",
    description: "Master your interviews with preparation guides, common questions, and expert strategies.",
    icon: Users,
    href: "/resources/interview-prep",
    color: "bg-slate-600",
    articles: 38,
    featured: ["STAR Method Guide", "Technical Interviews", "Behavioral Questions"]
  }
];

const featuredGuides = [
  {
    title: "The Complete Job Search Guide 2026",
    description: "Everything you need to know about finding and landing your dream job in today's market.",
    type: "Guide",
    readTime: "25 min read",
    icon: BookOpen
  },
  {
    title: "Mastering Remote Work",
    description: "Tips and strategies for thriving in a remote or hybrid work environment.",
    type: "Article",
    readTime: "12 min read",
    icon: Target
  },
  {
    title: "Career Change Roadmap",
    description: "A step-by-step guide to successfully transitioning to a new career path.",
    type: "Guide",
    readTime: "20 min read",
    icon: Award
  }
];

const stats = [
  { value: "500+", label: "Articles & Guides" },
  { value: "50+", label: "Video Tutorials" },
  { value: "100K+", label: "Monthly Readers" },
  { value: "4.9", label: "User Rating" }
];

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-navy via-navy-light to-navy overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Career Resources
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Your Career Success <span className="text-orange">Starts Here</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Access expert guides, salary insights, resume templates, and interview preparation 
                resources to accelerate your career growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/resources/career-advice">
                  <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                    Explore Resources
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/resources/salary-guide">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Salary Guide
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-navy mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <span className="text-orange font-medium mb-2 block">Browse by Category</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                  Explore Our Resources
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  From resume writing to salary negotiation, we've got you covered with 
                  comprehensive guides and expert advice.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {resourceCategories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center`}>
                        <category.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-navy mb-2">
                          {category.title}
                        </h3>
                        <p className="text-slate-600 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-slate-500 mb-3">Popular topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.featured.map((topic) => (
                          <span 
                            key={topic}
                            className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {category.articles} articles
                      </span>
                      <Link href={category.href}>
                        <Button variant="ghost" className="text-orange hover:text-orange-dark hover:bg-orange/10">
                          Explore
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Guides */}
        <section className="py-20 bg-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <span className="text-orange font-medium mb-2 block">Featured Content</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">
                  Essential Guides
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {featuredGuides.map((guide, index) => (
                  <motion.div
                    key={guide.title}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                      <guide.icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-xs font-medium text-orange uppercase tracking-wide">
                      {guide.type}
                    </span>
                    <h3 className="font-display text-lg font-bold text-navy mt-2 mb-3">
                      {guide.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {guide.readTime}
                      </span>
                      <Button variant="ghost" size="sm" className="text-orange hover:text-orange-dark">
                        Read Now
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-navy">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Advance Your Career?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Create your profile today and get personalized job recommendations, 
                salary insights, and career advice tailored to your goals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/jobs">
                  <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                    Browse Jobs
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Create Profile
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
