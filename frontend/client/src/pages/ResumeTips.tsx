/**
 * Resume Tips Page - Expert Resume Writing Guidance
 * Comprehensive resume tips, templates, and ATS optimization guides
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  FileText, Download, CheckCircle2, ArrowRight, Star, 
  Eye, Target, Zap, BookOpen, AlertCircle, Lightbulb
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

const resumeSections = [
  {
    title: "Contact Information",
    tips: [
      "Include full name, phone number, professional email, and LinkedIn URL",
      "Add city and state (full address not necessary)",
      "Use a professional email address (firstname.lastname@email.com)",
      "Ensure all contact information is current and accurate"
    ]
  },
  {
    title: "Professional Summary",
    tips: [
      "Write 2-3 sentences highlighting your key qualifications",
      "Include years of experience and main areas of expertise",
      "Mention 1-2 notable achievements with metrics",
      "Tailor to the specific job you're applying for"
    ]
  },
  {
    title: "Work Experience",
    tips: [
      "List positions in reverse chronological order",
      "Use action verbs to start each bullet point",
      "Quantify achievements with numbers and percentages",
      "Focus on accomplishments, not just responsibilities"
    ]
  },
  {
    title: "Skills Section",
    tips: [
      "Include both technical and soft skills",
      "Match skills to the job description keywords",
      "Organize by category (Technical, Leadership, etc.)",
      "Be honest about proficiency levels"
    ]
  },
  {
    title: "Education",
    tips: [
      "List degrees in reverse chronological order",
      "Include relevant coursework for recent graduates",
      "Add certifications and professional development",
      "GPA only if 3.5+ and within last 3 years"
    ]
  }
];

const actionVerbs = {
  "Leadership": ["Led", "Managed", "Directed", "Supervised", "Coordinated", "Mentored", "Guided", "Oversaw"],
  "Achievement": ["Achieved", "Exceeded", "Delivered", "Accomplished", "Attained", "Surpassed", "Earned", "Won"],
  "Communication": ["Presented", "Negotiated", "Collaborated", "Authored", "Communicated", "Influenced", "Persuaded"],
  "Technical": ["Developed", "Engineered", "Programmed", "Designed", "Implemented", "Built", "Created", "Optimized"],
  "Analysis": ["Analyzed", "Evaluated", "Assessed", "Researched", "Investigated", "Identified", "Measured", "Tracked"],
  "Improvement": ["Improved", "Enhanced", "Streamlined", "Increased", "Reduced", "Transformed", "Revamped", "Modernized"]
};

const commonMistakes = [
  {
    mistake: "Using generic objective statements",
    fix: "Write a targeted professional summary with specific achievements"
  },
  {
    mistake: "Including irrelevant work experience",
    fix: "Focus on roles and achievements relevant to your target position"
  },
  {
    mistake: "Listing duties instead of accomplishments",
    fix: "Use metrics and results to showcase your impact"
  },
  {
    mistake: "Using passive language",
    fix: "Start bullet points with strong action verbs"
  },
  {
    mistake: "Submitting the same resume for every job",
    fix: "Customize your resume for each application"
  },
  {
    mistake: "Ignoring ATS optimization",
    fix: "Use standard formatting and include relevant keywords"
  }
];

const atsOptimization = [
  {
    title: "Use Standard Formatting",
    description: "Stick to common fonts (Arial, Calibri, Times New Roman), avoid tables, graphics, and headers/footers.",
    icon: FileText
  },
  {
    title: "Include Keywords",
    description: "Mirror the exact language from the job description for skills, tools, and qualifications.",
    icon: Target
  },
  {
    title: "Use Standard Section Headers",
    description: "Use conventional headers like 'Work Experience', 'Education', 'Skills' that ATS systems recognize.",
    icon: CheckCircle2
  },
  {
    title: "Save in the Right Format",
    description: "Submit as .docx or .pdf unless otherwise specified. Some older ATS prefer .docx.",
    icon: Download
  }
];

export default function ResumeTips() {
  const [activeTab, setActiveTab] = useState("sections");

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
              <Link href="/resources">
                <span className="text-white/60 hover:text-white text-sm mb-4 inline-block">
                  ← Back to Resources
                </span>
              </Link>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/20 text-orange rounded-full text-sm font-medium mb-6">
                <FileText className="w-4 h-4" />
                Resume Writing Guide
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Create a <span className="text-orange">Winning Resume</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Expert tips, templates, and strategies to craft a resume that gets noticed 
                by recruiters and passes ATS screening.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                  <Download className="w-5 h-5 mr-2" />
                  Download Templates
                </Button>
                <Link href="/dashboard/resumes">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Upload Your Resume
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
                <TabsTrigger value="sections">Resume Sections</TabsTrigger>
                <TabsTrigger value="verbs">Action Verbs</TabsTrigger>
                <TabsTrigger value="mistakes">Common Mistakes</TabsTrigger>
                <TabsTrigger value="ats">ATS Tips</TabsTrigger>
              </TabsList>

              {/* Resume Sections Tab */}
              <TabsContent value="sections">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="space-y-8"
                >
                  {resumeSections.map((section, index) => (
                    <motion.div
                      key={section.title}
                      variants={fadeInUp}
                      className="bg-slate-50 rounded-xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <h3 className="font-display text-xl font-bold text-navy">
                          {section.title}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-600">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* Action Verbs Tab */}
              <TabsContent value="verbs">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp} className="text-center mb-8">
                    <h2 className="font-display text-2xl font-bold text-navy mb-2">
                      Power Words for Your Resume
                    </h2>
                    <p className="text-slate-600">
                      Start your bullet points with these strong action verbs to make an impact.
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(actionVerbs).map(([category, verbs]) => (
                      <motion.div
                        key={category}
                        variants={fadeInUp}
                        className="bg-slate-50 rounded-xl p-6"
                      >
                        <h3 className="font-display font-bold text-navy mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-slate-500" />
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {verbs.map((verb) => (
                            <span
                              key={verb}
                              className="px-3 py-1 bg-white text-slate-600 text-sm rounded-full border border-slate-200"
                            >
                              {verb}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Common Mistakes Tab */}
              <TabsContent value="mistakes">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="space-y-6"
                >
                  <motion.div variants={fadeInUp} className="text-center mb-8">
                    <h2 className="font-display text-2xl font-bold text-navy mb-2">
                      Avoid These Resume Mistakes
                    </h2>
                    <p className="text-slate-600">
                      Learn from common errors and how to fix them.
                    </p>
                  </motion.div>

                  {commonMistakes.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="bg-slate-50 rounded-xl p-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
                              Mistake
                            </span>
                            <p className="text-slate-700 font-medium mt-1">{item.mistake}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Solution
                            </span>
                            <p className="text-slate-700 font-medium mt-1">{item.fix}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* ATS Tips Tab */}
              <TabsContent value="ats">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp} className="text-center mb-8">
                    <h2 className="font-display text-2xl font-bold text-navy mb-2">
                      Beat the ATS
                    </h2>
                    <p className="text-slate-600">
                      Applicant Tracking Systems filter resumes before humans see them. 
                      Here's how to pass the screening.
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {atsOptimization.map((tip, index) => (
                      <motion.div
                        key={tip.title}
                        variants={fadeInUp}
                        className="bg-slate-50 rounded-xl p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <tip.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-navy mb-2">
                              {tip.title}
                            </h3>
                            <p className="text-slate-600 text-sm">
                              {tip.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    variants={fadeInUp}
                    className="bg-navy rounded-2xl p-8 text-center"
                  >
                    <Eye className="w-12 h-12 text-orange mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold text-white mb-3">
                      Get Your Resume Reviewed
                    </h3>
                    <p className="text-white/80 mb-6 max-w-xl mx-auto">
                      Upload your resume and get instant feedback on ATS compatibility, 
                      formatting, and content optimization.
                    </p>
                    <Link href="/dashboard/resumes">
                      <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                        Upload Resume
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-slate-50">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-navy mb-4">
                Ready to Apply?
              </h2>
              <p className="text-slate-600 mb-8">
                Put your polished resume to work. Browse thousands of opportunities 
                and find your perfect match.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/jobs">
                  <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                    Browse Jobs
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/resources/interview-prep">
                  <Button size="lg" variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                    Interview Prep
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
