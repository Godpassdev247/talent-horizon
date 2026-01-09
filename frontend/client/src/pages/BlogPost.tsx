/**
 * Blog Post Page - Executive Precision Design System
 * Individual blog article view
 */

import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { 
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Sample blog post data
const postsData: Record<string, any> = {
  "1": {
    id: "1",
    title: "The Future of Executive Recruitment: AI, Data, and Human Connection",
    excerpt: "Explore how artificial intelligence and data analytics are transforming executive search while maintaining the crucial human element that defines successful placements.",
    author: "James Mitchell",
    authorRole: "Founder & CEO",
    date: "January 5, 2026",
    readTime: "8 min read",
    category: "Industry Insights",
    image: "/images/career-growth.jpg",
    content: `
      <p>The executive recruitment landscape is undergoing a profound transformation. As artificial intelligence and data analytics become increasingly sophisticated, the way we identify, evaluate, and place top-tier talent is evolving at an unprecedented pace.</p>
      
      <h2>The Rise of AI in Executive Search</h2>
      <p>Artificial intelligence has moved from a buzzword to a practical tool in recruitment. Modern AI systems can analyze thousands of candidate profiles in seconds, identifying patterns and qualifications that might take human recruiters days to discover. But the question remains: can AI truly understand the nuances of executive leadership?</p>
      
      <p>The answer, as with most things in technology, is nuanced. AI excels at processing large volumes of data, identifying candidates with specific skills and experience, and predicting potential job fit based on historical patterns. However, the intangible qualities that define great leaders—emotional intelligence, cultural fit, vision, and the ability to inspire—remain firmly in the domain of human assessment.</p>
      
      <h2>Data-Driven Decision Making</h2>
      <p>Beyond AI, the broader trend toward data-driven decision making is reshaping how organizations approach executive hiring. Companies now have access to unprecedented amounts of information about candidates, from their digital footprint to detailed performance metrics from previous roles.</p>
      
      <p>This data can inform better decisions, but it also raises important questions about privacy, bias, and the risk of reducing complex human beings to a set of metrics. The most successful recruitment firms are those that use data as one input among many, rather than as the sole determinant of candidate quality.</p>
      
      <h2>The Irreplaceable Human Element</h2>
      <p>Despite all the technological advances, the human element remains irreplaceable in executive recruitment. The best recruiters bring decades of experience, deep industry knowledge, and finely tuned intuition to the table. They understand that a successful placement isn't just about matching skills to requirements—it's about understanding organizational culture, team dynamics, and the subtle factors that determine whether a leader will thrive.</p>
      
      <p>Moreover, the relationship between recruiter and candidate is built on trust. Executives making career-defining decisions need a trusted advisor who can provide honest counsel, not just an algorithm that ranks them against other candidates.</p>
      
      <h2>Looking Ahead</h2>
      <p>The future of executive recruitment will be defined by those who can effectively combine technological capabilities with human insight. The firms that succeed will be those that use AI and data to enhance, rather than replace, the expertise of their recruiters.</p>
      
      <p>At Talent Horizon, we're investing heavily in both technology and talent. We believe that the best outcomes come from combining cutting-edge tools with experienced professionals who understand that every executive placement is ultimately about people—their aspirations, their potential, and their ability to transform organizations.</p>
    `
  },
  "2": {
    id: "2",
    title: "10 Questions to Ask in Your Executive Interview",
    excerpt: "Make a lasting impression and gather crucial information with these strategic questions for C-suite interviews.",
    author: "Sarah Chen",
    authorRole: "President & Partner",
    date: "January 3, 2026",
    readTime: "5 min read",
    category: "Career Advice",
    image: "/images/team-collaboration.jpg",
    content: `
      <p>Executive interviews are a two-way street. While the hiring organization is evaluating you, you should also be assessing whether this opportunity aligns with your career goals and values. Here are ten strategic questions that will help you gather crucial information while demonstrating your executive mindset.</p>
      
      <h2>1. What does success look like in the first 90 days?</h2>
      <p>This question shows you're already thinking about impact and helps you understand the organization's immediate priorities and expectations.</p>
      
      <h2>2. What are the biggest challenges facing the organization right now?</h2>
      <p>Understanding the challenges helps you assess whether your skills and experience are a good match, and gives you insight into what you'll be walking into.</p>
      
      <h2>3. How would you describe the company culture?</h2>
      <p>Culture fit is crucial at the executive level. Listen carefully to how the interviewer describes the culture and whether it aligns with your working style.</p>
      
      <h2>4. What happened to the previous person in this role?</h2>
      <p>This can reveal important information about expectations, potential pitfalls, and organizational dynamics.</p>
      
      <h2>5. How does the board/leadership team make decisions?</h2>
      <p>Understanding decision-making processes helps you assess how effectively you'll be able to drive change and implement your vision.</p>
    `
  }
};

const defaultPost = {
  id: "0",
  title: "Article Not Found",
  excerpt: "",
  author: "Unknown",
  authorRole: "",
  date: "",
  readTime: "",
  category: "",
  image: "/images/hero-bg.jpg",
  content: "<p>This article could not be found.</p>"
};

const relatedPosts = [
  {
    id: "3",
    title: "Building a Diverse Leadership Team",
    category: "Leadership",
    image: "/images/executive-search.jpg"
  },
  {
    id: "4",
    title: "Remote Work in 2026",
    category: "Remote Work",
    image: "/images/about-hero.jpg"
  },
  {
    id: "5",
    title: "Salary Negotiation Strategies",
    category: "Career Advice",
    image: "/images/hero-bg.jpg"
  }
];

export default function BlogPost() {
  const params = useParams();
  const postId = params.id || "0";
  const post = postsData[postId] || defaultPost;

  const handleShare = (platform: string) => {
    toast.success(`Shared on ${platform}!`);
  };

  if (post.id === "0") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-navy mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-6">This article may have been removed or the link is incorrect.</p>
            <Link href="/blog">
              <Button className="bg-orange hover:bg-orange-dark text-white">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/50" />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Link href="/blog">
                <span className="inline-flex items-center text-white/70 hover:text-white mb-6 cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </span>
              </Link>

              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-orange" />
                <span className="text-orange font-medium">{post.category}</span>
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/70">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Article */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <div 
                  className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-navy prose-a:text-orange"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-600 font-medium">Share this article:</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleShare("LinkedIn")}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleShare("Twitter")}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleShare("Facebook")}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
                        >
                          <Facebook className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied!");
                          }}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-navy">{post.author}</h4>
                      <p className="text-orange text-sm mb-2">{post.authorRole}</p>
                      <p className="text-slate-600 text-sm">
                        Expert in executive recruitment with over 20 years of experience 
                        helping organizations build world-class leadership teams.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 space-y-8">
                  {/* Related Posts */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-display font-bold text-navy mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((related) => (
                        <Link key={related.id} href={`/blog/${related.id}`}>
                          <div className="flex gap-3 cursor-pointer group">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={related.image} 
                                alt={related.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="text-xs text-orange">{related.category}</span>
                              <h4 className="text-sm font-medium text-navy group-hover:text-orange transition-colors line-clamp-2">
                                {related.title}
                              </h4>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-navy rounded-xl p-6 text-white">
                    <h3 className="font-display font-bold mb-3">Looking for Your Next Role?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Browse our latest executive opportunities.
                    </p>
                    <Link href="/careers">
                      <Button className="w-full bg-orange hover:bg-orange-dark text-white">
                        View Open Positions
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
