/**
 * Blog Page - Executive Precision Design System
 * Blog listing with articles and resources
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  Search, 
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const categories = ["All", "Career Advice", "Industry Insights", "Hiring Tips", "Leadership", "Remote Work"];

const featuredPost = {
  id: "1",
  title: "The Future of Executive Recruitment: AI, Data, and Human Connection",
  excerpt: "Explore how artificial intelligence and data analytics are transforming executive search while maintaining the crucial human element that defines successful placements.",
  author: "James Mitchell",
  date: "January 5, 2026",
  readTime: "8 min read",
  category: "Industry Insights",
  image: "/images/blog-ai-recruitment.jpg"
};

const posts = [
  {
    id: "2",
    title: "10 Questions to Ask in Your Executive Interview",
    excerpt: "Make a lasting impression and gather crucial information with these strategic questions for C-suite interviews.",
    author: "Sarah Chen",
    date: "January 3, 2026",
    readTime: "5 min read",
    category: "Career Advice",
    image: "/images/interview-success.jpg"
  },
  {
    id: "3",
    title: "Building a Diverse Leadership Team: Best Practices",
    excerpt: "Learn how top organizations are creating inclusive leadership pipelines and why diversity drives business success.",
    author: "Michael Roberts",
    date: "December 28, 2025",
    readTime: "6 min read",
    category: "Leadership",
    image: "/images/executive-search.jpg"
  },
  {
    id: "4",
    title: "Remote Work in 2026: What Executives Need to Know",
    excerpt: "The landscape of remote and hybrid work continues to evolve. Here's what leaders should consider for the year ahead.",
    author: "Emily Johnson",
    date: "December 22, 2025",
    readTime: "7 min read",
    category: "Remote Work",
    image: "/images/blog-remote-work.jpg"
  },
  {
    id: "5",
    title: "Salary Negotiation Strategies for Senior Roles",
    excerpt: "Expert tips for negotiating executive compensation packages that reflect your true value.",
    author: "James Mitchell",
    date: "December 18, 2025",
    readTime: "6 min read",
    category: "Career Advice",
    image: "/images/blog-salary-negotiation.jpg"
  },
  {
    id: "6",
    title: "How to Attract Top Talent in a Competitive Market",
    excerpt: "Strategies for employers to stand out and win the war for talent in today's candidate-driven market.",
    author: "Sarah Chen",
    date: "December 15, 2025",
    readTime: "5 min read",
    category: "Hiring Tips",
    image: "/images/team-collaboration.jpg"
  }
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-navy">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                Insights & Resources
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Career Insights & Industry News
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Expert advice, industry trends, and career resources to help you 
                navigate your professional journey.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 bg-white text-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-gray-100 bg-white sticky top-16 z-40">
          <div className="container">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-orange text-white"
                      : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <AnimatedSection className="py-12 md:py-16">
          <div className="container">
            <motion.div variants={fadeInUp}>
              <Link href={`/blog/${featuredPost.id}`}>
                <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
                  <div className="aspect-[21/9] overflow-hidden">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <span className="inline-block px-3 py-1 bg-orange text-white text-sm font-medium rounded-full mb-4">
                      Featured
                    </span>
                    <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-orange transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/80 text-lg mb-6 max-w-3xl hidden md:block">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-white/70 text-sm">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Blog Grid */}
        <AnimatedSection className="py-12 md:py-16 bg-gray-50">
          <div className="container">
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-navy">Latest Articles</h2>
              <span className="text-slate-500">{filteredPosts.length} articles</span>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Link href={`/blog/${post.id}`}>
                    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-4 h-4 text-orange" />
                          <span className="text-sm text-orange font-medium">{post.category}</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-navy mb-3 group-hover:text-orange transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-gray-100">
                          <span>{post.author}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-600 mb-4">No articles found matching your criteria.</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <motion.div variants={fadeInUp} className="text-center mt-12">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                  Load More Articles
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </AnimatedSection>

        {/* Newsletter CTA */}
        <section className="py-16 bg-navy">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-white/80 mb-8">
                Subscribe to our newsletter for the latest career insights, 
                industry news, and job opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white flex-1"
                />
                <Button className="bg-orange hover:bg-orange-dark text-white">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
