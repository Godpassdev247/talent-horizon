/**
 * Interview Prep Page - Master Your Interviews
 * Comprehensive interview preparation guides and strategies
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Users, Video, MessageSquare, Target, CheckCircle2, ArrowRight,
  Clock, Star, Lightbulb, BookOpen, Play, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const interviewTypes = [
  {
    title: "Phone Screening",
    description: "Initial call with HR to assess basic qualifications and cultural fit.",
    duration: "15-30 minutes",
    tips: [
      "Find a quiet location with good reception",
      "Have your resume and the job description ready",
      "Prepare a brief elevator pitch",
      "Research the company beforehand"
    ],
    icon: MessageSquare
  },
  {
    title: "Video Interview",
    description: "Virtual face-to-face interview via Zoom, Teams, or similar platforms.",
    duration: "30-60 minutes",
    tips: [
      "Test your technology beforehand",
      "Choose a professional background",
      "Maintain eye contact with the camera",
      "Dress professionally from head to toe"
    ],
    icon: Video
  },
  {
    title: "In-Person Interview",
    description: "Traditional face-to-face meeting at the company's office.",
    duration: "45-90 minutes",
    tips: [
      "Arrive 10-15 minutes early",
      "Bring multiple copies of your resume",
      "Prepare questions for the interviewer",
      "Follow up with a thank-you note"
    ],
    icon: Users
  },
  {
    title: "Panel Interview",
    description: "Meeting with multiple interviewers simultaneously.",
    duration: "60-90 minutes",
    tips: [
      "Address each panel member when answering",
      "Make note of each person's name and role",
      "Maintain composure under pressure",
      "Send individual thank-you notes"
    ],
    icon: Target
  }
];

const behavioralQuestions = [
  {
    question: "Tell me about a time you faced a challenging situation at work.",
    category: "Problem Solving",
    starTip: "Focus on a specific challenge, your analytical approach, and the positive outcome."
  },
  {
    question: "Describe a situation where you had to work with a difficult colleague.",
    category: "Teamwork",
    starTip: "Emphasize your communication skills and ability to find common ground."
  },
  {
    question: "Give an example of a goal you set and how you achieved it.",
    category: "Achievement",
    starTip: "Choose a measurable goal and highlight your strategic planning."
  },
  {
    question: "Tell me about a time you made a mistake and how you handled it.",
    category: "Accountability",
    starTip: "Show self-awareness, ownership, and what you learned from the experience."
  },
  {
    question: "Describe a situation where you had to adapt to change quickly.",
    category: "Adaptability",
    starTip: "Demonstrate flexibility and a positive attitude toward change."
  },
  {
    question: "Tell me about a time you went above and beyond for a customer or colleague.",
    category: "Initiative",
    starTip: "Highlight your dedication and the impact of your extra effort."
  }
];

const technicalPrepTips = [
  {
    title: "Review Fundamentals",
    description: "Brush up on core concepts relevant to your field. For tech roles, review data structures, algorithms, and system design.",
    icon: BookOpen
  },
  {
    title: "Practice Coding",
    description: "Use platforms like LeetCode, HackerRank, or CodeSignal to practice problem-solving under time pressure.",
    icon: Target
  },
  {
    title: "Mock Interviews",
    description: "Practice with peers or use platforms like Pramp for realistic interview simulations.",
    icon: Users
  },
  {
    title: "Know Your Projects",
    description: "Be ready to discuss your past projects in detail, including challenges faced and solutions implemented.",
    icon: Award
  }
];

const starMethod = {
  S: { title: "Situation", description: "Set the scene and provide context for your story.", color: "bg-slate-600" },
  T: { title: "Task", description: "Describe your responsibility or the challenge you faced.", color: "bg-slate-500" },
  A: { title: "Action", description: "Explain the specific steps you took to address the situation.", color: "bg-slate-700" },
  R: { title: "Result", description: "Share the outcomes and what you learned from the experience.", color: "bg-slate-600" }
};

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState("types");

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
                <Users className="w-4 h-4" />
                Interview Preparation
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Ace Your <span className="text-orange">Next Interview</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Comprehensive guides, practice questions, and expert strategies to help you 
                confidently navigate any interview format.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                  <Play className="w-5 h-5 mr-2" />
                  Start Practicing
                </Button>
                <Link href="/jobs">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STAR Method Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <span className="text-orange font-medium mb-2 block">The STAR Method</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                  Structure Your Answers
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  The STAR method is a proven framework for answering behavioral interview 
                  questions with clear, compelling stories.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-6">
                {Object.entries(starMethod).map(([letter, data], index) => (
                  <motion.div
                    key={letter}
                    variants={fadeInUp}
                    className="relative"
                  >
                    <div className={`${data.color} rounded-xl p-6 text-white h-full`}>
                      <div className="text-5xl font-display font-bold mb-4 opacity-50">
                        {letter}
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2">
                        {data.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {data.description}
                      </p>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-16 bg-slate-50">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12">
                <TabsTrigger value="types">Interview Types</TabsTrigger>
                <TabsTrigger value="behavioral">Behavioral Q&A</TabsTrigger>
                <TabsTrigger value="technical">Technical Prep</TabsTrigger>
              </TabsList>

              {/* Interview Types Tab */}
              <TabsContent value="types">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {interviewTypes.map((type, index) => (
                    <motion.div
                      key={type.title}
                      variants={fadeInUp}
                      className="bg-white rounded-xl p-6 shadow-sm"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-navy">
                            {type.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <Clock className="w-4 h-4" />
                            {type.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-4">
                        {type.description}
                      </p>
                      <div className="space-y-2">
                        {type.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* Behavioral Questions Tab */}
              <TabsContent value="behavioral">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp} className="text-center mb-8">
                    <h2 className="font-display text-2xl font-bold text-navy mb-2">
                      Common Behavioral Questions
                    </h2>
                    <p className="text-slate-600">
                      Practice these questions using the STAR method to prepare compelling answers.
                    </p>
                  </motion.div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {behavioralQuestions.map((item, index) => (
                      <motion.div key={index} variants={fadeInUp}>
                        <AccordionItem value={`item-${index}`} className="bg-white rounded-xl border-0 shadow-sm">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <div className="flex items-start gap-4 text-left">
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                {item.category}
                              </span>
                              <span className="font-medium text-navy">{item.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                              <Lightbulb className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-sm font-medium text-navy">STAR Tip:</span>
                                <p className="text-sm text-slate-600 mt-1">{item.starTip}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </motion.div>
              </TabsContent>

              {/* Technical Prep Tab */}
              <TabsContent value="technical">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp} className="text-center mb-8">
                    <h2 className="font-display text-2xl font-bold text-navy mb-2">
                      Technical Interview Preparation
                    </h2>
                    <p className="text-slate-600">
                      Strategies and resources to help you succeed in technical interviews.
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {technicalPrepTips.map((tip, index) => (
                      <motion.div
                        key={tip.title}
                        variants={fadeInUp}
                        className="bg-white rounded-xl p-6 shadow-sm"
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
                    className="bg-navy rounded-2xl p-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-white mb-4">
                          Practice Makes Perfect
                        </h3>
                        <p className="text-white/80 mb-6">
                          The best way to prepare for technical interviews is consistent practice. 
                          Set aside time each day to solve problems and review concepts.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-white/80">
                            <CheckCircle2 className="w-5 h-5 text-orange" />
                            <span>Start with easy problems and progress to hard</span>
                          </div>
                          <div className="flex items-center gap-3 text-white/80">
                            <CheckCircle2 className="w-5 h-5 text-orange" />
                            <span>Time yourself to simulate real conditions</span>
                          </div>
                          <div className="flex items-center gap-3 text-white/80">
                            <CheckCircle2 className="w-5 h-5 text-orange" />
                            <span>Review solutions even when you solve correctly</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="inline-block bg-white/10 rounded-2xl p-8">
                          <div className="text-6xl font-display font-bold text-orange mb-2">
                            30
                          </div>
                          <p className="text-white/80">
                            minutes of daily practice can significantly improve your performance
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-navy mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-slate-600 mb-8">
                You've prepared for the interview. Now find the perfect opportunity 
                to showcase your skills.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/jobs">
                  <Button size="lg" className="bg-orange hover:bg-orange-dark text-white">
                    Browse Jobs
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/resources/resume-tips">
                  <Button size="lg" variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                    Resume Tips
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
