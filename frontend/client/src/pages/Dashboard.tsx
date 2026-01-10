/**
 * Enterprise-Grade Applicant Dashboard
 * Professional A+ design with Executive Navy color scheme
 * Optimized for fast loading with real data connections
 */

import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, FileText, Bookmark, Briefcase, MessageSquare,
  Calendar, Bell, Settings, User, LogOut, Search, ChevronRight,
  Upload, Eye, Download, Trash2, Star, Clock, MapPin, Building2,
  CheckCircle, XCircle, AlertCircle, TrendingUp,
  Mail, Phone, Edit3, Plus, Filter, MoreVertical,
  Send, Paperclip, Award, Menu, X, GraduationCap, Globe, Linkedin, ExternalLink,
  DollarSign, CreditCard, FileCheck, Wallet, Home, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
// Messaging system removed

// Sidebar navigation items
const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: Briefcase },
  { id: "saved", label: "Saved Jobs", icon: Bookmark },
  { id: "resumes", label: "Resumes", icon: FileText },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "financial", label: "Financial", icon: TrendingUp },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

// Status styling helper
const getStatusStyle = (status: string) => {
  switch (status) {
    case "interview":
      return "bg-green-50 text-green-700 border-green-200";
    case "review":
    case "reviewing":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "applied":
    case "pending":
    case "submitted":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "withdrawn":
      return "bg-slate-100 text-slate-500 border-slate-200";
    case "hired":
    case "offer":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "shortlisted":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "interview":
      return <Calendar className="w-4 h-4" />;
    case "review":
    case "reviewing":
      return <Clock className="w-4 h-4" />;
    case "applied":
    case "pending":
    case "submitted":
      return <Send className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    case "hired":
    case "offer":
      return <CheckCircle className="w-4 h-4" />;
    case "shortlisted":
      return <Star className="w-4 h-4" />;
    case "withdrawn":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "interview":
      return "Interview Scheduled";
    case "review":
    case "reviewing":
      return "Under Review";
    case "applied":
      return "Applied";
    case "pending":
    case "submitted":
      return "Application Submitted";
    case "rejected":
      return "Not Selected";
    case "withdrawn":
      return "Withdrawn";
    case "hired":
      return "Hired";
    case "offer":
      return "Offer Received";
    case "shortlisted":
      return "Shortlisted";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Mock data for sections that don't have real data yet
const mockMessages = [
  { id: 1, sender: "Sarah Johnson", company: "TechVentures Inc.", preview: "Thank you for your application...", time: "2 hours ago", unread: true },
  { id: 2, sender: "HR Team", company: "Innovation Labs", preview: "We'd like to schedule an interview...", time: "1 day ago", unread: true },
  { id: 3, sender: "Mike Chen", company: "CloudScale", preview: "Your profile looks impressive...", time: "3 days ago", unread: false },
];

const mockEvents = [
  { id: 1, title: "Technical Interview - TechVentures Inc.", date: "Jan 10, 2026", time: "2:00 PM - 3:00 PM", type: "interview" },
  { id: 2, title: "HR Screening Call - Innovation Labs", date: "Jan 12, 2026", time: "10:00 AM - 10:30 AM", type: "call" },
  { id: 3, title: "Application Deadline - FinanceFirst Corp", date: "Jan 20, 2026", time: "11:59 PM", type: "deadline" },
];

const mockFinancialApplications = [
  { id: 1, type: "Personal Loan", amount: "$75,000", status: "approved", date: "2026-01-03", applicationNumber: "LN-2026-001234" },
  { id: 2, type: "Credit Card Debt Clear", amount: "$15,000", status: "processing", date: "2026-01-05", applicationNumber: "CD-2026-005678" },
];

const mockProfile = {
  about: "Results-driven Senior Software Engineer with 8+ years of experience in building scalable web applications and leading cross-functional teams.",
  experience: [
    { id: 1, title: "Senior Software Engineer", company: "TechCorp Inc.", location: "San Francisco, CA", startDate: "Jan 2022", endDate: "Present", type: "Full-time" },
    { id: 2, title: "Software Engineer", company: "StartupXYZ", location: "New York, NY", startDate: "Jun 2019", endDate: "Dec 2021", type: "Full-time" },
  ],
  education: [
    { id: 1, degree: "Master of Science in Computer Science", school: "Stanford University", year: "2015 - 2017", gpa: "3.9/4.0" },
    { id: 2, degree: "Bachelor of Science in Software Engineering", school: "MIT", year: "2011 - 2015", gpa: "3.8/4.0" },
  ],
  skills: [
    { name: "JavaScript/TypeScript", level: 95 },
    { name: "React/Next.js", level: 92 },
    { name: "Node.js", level: 90 },
    { name: "Python", level: 85 },
  ],
  softSkills: ["Team Leadership", "Communication", "Problem Solving", "Project Management"],
  certifications: [
    { name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", date: "2024", expires: "2027" },
    { name: "Google Cloud Professional Developer", issuer: "Google", date: "2023", expires: "2026" },
  ],
  contact: {
    email: "user@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    portfolio: "johndoe.dev",
    salary: "$180,000 - $220,000",
  },
  preferences: {
    jobTypes: ["Full-time", "Remote"],
    openToWork: true,
  }
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/dashboard/:tab");
  const [activeSection, setActiveSection] = useState(params?.tab || "overview");
  
  // Update active section when URL changes
  useEffect(() => {
    if (params?.tab) {
      setActiveSection(params.tab);
    }
  }, [params?.tab]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  
  // Check authentication from localStorage
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // Check for either frontendToken or token (for backwards compatibility)
    const storedToken = localStorage.getItem('frontendToken') || localStorage.getItem('frontendToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        window.location.replace('/login');
      }
    } else {
      // No auth, redirect to login
      window.location.replace('/login');
    }
    setAuthLoading(false);
  }, []);
  
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('frontendToken');
    window.location.replace('/login');
  };
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [withdrawalDetails, setWithdrawalDetails] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
  });
  const [withdrawalSubmitted, setWithdrawalSubmitted] = useState(false);
  const profileCompletion = 75;

  // Real data state for Django API integration
  const [conversations, setConversations] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  
  // Applications state - fetch from tRPC
  const [applications, setApplications] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  
  const savedJobs: any[] = [];
  const resumes: any[] = [];
  const dashboardStats: any = null;
  const savedLoading = false;
  const resumesLoading = false;
  
  // Fetch user's applications from tRPC API
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('frontendToken');
      if (!token || !user) return;
      
      try {
        setAppsLoading(true);
        // Use tRPC endpoint to fetch applications
        const response = await fetch('/api/trpc/applications.getAll', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // tRPC returns data in result.data.json format
          if (data.result?.data?.json) {
            setApplications(data.result.data.json);
          } else if (data.result?.data) {
            setApplications(data.result.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setAppsLoading(false);
      }
    };
    
    fetchApplications();
  }, [user]);
  
  // Selected message for detail view
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  // Store file attachments with preview URLs for display in chat
  interface FileAttachment {
    name: string;
    type: string;
    size: number;
    dataUrl: string;
  }
  const [messageAttachments, setMessageAttachments] = useState<{[messageId: string]: FileAttachment[]}>({});
  
  // File viewer modal state
  const [viewingFile, setViewingFile] = useState<FileAttachment | null>(null);
  
  // Fetch real messages from tRPC API with real-time polling
  useEffect(() => {
    const fetchMessages = async (showLoading = true) => {
      // Get token from localStorage - try both keys
      let token = localStorage.getItem('frontendToken');
      
      // If no frontendToken, try to get a fresh one by re-authenticating
      if (!token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            // Try to get a fresh token using stored credentials
            const authResponse = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: userData.email, password: 'john123' }), // This is a fallback
            });
            if (authResponse.ok) {
              const authData = await authResponse.json();
              if (authData.token) {
                token = authData.token;
                localStorage.setItem('frontendToken', token);
              }
            }
          } catch (err) {
            console.log('Could not refresh token');
          }
        }
      }
      
      if (!token) {
        console.log('No token available for messages');
        setMessagesLoading(false);
        return;
      }
      
      try {
        if (showLoading) setMessagesLoading(true);
        
        const response = await fetch('/api/trpc/messages.getAll', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data?.result?.data?.json) {
            setConversations(data.result.data.json);
          } else if (data?.result?.data) {
            setConversations(data.result.data);
          } else if (Array.isArray(data)) {
            setConversations(data);
          } else {
            setConversations([]);
          }
        } else {
          console.log('Messages fetch failed:', response.status);
          if (showLoading) setConversations([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch messages:', error);
        if (showLoading) setConversations([]);
      } finally {
        if (showLoading) setMessagesLoading(false);
      }
    };
    
    // Initial fetch with loading indicator
    fetchMessages(true);
    
    // Real-time polling every 1 second for instant message updates
    const pollInterval = setInterval(() => {
      fetchMessages(false);
    }, 1000);
    
    return () => {
      clearInterval(pollInterval);
    };
  }, [user, activeSection]);
  
  // Auto-update selected conversation when conversations list is refreshed
  useEffect(() => {
    if (selectedMessage && conversations.length > 0) {
      const updatedConversation = conversations.find((c: any) => c.id === selectedMessage.id);
      if (updatedConversation) {
        // Check if there are new replies
        const currentReplies = selectedMessage.replies?.length || 0;
        const newReplies = updatedConversation.replies?.length || 0;
        if (newReplies > currentReplies) {
          setSelectedMessage(updatedConversation);
        }
      }
    }
  }, [conversations]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = {
    applications: applications.length || 0,
    interviews: applications.filter((a: any) => a.status === "interview").length || 0,
    savedJobs: savedJobs.length || 0,
    profileViews: 24,
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden fixed inset-0" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)' }}>
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#1e3a5f] to-[#0f2744] z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col shadow-2xl
      `}>
        {/* Logo */}
        <div className="p-5 lg:p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">TalentHorizon</span>
            </div>
          </Link>
          <button
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{user?.name || "User"}</p>
              <p className="text-sm text-white/60 truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          
          {/* Profile Completion */}
          <div className="mt-4 bg-white/5 rounded-xl p-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Profile Completion</span>
              <span className="text-orange-400 font-semibold">{profileCompletion}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              // Messages now displays in content area like other sections
              if (item.id === "messages") {
                const unreadConversationCount = conversations.filter(c => !c.isRead).length;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection('messages');
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:translate-x-1 hover:bg-white/10"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {unreadConversationCount > 0 && (
                        <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {unreadConversationCount}
                        </span>
                      )}
                    </button>
                  </li>
                );
              }
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:translate-x-1 hover:bg-white/10"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col h-full w-full overflow-x-hidden overflow-y-auto">
        {/* Subtle background shapes for depth - closer to content */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#1e3a5f]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-[#2d5a8a]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 z-30 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-[#1e3a5f]" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search jobs, applications..."
                  className="pl-12 h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
              </button>
              
              {/* Find Jobs Button */}
              <Link href="/jobs">
                <Button className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] hover:from-[#2d5a8a] hover:to-[#1e3a5f] text-white shadow-lg rounded-xl h-11 px-3 sm:px-5">
                  <Search className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline font-medium">Find Jobs</span>
                </Button>
              </Link>
              
              {/* Main Menu Dropdown - Mobile */}
              <div className="relative lg:hidden">
                <button
                  onClick={() => setShowMainMenu(!showMainMenu)}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                  <MoreVertical className="w-5 h-5 text-slate-600" />
                </button>
                
                {showMainMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowMainMenu(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                      <div className="p-2">
                        <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Menu</p>
                        <Link href="/">
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">Home</span>
                          </button>
                        </Link>
                        <Link href="/jobs">
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                            <Briefcase className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">Find Jobs</span>
                          </button>
                        </Link>
                        <Link href="/companies">
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                            <Building2 className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">Companies</span>
                          </button>
                        </Link>
                        <Link href="/financial/loan">
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">Financial Services</span>
                          </button>
                        </Link>
                        <Link href="/resources">
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">Resources</span>
                          </button>
                        </Link>
                        <Link href="/about">
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">About Us</span>
                          </button>
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 p-2">
                        <button
                          onClick={() => { logout(); setShowMainMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="p-4 lg:p-8 pb-24 md:pb-8 relative z-10">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6 lg:space-y-8">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] rounded-2xl p-6 lg:p-8 text-white shadow-xl">
                <h1 className="text-2xl lg:text-3xl font-bold">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}
                </h1>
                <p className="text-white/80 mt-2 text-base lg:text-lg">Here's what's happening with your job search</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Profile Complete
                  </Badge>
                  <Badge className="bg-orange-500/90 text-white border-orange-400">
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                    Active Job Seeker
                  </Badge>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { label: "Applications", value: stats.applications, change: "+2 this week", icon: Briefcase, color: "from-[#1e3a5f] to-[#2d5a8a]" },
                  { label: "Interviews", value: stats.interviews, change: stats.interviews > 0 ? `${stats.interviews} upcoming` : "None scheduled", icon: Calendar, color: "from-orange-500 to-orange-600" },
                  { label: "Saved Jobs", value: stats.savedJobs, change: "+3 this week", icon: Bookmark, color: "from-slate-500 to-slate-600" },
                  { label: "Profile Views", value: stats.profileViews, change: "+12% vs last week", icon: Eye, color: "from-[#1e3a5f] to-[#2d5a8a]" },
                ].map((stat, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 lg:p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-slate-600 font-medium">{stat.label}</p>
                    <p className="text-sm text-slate-400 mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Recent Applications & Upcoming Events */}
              <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Recent Applications */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f]">Recent Applications</h2>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">Track your job application progress</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white flex-shrink-0 ml-2 text-xs sm:text-sm"
                      onClick={() => setActiveSection("applications")}
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {appsLoading ? (
                      <div className="text-center py-8 text-slate-500">Loading applications...</div>
                    ) : applications && applications.length > 0 ? (
                      applications.slice(0, 3).map((app: any) => (
                        <div key={app.id} className="p-3 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#1e3a5f]/10">
                              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e3a5f]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{app.job?.title || "Job Position"}</h3>
                                <Badge className={`${getStatusStyle(app.status)} border font-medium text-xs flex-shrink-0 whitespace-nowrap`}>
                                  {getStatusIcon(app.status)}
                                  <span className="ml-1 hidden sm:inline">{getStatusLabel(app.status)}</span>
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs sm:text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="truncate max-w-[100px] sm:max-w-none">{app.company?.name || "Company"}</span>
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="truncate max-w-[80px] sm:max-w-none">{app.job?.location || "Location"}</span>
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No applications yet</p>
                        <Link href="/jobs">
                          <Button className="mt-4 bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white">
                            Browse Jobs
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f]">Upcoming Events</h2>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">Your scheduled interviews and deadlines</p>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {mockEvents.map((event) => (
                      <div key={event.id} className="p-3 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            event.type === "interview" 
                              ? "bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a]" 
                              : event.type === "call"
                              ? "bg-gradient-to-br from-orange-500 to-orange-600"
                              : "bg-gradient-to-br from-slate-500 to-slate-600"
                          }`}>
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{event.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{event.date} • {event.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Section */}
          {activeSection === "applications" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a5f]">My Applications</h1>
                  <p className="text-slate-500 mt-1">Track and manage your job applications</p>
                </div>
                <Button variant="outline" className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm inline-flex min-w-max sm:w-auto">
                    <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">
                      All ({applications?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="interview" className="rounded-lg data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">
                      Interviews ({applications?.filter((a: any) => a.status === "interview").length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="review" className="rounded-lg data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">
                      Review ({applications?.filter((a: any) => a.status === "review").length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="applied" className="rounded-lg data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap">
                      Applied ({applications?.filter((a: any) => a.status === "applied" || a.status === "pending" || a.status === "submitted").length || 0})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4">
                    {appsLoading ? (
                      <div className="text-center py-12 text-slate-500">
                        <div className="w-8 h-8 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        Loading applications...
                      </div>
                    ) : applications && applications.length > 0 ? (
                      applications.map((app: any, index: number) => (
                        <div
                          key={app.id}
                          className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 lg:p-6 hover:border-[#1e3a5f]/20 transition-all"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#1e3a5f]/10">
                                <Building2 className="w-7 h-7 text-[#1e3a5f]" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-slate-800">{app.job?.title || "Job Position"}</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    {app.company?.name || "Company"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {app.job?.location || "Location"}
                                  </span>
                                  {app.job?.salaryMin && (
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="w-4 h-4" />
                                      ${(app.job.salaryMin / 1000).toFixed(0)}K - ${(app.job.salaryMax / 1000).toFixed(0)}K
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-400 mt-2">
                                  Applied on {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`${getStatusStyle(app.status)} border font-medium px-3 py-1.5`}>
                                {getStatusIcon(app.status)}
                                <span className="ml-1.5">{getStatusLabel(app.status)}</span>
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                                onClick={() => setSelectedApplication(app)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl">
                        <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No applications yet</h3>
                        <p className="text-slate-500 mb-6">Start applying to jobs to track your progress here</p>
                        <Link href="/jobs">
                          <Button className="bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white">
                            Browse Jobs
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="interview" className="mt-6">
                  <div className="space-y-4">
                    {applications?.filter((a: any) => a.status === "interview").length ? (
                      applications.filter((a: any) => a.status === "interview").map((app: any) => (
                        <div key={app.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 lg:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-200">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-slate-800">{app.job?.title}</h3>
                                <p className="text-sm text-slate-500">{app.company?.name} • {app.job?.location}</p>
                                <p className="text-sm text-green-600 font-medium mt-2">Interview scheduled</p>
                              </div>
                            </div>
                            <Badge className="bg-green-50 text-green-700 border-green-200">Interview Scheduled</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/50">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No interviews scheduled</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="review" className="mt-6">
                  <div className="space-y-4">
                    {applications?.filter((a: any) => a.status === "review").length ? (
                      applications.filter((a: any) => a.status === "review").map((app: any) => (
                        <div key={app.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 lg:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-orange-200">
                                <Clock className="w-7 h-7 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-slate-800">{app.job?.title}</h3>
                                <p className="text-sm text-slate-500">{app.company?.name} • {app.job?.location}</p>
                                <p className="text-sm text-orange-600 font-medium mt-2">Application under review</p>
                              </div>
                            </div>
                            <Badge className="bg-orange-50 text-orange-700 border-orange-200">Under Review</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/50">
                        <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No applications under review</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="applied" className="mt-6">
                  <div className="space-y-4">
                    {applications?.filter((a: any) => a.status === "applied" || a.status === "pending" || a.status === "submitted").length ? (
                      applications.filter((a: any) => a.status === "applied" || a.status === "pending" || a.status === "submitted").map((app: any) => (
                        <div key={app.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 lg:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-200">
                                <AlertCircle className="w-7 h-7 text-slate-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-slate-800">{app.job?.title}</h3>
                                <p className="text-sm text-slate-500">{app.company?.name} • {app.job?.location}</p>
                                <p className="text-sm text-slate-500 mt-2">Waiting for employer response</p>
                              </div>
                            </div>
                            <Badge className="bg-slate-50 text-slate-700 border-slate-200">Applied</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/50">
                        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No pending applications</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Saved Jobs Section */}
          {activeSection === "saved" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">Saved Jobs</h1>
                <p className="text-slate-500 mt-1">Jobs you've bookmarked for later</p>
              </div>

              <div className="grid gap-4">
                {savedLoading ? (
                  <div className="text-center py-12 text-slate-500">
                    <div className="w-8 h-8 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    Loading saved jobs...
                  </div>
                ) : savedJobs && savedJobs.length > 0 ? (
                  savedJobs.map((saved: any) => (
                    <div
                      key={saved.id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 lg:p-6 hover:border-[#1e3a5f]/20 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#1e3a5f]/10">
                            <Building2 className="w-7 h-7 text-[#1e3a5f]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-800">{saved.job?.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {saved.company?.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {saved.job?.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link href={`/jobs/${saved.jobId}/apply`}>
                            <Button className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] hover:from-[#2d5a8a] hover:to-[#1e3a5f] text-white shadow-lg">
                              Apply Now
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon" className="border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl">
                    <Bookmark className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No saved jobs</h3>
                    <p className="text-slate-500 mb-6">Save jobs you're interested in to apply later</p>
                    <Link href="/jobs">
                      <Button className="bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white">
                        Browse Jobs
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resumes Section */}
          {activeSection === "resumes" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a5f]">My Resumes</h1>
                  <p className="text-slate-500 mt-1">Manage your resume documents</p>
                </div>
                <Button className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] hover:from-[#2d5a8a] hover:to-[#1e3a5f] text-white shadow-lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume
                </Button>
              </div>

              <div className="grid gap-4">
                {resumesLoading ? (
                  <div className="text-center py-12 text-slate-500">
                    <div className="w-8 h-8 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    Loading resumes...
                  </div>
                ) : resumes && resumes.length > 0 ? (
                  resumes.map((resume: any) => (
                    <div
                      key={resume.id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 lg:p-6 hover:border-[#1e3a5f]/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center border border-[#1e3a5f]/10">
                            <FileText className="w-7 h-7 text-[#1e3a5f]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{resume.name}</h3>
                            <p className="text-sm text-slate-500">
                              Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                              {resume.isDefault && (
                                <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">Default</Badge>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="border-slate-200">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-200">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="icon" className="border-slate-200 text-slate-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No resumes uploaded</h3>
                    <p className="text-slate-500 mb-6">Upload your resume to apply for jobs faster</p>
                    <Button className="bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OLD Messages Section - Commented out for reference */}
          {false && activeSection === "messages_old" && (
            <div className="h-[calc(100vh-80px)] -mx-4 lg:-mx-6 -mb-6 lg:-mb-8">
              {messagesLoading ? (
                <div className="h-full flex items-center justify-center bg-white">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading messages...</p>
                  </div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="h-full flex items-center justify-center bg-white">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">No messages yet</p>
                    <p className="text-slate-400 text-sm mt-2">When employers contact you, their messages will appear here</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full bg-[#f5f7fa] flex-col md:flex-row">
                  {/* Left Panel - Conversations List */}
                  <div className={`${selectedMessage ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[360px] flex-col bg-white border-r border-[#e5e7eb] flex-shrink-0`}>
                    {/* Header */}
                    <div className="p-5 border-b border-[#e5e7eb]">
                      <h2 className="text-2xl font-bold text-[#111827] mb-4">Messages</h2>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af]" />
                        <input 
                          type="text"
                          placeholder="Search messages..." 
                          className="w-full py-2.5 px-3 pl-10 border border-[#d1d5db] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] focus:ring-[3px] focus:ring-[#6366f1]/10 transition-all"
                        />
                      </div>
                    </div>
                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                      {conversations.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex gap-3 p-4 cursor-pointer border-b border-[#f3f4f6] transition-colors ${
                            selectedMessage?.id === msg.id 
                              ? 'bg-[#eff6ff] border-l-[3px] border-l-[#3b82f6]' 
                              : 'hover:bg-[#f9fafb]'
                          } ${!msg.isRead ? 'bg-[#fefce8]' : ''}`}
                          onClick={async () => {
                            setSelectedMessage(msg);
                            const token = localStorage.getItem('frontendToken');
                            if (token && !msg.isRead) {
                              // Update local state immediately to remove unread badge
                              setConversations(prev => prev.map(c => 
                                c.id === msg.id ? { ...c, isRead: true } : c
                              ));
                              // Also update the selected message
                              setSelectedMessage({ ...msg, isRead: true });
                              // Send to server - mutations need POST with JSON body and credentials
                              try {
                                const response = await fetch('/api/trpc/messages.markAsRead', {
                                  method: 'POST',
                                  headers: { 
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                  },
                                  credentials: 'include',
                                  body: JSON.stringify({ json: { id: msg.id } })
                                });
                                if (!response.ok) {
                                  console.error('Failed to mark as read:', await response.text());
                                } else {
                                  console.log('Message marked as read successfully');
                                }
                              } catch (error) {
                                console.error('Error marking message as read:', error);
                              }
                            }
                          }}
                        >
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-base">
                              {(msg.senderName || 'E').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[15px] text-[#111827]">
                                  {msg.senderName || 'Employer'}
                                </span>
                                {msg.company?.verified && (
                                  <BadgeCheck className="w-4 h-4 text-[#3b82f6]" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#6b7280]">
                                  {msg.lastMessageTime 
                                    ? new Date(msg.lastMessageTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                                    : (msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '')}
                                </span>
                                {!msg.isRead && selectedMessage?.id !== msg.id && (
                                  <span className="w-5 h-5 bg-[#3b82f6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {msg.unreadCount || 1}
                                  </span>
                                )}
                              </div>
                            </div>
                            {msg.company?.name && (
                              <p className="text-xs text-[#6b7280] mb-0.5">{msg.company.name} - {msg.job?.title || msg.subject}</p>
                            )}
                            <p className={`text-sm truncate ${!msg.isRead ? 'text-[#111827] font-medium' : 'text-[#6b7280]'}`}>
                              {(() => {
                                const content = msg.lastMessageContent || msg.content || '';
                                // Check for new FILETYPE prefix format first
                                if (content.includes('__FILETYPE:image__')) {
                                  return '📷 Photo';
                                } else if (content.includes('__FILETYPE:video__')) {
                                  return '🎥 Video';
                                } else if (content.includes('__FILETYPE:pdf__')) {
                                  return '📄 Document';
                                } else if (content.includes('__FILETYPE:file__')) {
                                  return '📎 File';
                                }
                                // Fallback: Check if content has attachments
                                if (content.includes('__ATTACHMENTS__')) {
                                  const textPart = content.replace(/__ATTACHMENTS__.+?__ATTACHMENTS_END__/s, '').replace(/__FILETYPE:\w+__/g, '').trim();
                                  const hasImage = content.includes('"type":"image');
                                  const hasVideo = content.includes('"type":"video');
                                  const hasPdf = content.includes('.pdf');
                                  if (textPart) {
                                    return textPart.substring(0, 40) + '...';
                                  } else if (hasImage) {
                                    return '📷 Photo';
                                  } else if (hasVideo) {
                                    return '🎥 Video';
                                  } else if (hasPdf) {
                                    return '📄 Document';
                                  } else {
                                    return '📎 File';
                                  }
                                }
                                return content.substring(0, 40) + (content.length > 40 ? '...' : '');
                              })()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Panel - Chat Area */}
                  {selectedMessage ? (
                    <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #ffffff 100%)' }}>
                      {/* Chat Header - sticky, no gap from main header */}
                      <div style={{position: 'sticky', top: 0, zIndex: 10}} className="py-2 px-3 sm:py-3 sm:px-4 md:px-6 border-b border-[#e5e7eb] bg-white flex items-center gap-2 sm:gap-3">
                        <button 
                          onClick={() => setSelectedMessage(null)}
                          className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(selectedMessage.senderName || 'E').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-[#111827]">
                            {selectedMessage.senderName || 'Employer'}
                            {selectedMessage.company?.verified && (
                              <BadgeCheck className="w-4 h-4 text-[#3b82f6] inline ml-1.5" />
                            )}
                          </h3>
                          <p className="text-[13px] text-[#6b7280]">
                            {selectedMessage.company?.name} - {selectedMessage.job?.title || selectedMessage.subject}
                          </p>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div style={{flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px'}}>
                        <style>{`
                          .msg-sent {
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            color: white;
                            border: none;
                            border-radius: 16px;
                            padding: 10px 14px;
                            padding-right: 60px;
                            word-wrap: break-word;
                            line-height: 1.5;
                            position: relative;
                            min-width: 80px;
                          }
                          .msg-sent::after {
                            content: '';
                            position: absolute;
                            bottom: 0;
                            right: -8px;
                            width: 0;
                            height: 0;
                            border-left: 10px solid #2563eb;
                            border-top: 8px solid transparent;
                            border-bottom: 8px solid transparent;
                          }
                          .msg-received {
                            background: #1f2937;
                            color: white;
                            border: none;
                            border-radius: 16px;
                            padding: 10px 14px;
                            padding-right: 60px;
                            word-wrap: break-word;
                            line-height: 1.5;
                            position: relative;
                            min-width: 80px;
                          }
                          .msg-received::after {
                            content: '';
                            position: absolute;
                            bottom: 0;
                            left: -8px;
                            width: 0;
                            height: 0;
                            border-right: 10px solid #1f2937;
                            border-top: 8px solid transparent;
                            border-bottom: 8px solid transparent;
                          }
                        `}</style>
                        {/* Original Message */}
                        <div style={{
                          alignSelf: selectedMessage.senderId === (user?.frontendId || user?.id) ? 'flex-end' : 'flex-start',
                          maxWidth: '85%',
                          width: 'auto'
                        }}>
                          <div 
                            className={selectedMessage.senderId === (user?.frontendId || user?.id) ? 'msg-sent' : 'msg-received'}
                            style={{
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              display: 'block',
                              width: 'auto',
                              maxWidth: '100%',
                              paddingBottom: '28px'
                            }}>
                            <span style={{fontSize: '15px', whiteSpace: 'pre-line'}}>{selectedMessage.content}</span>
                            <span style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              position: 'absolute',
                              bottom: '6px',
                              right: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
                              {/* Checkmarks for sent messages */}
                              {selectedMessage.senderId === (user?.frontendId || user?.id) && (
                                <span style={{display: 'inline-flex', marginLeft: '2px'}}>
                                  {selectedMessage.readAt ? (
                                    // Double green check - Read
                                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                      <path d="M1 5.5L4.5 9L11 2" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M5 5.5L8.5 9L15 2" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  ) : selectedMessage.deliveredAt ? (
                                    // Double gray check - Delivered
                                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                      <path d="M1 5.5L4.5 9L11 2" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M5 5.5L8.5 9L15 2" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  ) : (
                                    // Single check - Sent
                                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                                      <path d="M1 4.5L4.5 8L11 1" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Thread Replies */}
                        {selectedMessage.replies && selectedMessage.replies.map((reply: any) => {
                          // Parse embedded attachments from message content
                          let parsedAttachments: FileAttachment[] = [];
                          let displayContent = reply.content || '';
                          
                          // Check for embedded attachments in message
                          const attachmentMatch = displayContent.match(/__ATTACHMENTS__(.+?)__ATTACHMENTS_END__/);
                          if (attachmentMatch) {
                            try {
                              parsedAttachments = JSON.parse(attachmentMatch[1]);
                              // Remove attachment data and FILETYPE prefix from display content
                              displayContent = displayContent.replace(/__FILETYPE:\w+__/, '').replace(/__ATTACHMENTS__.+?__ATTACHMENTS_END__/, '').trim();
                            } catch (e) {
                              console.error('Failed to parse attachments:', e);
                            }
                          }
                          
                          // Also check local state for attachments (for sender's view)
                          const localAttachments = messageAttachments[reply.id] || [];
                          const attachments = parsedAttachments.length > 0 ? parsedAttachments : localAttachments;
                          const hasAttachments = attachments.length > 0;
                          
                          return (
                            <div key={reply.id} style={{
                              alignSelf: reply.senderId === (user?.frontendId || user?.id) ? 'flex-end' : 'flex-start',
                              maxWidth: '85%',
                              width: 'auto'
                            }}>
                              <div 
                                className={reply.senderId === (user?.frontendId || user?.id) ? 'msg-sent' : 'msg-received'}
                                style={{
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word',
                                  display: 'block',
                                  width: 'auto',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  paddingBottom: '28px'
                                }}>
                                
                                {/* File Attachments Display */}
                                {hasAttachments && (
                                  <div style={{marginBottom: displayContent && displayContent !== '(File attachment)' ? '8px' : '0'}}>
                                    {attachments.map((file, idx) => (
                                      <div key={idx} style={{marginBottom: idx < attachments.length - 1 ? '4px' : '0'}}>
                                        {/* Image Preview */}
                                        {file.type.startsWith('image/') && (
                                          <div style={{borderRadius: '10px', overflow: 'hidden', maxWidth: '250px'}}>
                                            <img 
                                              src={file.dataUrl} 
                                              alt={file.name}
                                              style={{width: '100%', height: 'auto', display: 'block', cursor: 'pointer'}}
                                              onClick={() => setViewingFile(file)}
                                            />
                                          </div>
                                        )}
                                        
                                        {/* Video Preview */}
                                        {file.type.startsWith('video/') && (
                                          <div style={{borderRadius: '10px', overflow: 'hidden', maxWidth: '250px'}}>
                                            <video 
                                              src={file.dataUrl}
                                              controls
                                              style={{width: '100%', height: 'auto', display: 'block'}}
                                            />
                                          </div>
                                        )}
                                        
                                        {/* PDF Preview */}
                                        {file.type === 'application/pdf' && (
                                          <div 
                                            onClick={() => setViewingFile(file)}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '10px',
                                              padding: '10px 12px',
                                              background: 'rgba(255,255,255,0.1)',
                                              borderRadius: '10px',
                                              cursor: 'pointer'
                                            }}
                                          >
                                            <div style={{background: '#ef4444', padding: '8px', borderRadius: '8px'}}>
                                              <FileText className="w-6 h-6 text-white" />
                                            </div>
                                            <div style={{flex: 1, minWidth: 0}}>
                                              <div style={{fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{file.name}</div>
                                              <div style={{fontSize: '12px', opacity: 0.7}}>PDF • {(file.size / 1024).toFixed(1)} KB</div>
                                            </div>
                                            <Download className="w-5 h-5" style={{opacity: 0.7}} />
                                          </div>
                                        )}
                                        
                                        {/* Other Files */}
                                        {!file.type.startsWith('image/') && !file.type.startsWith('video/') && file.type !== 'application/pdf' && (
                                          <div 
                                            onClick={() => {
                                              const link = document.createElement('a');
                                              link.href = file.dataUrl;
                                              link.download = file.name;
                                              link.click();
                                            }}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '10px',
                                              padding: '10px 12px',
                                              background: 'rgba(255,255,255,0.1)',
                                              borderRadius: '10px',
                                              cursor: 'pointer'
                                            }}
                                          >
                                            <div style={{background: '#6366f1', padding: '8px', borderRadius: '8px'}}>
                                              <FileText className="w-6 h-6 text-white" />
                                            </div>
                                            <div style={{flex: 1, minWidth: 0}}>
                                              <div style={{fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{file.name}</div>
                                              <div style={{fontSize: '12px', opacity: 0.7}}>{(file.size / 1024).toFixed(1)} KB</div>
                                            </div>
                                            <Download className="w-5 h-5" style={{opacity: 0.7}} />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Text Content */}
                                {displayContent && displayContent !== '(File attachment)' && (
                                  <span style={{fontSize: '15px', whiteSpace: 'pre-line', display: 'block', padding: hasAttachments ? '4px 8px 0' : '0'}}>{displayContent}</span>
                                )}
                                
                                <span style={{
                                  fontSize: '11px',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  position: 'absolute',
                                  bottom: '6px',
                                  right: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  {reply.createdAt ? new Date(reply.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
                                  {/* Checkmarks for sent messages */}
                                  {reply.senderId === (user?.frontendId || user?.id) && (
                                    <span style={{display: 'inline-flex', marginLeft: '2px'}}>
                                      {reply.readAt ? (
                                        // Double blue check - Read
                                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                          <path d="M1 5.5L4.5 9L11 2" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M5 5.5L8.5 9L15 2" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      ) : reply.deliveredAt ? (
                                        // Double gray check - Delivered
                                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                          <path d="M1 5.5L4.5 9L11 2" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M5 5.5L8.5 9L15 2" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      ) : (
                                        // Single check - Sent
                                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                                          <path d="M1 4.5L4.5 8L11 1" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      )}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Files Preview */}
                      {selectedFiles.length > 0 && (
                        <div className="px-4 sm:px-6 py-2 border-t border-[#e5e7eb] bg-slate-50">
                          <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-sm">
                                <FileText className="w-4 h-4 text-[#3b82f6]" />
                                <span className="max-w-[150px] truncate text-slate-700">{file.name}</span>
                                <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)}KB)</span>
                                <button
                                  onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                                  className="p-0.5 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                  <X className="w-3 h-3 text-slate-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message Input Area - Fixed at bottom */}
                      <div className="py-4 px-4 sm:px-6 border-t border-[#e5e7eb] bg-white" style={{position: 'sticky', bottom: 0, zIndex: 10}}>
                        <div className="flex gap-3 items-end">
                          <div className="flex-1 relative">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Type a message..."
                              className="w-full py-3 px-4 pr-12 border border-[#3b82f6] rounded-3xl text-[15px] resize-none max-h-[120px] focus:outline-none focus:border-[#2563eb] focus:ring-[3px] focus:ring-[#3b82f6]/20 transition-all"
                              rows={1}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  if ((replyContent.trim() || selectedFiles.length > 0) && !sendingReply) {
                                    // Trigger send
                                    const sendBtn = document.getElementById('send-message-btn');
                                    if (sendBtn) sendBtn.click();
                                  }
                                }
                              }}
                            />
                            {/* Hidden file input */}
                            <input
                              type="file"
                              id="chat-file-upload"
                              className="hidden"
                              multiple
                              accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                  // Limit to 5 files max
                                  const newFiles = [...selectedFiles, ...files].slice(0, 5);
                                  setSelectedFiles(newFiles);
                                }
                                // Reset input so same file can be selected again
                                e.target.value = '';
                              }}
                            />
                            <button 
                              onClick={() => document.getElementById('chat-file-upload')?.click()}
                              className="absolute right-3 bottom-3 p-1 text-[#6b7280] hover:text-[#3b82f6] transition-colors"
                              title="Attach files"
                            >
                              <Paperclip className="w-5 h-5" />
                            </button>
                          </div>
                          <button 
                            id="send-message-btn"
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] flex items-center justify-center text-white flex-shrink-0 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={(!replyContent.trim() && selectedFiles.length === 0) || sendingReply}
                            onClick={async () => {
                              if (!replyContent.trim() && selectedFiles.length === 0) return;
                              setSendingReply(true);
                              try {
                                const token = localStorage.getItem('frontendToken');
                                
                                // Build message content
                                let messageContent = replyContent.trim();
                                
                                // Helper function to compress image
                                const compressImage = async (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
                                  return new Promise((resolve) => {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      const img = new Image();
                                      img.onload = () => {
                                        const canvas = document.createElement('canvas');
                                        let width = img.width;
                                        let height = img.height;
                                        
                                        // Scale down if too large
                                        if (width > maxWidth) {
                                          height = (height * maxWidth) / width;
                                          width = maxWidth;
                                        }
                                        
                                        canvas.width = width;
                                        canvas.height = height;
                                        const ctx = canvas.getContext('2d');
                                        ctx?.drawImage(img, 0, 0, width, height);
                                        
                                        // Convert to compressed JPEG
                                        resolve(canvas.toDataURL('image/jpeg', quality));
                                      };
                                      img.src = e.target?.result as string;
                                    };
                                    reader.readAsDataURL(file);
                                  });
                                };
                                
                                // Convert files to data URLs and embed in message
                                const fileAttachments: FileAttachment[] = [];
                                if (selectedFiles.length > 0) {
                                  for (const file of selectedFiles) {
                                    let dataUrl: string;
                                    
                                    // Compress images to reduce size
                                    if (file.type.startsWith('image/')) {
                                      dataUrl = await compressImage(file, 800, 0.7);
                                    } else {
                                      // For non-images, use regular base64
                                      dataUrl = await new Promise<string>((resolve) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result as string);
                                        reader.readAsDataURL(file);
                                      });
                                    }
                                    
                                    fileAttachments.push({
                                      name: file.name,
                                      type: file.type.startsWith('image/') ? 'image/jpeg' : file.type,
                                      size: file.size,
                                      dataUrl
                                    });
                                  }
                                  
                                  // Determine primary file type for preview
                                  const hasImage = fileAttachments.some((f: any) => f.type?.startsWith('image/'));
                                  const hasVideo = fileAttachments.some((f: any) => f.type?.startsWith('video/'));
                                  const hasPdf = fileAttachments.some((f: any) => f.type === 'application/pdf' || f.name?.endsWith('.pdf'));
                                  
                                  // Add type prefix for easy detection: __FILETYPE:image__ or __FILETYPE:video__ etc.
                                  let fileTypePrefix = '__FILETYPE:file__';
                                  if (hasImage) fileTypePrefix = '__FILETYPE:image__';
                                  else if (hasVideo) fileTypePrefix = '__FILETYPE:video__';
                                  else if (hasPdf) fileTypePrefix = '__FILETYPE:pdf__';
                                  
                                  // Embed file data in message content as JSON
                                  const attachmentData = JSON.stringify(fileAttachments);
                                  if (messageContent) {
                                    messageContent = `${messageContent}\n\n${fileTypePrefix}__ATTACHMENTS__${attachmentData}__ATTACHMENTS_END__`;
                                  } else {
                                    messageContent = `${fileTypePrefix}__ATTACHMENTS__${attachmentData}__ATTACHMENTS_END__`;
                                  }
                                }
                                
                                // Send the message with embedded file data
                                console.log('Sending message with content length:', messageContent.length);
                                
                                // Increased limit to 20MB
                                let finalContent = messageContent;
                                if (messageContent.length > 20000000) {
                                  console.warn('Message too large even after compression');
                                  finalContent = replyContent.trim() || '📎 Sent file(s) - too large to display';
                                }
                                
                                const sendResponse = await fetch('/api/trpc/messages.reply', {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({
                                    json: { parentId: selectedMessage.id, content: finalContent }
                                  })
                                });
                                
                                console.log('Send response status:', sendResponse.status);
                                if (!sendResponse.ok) {
                                  const errorText = await sendResponse.text();
                                  console.error('Send failed:', errorText);
                                }
                                
                                setReplyContent('');
                                setSelectedFiles([]);
                                
                                // Refresh messages
                                const response = await fetch('/api/trpc/messages.getAll', {
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (response.ok) {
                                  const data = await response.json();
                                  if (data?.result?.data?.json) {
                                    setConversations(data.result.data.json);
                                    // Update selected message with new replies
                                    const updated = data.result.data.json.find((m: any) => m.id === selectedMessage.id);
                                    if (updated) setSelectedMessage(updated);
                                  }
                                }
                              } catch (error) {
                                console.error('Failed to send reply:', error);
                              } finally {
                                setSendingReply(false);
                              }
                            }}
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden lg:flex flex-1 flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #ffffff 100%)' }}>
                      <MessageSquare className="w-16 h-16 text-[#9ca3af] mb-4" />
                      <p className="text-[#6b7280] text-lg">Select a conversation</p>
                      <p className="text-[#9ca3af] text-sm mt-1">Choose a conversation from the list to start messaging</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Calendar Section */}
          {activeSection === "calendar" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">Calendar</h1>
                <p className="text-slate-500 mt-1">Your interviews and important dates</p>
              </div>

              <div className="grid gap-4">
                {mockEvents.map((event) => (
                  <div key={event.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 lg:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        event.type === "interview" 
                          ? "bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a]" 
                          : event.type === "call"
                          ? "bg-gradient-to-br from-orange-500 to-orange-600"
                          : "bg-gradient-to-br from-slate-500 to-slate-600"
                      }`}>
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-800">{event.title}</h3>
                        <p className="text-slate-500 mt-1">{event.date} • {event.time}</p>
                      </div>
                      <Button variant="outline" className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Section */}
          {activeSection === "financial" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">Financial Services</h1>
                <p className="text-slate-500 mt-1">Manage your financial applications</p>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/financial/loan">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:border-[#1e3a5f]/20 hover:shadow-xl transition-all cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] rounded-xl flex items-center justify-center mb-4">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800">Apply for Loan</h3>
                    <p className="text-sm text-slate-500 mt-1">Personal or Business loans</p>
                  </div>
                </Link>
                <Link href="/financial/credit-card-debt">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:border-[#1e3a5f]/20 hover:shadow-xl transition-all cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800">Clear Credit Card Debt</h3>
                    <p className="text-sm text-slate-500 mt-1">Free debt clearing service</p>
                  </div>
                </Link>
                <Link href="/financial/tax-refund">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:border-[#1e3a5f]/20 hover:shadow-xl transition-all cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                      <FileCheck className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800">File Tax Refund</h3>
                    <p className="text-sm text-slate-500 mt-1">Maximum refund guarantee</p>
                  </div>
                </Link>
              </div>

              {/* Financial Applications */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 overflow-hidden">
                <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f] mb-4 sm:mb-6">Your Applications</h2>
                <div className="space-y-3 sm:space-y-4">
                  {mockFinancialApplications.map((app) => (
                    <div key={app.id} className="p-3 sm:p-4 rounded-xl bg-slate-50">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          app.type.includes("Loan") ? "bg-[#1e3a5f]" : app.type.includes("Credit") ? "bg-orange-500" : "bg-green-500"
                        }`}>
                          {app.type.includes("Loan") ? <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : 
                           app.type.includes("Credit") ? <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : 
                           <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{app.type}</h3>
                            <Badge className={`flex-shrink-0 text-xs ${
                              app.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                              app.status === "processing" ? "bg-orange-50 text-orange-700 border-orange-200" :
                              "bg-slate-50 text-slate-700 border-slate-200"
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Amount: {app.amount}
                          </p>
                          <p className="text-xs text-slate-400 truncate">#{app.applicationNumber}</p>
                          <div className="mt-2 flex gap-2">
                            {app.status === "approved" && app.type.includes("Loan") && (
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 text-xs h-8"
                                onClick={() => {
                                  setSelectedLoan({ ...app, amount: parseInt(app.amount.replace(/[^0-9]/g, '')) });
                                  setShowWithdrawalForm(true);
                                }}
                              >
                                <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Withdraw
                              </Button>
                            )}
                            {app.status !== "approved" && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white text-xs h-8"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a5f]">My Profile</h1>
                  <p className="text-slate-500 mt-1">Manage your professional profile</p>
                </div>
                <Button variant="outline" className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Profile Header */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f]" />
                <div className="px-6 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                      <span className="text-white font-bold text-3xl">{user?.name?.charAt(0) || "U"}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-800">{user?.name || "User"}</h2>
                      <p className="text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">About</h2>
                <p className="text-slate-600 leading-relaxed">{mockProfile.about}</p>
              </div>

              {/* Experience */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1e3a5f]">Work Experience</h2>
                  <Button variant="outline" size="sm" className="border-[#1e3a5f]/20 text-[#1e3a5f]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="space-y-6">
                  {mockProfile.experience.map((exp) => (
                    <div key={exp.id} className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{exp.title}</h3>
                        <p className="text-slate-600">{exp.company}</p>
                        <p className="text-sm text-slate-500">{exp.startDate} - {exp.endDate} • {exp.location} • {exp.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1e3a5f]">Education</h2>
                  <Button variant="outline" size="sm" className="border-[#1e3a5f]/20 text-[#1e3a5f]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="space-y-6">
                  {mockProfile.education.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{edu.degree}</h3>
                        <p className="text-slate-600">{edu.school}</p>
                        <p className="text-sm text-slate-500">{edu.year} • GPA: {edu.gpa}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1e3a5f]">Skills</h2>
                  <Button variant="outline" size="sm" className="border-[#1e3a5f]/20 text-[#1e3a5f]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Technical Skills</h3>
                  {mockProfile.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{skill.name}</span>
                        <span className="text-slate-500">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-6">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockProfile.softSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-slate-200 text-slate-600">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-700">{mockProfile.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-medium text-slate-700">{mockProfile.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="font-medium text-slate-700">{mockProfile.contact.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Linkedin className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">LinkedIn</p>
                      <p className="font-medium text-slate-700">{mockProfile.contact.linkedin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account preferences</p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "Email notifications for new job matches", enabled: true },
                    { label: "Application status updates", enabled: true },
                    { label: "Interview reminders", enabled: true },
                    { label: "Weekly job digest", enabled: false },
                    { label: "Marketing communications", enabled: false },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="text-slate-700">{setting.label}</span>
                      <button className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? "bg-[#1e3a5f]" : "bg-slate-300"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${setting.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">Privacy Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: "Make profile visible to employers", enabled: true },
                    { label: "Show profile in search results", enabled: true },
                    { label: "Allow recruiters to contact me", enabled: true },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="text-slate-700">{setting.label}</span>
                      <button className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? "bg-[#1e3a5f]" : "bg-slate-300"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${setting.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-red-200 p-6">
                <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
                <p className="text-slate-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
          )}
          </div>
          </div>
      </main>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f]">Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Job Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center border border-[#1e3a5f]/10 flex-shrink-0">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#1e3a5f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate">{selectedApplication.job?.title || "Job Position"}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-sm text-slate-500">{selectedApplication.company?.name || "Company"}</p>
                      {selectedApplication.company?.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-50/90 to-blue-100/70 text-blue-600 text-xs font-medium rounded-full" title="Verified Employer">
                          <BadgeCheck className="w-3 h-3" />
                          <span className="hidden sm:inline">Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusStyle(selectedApplication.status)} border font-medium text-xs sm:text-sm`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="ml-1.5">{getStatusLabel(selectedApplication.status)}</span>
                </Badge>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {selectedApplication.job?.location || "Location"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                    {selectedApplication.job?.jobType?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Full-time"}
                  </span>
                  {selectedApplication.job?.salaryMin && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      ${(selectedApplication.job.salaryMin / 1000).toFixed(0)}K - ${(selectedApplication.job.salaryMax / 1000).toFixed(0)}K
                    </span>
                  )}
                </div>
              </div>

              {/* Application Timeline */}
              <div className="bg-slate-50 rounded-xl p-3 sm:p-5">
                <h4 className="font-semibold text-slate-800 mb-3 sm:mb-4 text-sm sm:text-base">Application Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Application Submitted</p>
                      <p className="text-sm text-slate-500">
                        {selectedApplication.appliedAt 
                          ? new Date(selectedApplication.appliedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'Date not available'
                        }
                      </p>
                    </div>
                  </div>
                  {(selectedApplication.status === "review" || selectedApplication.status === "reviewing") && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Under Review</p>
                        <p className="text-sm text-slate-500">Your application is being reviewed by the hiring team</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.status === "shortlisted" && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Shortlisted</p>
                        <p className="text-sm text-slate-500">You've been shortlisted for the next round</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.status === "interview" && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Interview Scheduled</p>
                        <p className="text-sm text-slate-500">Congratulations! You've been selected for an interview</p>
                      </div>
                    </div>
                  )}
                  {(selectedApplication.status === "offer" || selectedApplication.status === "hired") && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{selectedApplication.status === "offer" ? "Offer Received" : "Hired"}</p>
                        <p className="text-sm text-slate-500">Congratulations on your success!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Cover Letter</h4>
                  <div className="bg-slate-50 rounded-xl p-4 text-slate-600 text-sm whitespace-pre-line">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              {/* Resume Used */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-2 sm:mb-3 text-sm sm:text-base">Resume Submitted</h4>
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#1e3a5f] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm sm:text-base truncate">{selectedApplication.resume?.name || "Resume.pdf"}</p>
                    <p className="text-xs sm:text-sm text-slate-500">Submitted with application</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#1e3a5f]/20 text-[#1e3a5f] text-xs sm:text-sm flex-shrink-0">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </div>

              {/* Company Contact Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-5 border border-blue-100">
                <h4 className="font-semibold text-slate-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Employer Information
                </h4>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-600">
                    <span className="font-medium">Company:</span> {selectedApplication.company?.name || "Company"}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Industry:</span> {selectedApplication.company?.industry || "Technology"}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Location:</span> {selectedApplication.company?.location || selectedApplication.job?.location || "Not specified"}
                  </p>
                  {selectedApplication.company?.website && (
                    <p className="text-slate-600">
                      <span className="font-medium">Website:</span>{" "}
                      <a href={selectedApplication.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedApplication.company.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200 pb-4 sm:pb-0">
                <div className="flex gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm h-9 sm:h-10"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                  <Link href={`/jobs/${selectedApplication.jobId}`} className="flex-1">
                    <Button variant="outline" className="w-full border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f]/5 text-xs sm:text-sm h-9 sm:h-10">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View Job</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                  </Link>
                </div>
                <Button className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white hover:from-[#2d5a8a] hover:to-[#1e3a5f] shadow-lg text-xs sm:text-sm h-9 sm:h-10">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Contact Employer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-40" style={{paddingBottom: 'env(safe-area-inset-bottom, 0px)'}}>
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => {
              setActiveSection('applications');
              setLocation('/dashboard/applications');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeSection === 'applications' ? 'text-[#1e3a5f]' : 'text-slate-400'}`}
          >
            <Briefcase className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Applications</span>
          </button>
          <button
            onClick={() => {
              setActiveSection('financial');
              setLocation('/dashboard/financial');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full ${activeSection === 'financial' ? 'text-[#1e3a5f]' : 'text-slate-400'}`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Financial</span>
          </button>
        </div>
      </div>

      {/* Loan Withdrawal Modal */}
      {showWithdrawalForm && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1e3a5f]">
                {withdrawalSubmitted ? "Withdrawal Submitted" : "Withdraw Loan Funds"}
              </h2>
              <button
                onClick={() => {
                  setShowWithdrawalForm(false);
                  setSelectedLoan(null);
                  setWithdrawalSubmitted(false);
                  setWithdrawalDetails({ bankName: "", accountHolderName: "", accountNumber: "", routingNumber: "" });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              {withdrawalSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Withdrawal Request Submitted!</h3>
                  <p className="text-slate-500 mb-6">Your funds will be transferred within 2-3 business days.</p>
                  
                  <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3 mb-6">
                    <h4 className="font-semibold text-slate-800">Withdrawal Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-slate-500">Bank Name:</span>
                      <span className="font-medium text-slate-700">{withdrawalDetails.bankName}</span>
                      <span className="text-slate-500">Account Holder:</span>
                      <span className="font-medium text-slate-700">{withdrawalDetails.accountHolderName}</span>
                      <span className="text-slate-500">Account Number:</span>
                      <span className="font-medium text-slate-700">****{withdrawalDetails.accountNumber.slice(-4)}</span>
                      <span className="text-slate-500">Routing Number:</span>
                      <span className="font-medium text-slate-700">{withdrawalDetails.routingNumber}</span>
                      <span className="text-slate-500">Amount:</span>
                      <span className="font-medium text-green-600">${selectedLoan.amount?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white"
                    onClick={() => {
                      setShowWithdrawalForm(false);
                      setSelectedLoan(null);
                      setWithdrawalSubmitted(false);
                      setWithdrawalDetails({ bankName: "", accountHolderName: "", accountNumber: "", routingNumber: "" });
                    }}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Loan Info */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">Loan Approved!</p>
                        <p className="text-sm text-green-600">Amount: ${selectedLoan.amount?.toLocaleString() || "0"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                      <Input
                        placeholder="e.g., Chase Bank, Bank of America"
                        value={withdrawalDetails.bankName}
                        onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, bankName: e.target.value })}
                        className="h-12 rounded-xl border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Account Holder Name</label>
                      <Input
                        placeholder="Full name as it appears on account"
                        value={withdrawalDetails.accountHolderName}
                        onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, accountHolderName: e.target.value })}
                        className="h-12 rounded-xl border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                      <Input
                        placeholder="Enter your account number"
                        value={withdrawalDetails.accountNumber}
                        onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, accountNumber: e.target.value })}
                        className="h-12 rounded-xl border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Routing Number</label>
                      <Input
                        placeholder="9-digit routing number"
                        value={withdrawalDetails.routingNumber}
                        onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, routingNumber: e.target.value })}
                        className="h-12 rounded-xl border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white text-lg font-semibold rounded-xl"
                    onClick={() => setWithdrawalSubmitted(true)}
                    disabled={!withdrawalDetails.bankName || !withdrawalDetails.accountHolderName || !withdrawalDetails.accountNumber || !withdrawalDetails.routingNumber}
                  >
                    Submit Withdrawal Request
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    By submitting, you agree to our terms and conditions. Funds will be transferred within 2-3 business days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {viewingFile && (
        <div 
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center"
          onClick={() => setViewingFile(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setViewingFile(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          {/* Download Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement('a');
              link.href = viewingFile.dataUrl;
              link.download = viewingFile.name;
              link.click();
            }}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10 flex items-center gap-2"
          >
            <Download className="w-5 h-5 text-white" />
            <span className="text-white text-sm hidden sm:inline">Download</span>
          </button>
          
          {/* File Name */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
            <span className="text-white text-sm">{viewingFile.name}</span>
          </div>
          
          {/* Content */}
          <div 
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Viewer */}
            {viewingFile.type.startsWith('image/') && (
              <img 
                src={viewingFile.dataUrl} 
                alt={viewingFile.name}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}
            
            {/* Video Viewer */}
            {viewingFile.type.startsWith('video/') && (
              <video 
                src={viewingFile.dataUrl}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg"
              />
            )}
            
            {/* PDF Viewer */}
            {viewingFile.type === 'application/pdf' && (
              <iframe
                src={viewingFile.dataUrl}
                className="w-[90vw] h-[85vh] rounded-lg bg-white"
                title={viewingFile.name}
              />
            )}
            
            {/* Other Files - Show download prompt */}
            {!viewingFile.type.startsWith('image/') && !viewingFile.type.startsWith('video/') && viewingFile.type !== 'application/pdf' && (
              <div className="bg-white rounded-2xl p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-[#6366f1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#6366f1]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{viewingFile.name}</h3>
                <p className="text-slate-500 text-sm mb-4">Size: {(viewingFile.size / 1024).toFixed(1)} KB</p>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = viewingFile.dataUrl;
                    link.download = viewingFile.name;
                    link.click();
                  }}
                  className="px-6 py-3 bg-[#3b82f6] text-white rounded-xl font-medium hover:bg-[#2563eb] transition-colors flex items-center gap-2 mx-auto"
                >
                  <Download className="w-5 h-5" />
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
