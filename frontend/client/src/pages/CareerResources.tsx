/**
 * Career Resources Page - Career advice and tips
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  FileText, Video, BookOpen, Lightbulb, ArrowRight,
  CheckCircle2, Download, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const resources = [
  {
    category: "Resume Tips",
    icon: FileText,
    color: "bg-slate-600",
    items: [
      { title: "How to Write a Winning Resume in 2026", type: "article", readTime: "8 min" },
      { title: "10 Resume Mistakes That Cost You Interviews", type: "article", readTime: "6 min" },
      { title: "ATS-Friendly Resume Templates", type: "download", downloads: "15K+" },
      { title: "Resume Review Checklist", type: "download", downloads: "8K+" },
    ]
  },
  {
    category: "Interview Prep",
    icon: Video,
    color: "bg-slate-700",
    items: [
      { title: "Master the STAR Method for Behavioral Questions", type: "video", duration: "12 min" },
      { title: "Top 50 Interview Questions & Answers", type: "article", readTime: "15 min" },
      { title: "How to Negotiate Your Salary", type: "video", duration: "18 min" },
      { title: "Virtual Interview Best Practices", type: "article", readTime: "7 min" },
    ]
  },
  {
    category: "Career Growth",
    icon: Lightbulb,
    color: "bg-slate-500",
    items: [
      { title: "Building Your Personal Brand on LinkedIn", type: "article", readTime: "10 min" },
      { title: "Networking Strategies That Actually Work", type: "video", duration: "15 min" },
      { title: "When to Ask for a Promotion", type: "article", readTime: "8 min" },
      { title: "Career Transition Guide", type: "download", downloads: "12K+" },
    ]
  },
  {
    category: "Industry Insights",
    icon: BookOpen,
    color: "bg-orange",
    items: [
      { title: "Tech Industry Salary Report 2026", type: "download", downloads: "25K+" },
      { title: "Remote Work Trends & Statistics", type: "article", readTime: "12 min" },
      { title: "Most In-Demand Skills for 2026", type: "article", readTime: "9 min" },
      { title: "Future of Work: AI & Automation", type: "video", duration: "20 min" },
    ]
  },
];

const featuredGuides = [
  {
    title: "The Complete Job Search Guide",
    description: "Everything you need to know about finding and landing your dream job in 2026.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600",
    chapters: 12,
  },
  {
    title: "Salary Negotiation Masterclass",
    description: "Learn proven strategies to negotiate higher compensation packages.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
    chapters: 8,
  },
  {
    title: "Remote Work Success Blueprint",
    description: "Thrive in remote positions with productivity tips and best practices.",
    image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600",
    chapters: 10,
  },
];

export default function CareerResources() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-navy py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Career <span className="text-orange">Resources</span>
            </h1>
            <p className="text-xl text-white/70">
              Expert advice, guides, and tools to accelerate your career growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-navy mb-8">Featured Guides</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredGuides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-semibold text-navy text-lg mb-2 group-hover:text-orange transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{guide.chapters} chapters</span>
                    <Button variant="ghost" size="sm" className="text-orange">
                      Read Guide
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources by Category */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-navy text-lg">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {category.items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-navy text-sm">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {item.type === "article" && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {item.readTime} read
                            </span>
                          )}
                          {item.type === "video" && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              {item.duration}
                            </span>
                          )}
                          {item.type === "download" && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {item.downloads} downloads
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-navy">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Get Weekly Career Tips
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join 50,000+ professionals receiving our weekly newsletter with career advice, job market insights, and exclusive resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange"
            />
            <Button className="bg-orange hover:bg-orange-dark text-white px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
