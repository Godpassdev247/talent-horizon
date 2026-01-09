/**
 * Enterprise-Grade Applicant Dashboard
 * Professional A+ design with Executive Navy color scheme
 * Optimized for fast loading with real data connections
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, FileText, Bookmark, Briefcase, MessageSquare,
  Calendar, Bell, Settings, User, LogOut, Search, ChevronRight,
  Upload, Eye, Download, Trash2, Star, Clock, MapPin, Building2,
  CheckCircle, XCircle, AlertCircle, TrendingUp,
  Mail, Phone, Edit3, Plus, Filter, MoreVertical,
  Send, Paperclip, Award, Menu, X, GraduationCap, Globe, Linkedin, ExternalLink,
  DollarSign, CreditCard, FileCheck, Wallet, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sidebar navigation items
const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: Briefcase },
  { id: "saved", label: "Saved Jobs", icon: Bookmark },
  { id: "resumes", label: "Resumes", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageSquare },
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
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "applied":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "withdrawn":
      return "bg-slate-100 text-slate-500 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "interview":
      return <CheckCircle className="w-4 h-4" />;
    case "review":
      return <Clock className="w-4 h-4" />;
    case "applied":
      return <AlertCircle className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "interview":
      return "Interview Scheduled";
    case "review":
      return "Under Review";
    case "applied":
      return "Applied";
    case "rejected":
      return "Not Selected";
    case "withdrawn":
      return "Withdrawn";
    default:
      return status;
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
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  
  // Check Django authentication from localStorage
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        setLocation('/login');
      }
    } else {
      setLocation('/login');
    }
    setAuthLoading(false);
  }, [setLocation]);
  
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLocation('/login');
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
  
  const applications: any[] = [];
  const savedJobs: any[] = [];
  const resumes: any[] = [];
  const dashboardStats: any = null;
  const appsLoading = false;
  const savedLoading = false;
  const resumesLoading = false;
  
  // Fetch real conversations from Django backend
  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;
      
      try {
        setMessagesLoading(true);
        const response = await fetch('http://localhost:8000/admin-panel/api/messages/conversations/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setMessagesLoading(false);
      }
    };
    
    fetchConversations();
  }, [user]);

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
    <div className="h-screen flex overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)' }}>
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
              
              // Special handling for messages - navigate to separate page
              if (item.id === "messages") {
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setLocation('/messages');
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {conversations.length > 0 && (
                        <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {conversations.length}
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white/15 text-white shadow-lg backdrop-blur-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-orange-400" : ""}`} />
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
      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
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
        <div className="flex-1 overflow-y-auto relative">
          <div className="p-4 lg:p-8 relative z-10">
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
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-[#1e3a5f]">Recent Applications</h2>
                      <p className="text-slate-500 text-sm mt-1">Track your job application progress</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                      onClick={() => setActiveSection("applications")}
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {appsLoading ? (
                      <div className="text-center py-8 text-slate-500">Loading applications...</div>
                    ) : applications && applications.length > 0 ? (
                      applications.slice(0, 3).map((app: any) => (
                        <div key={app.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#1e3a5f]/10">
                            <Building2 className="w-6 h-6 text-[#1e3a5f]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800">{app.job?.title || "Job Position"}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                              <Building2 className="w-4 h-4" />
                              {app.company?.name || "Company"}
                              <span>•</span>
                              <MapPin className="w-4 h-4" />
                              {app.job?.location || "Location"}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                              Applied {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`${getStatusStyle(app.status)} border font-medium`}>
                            {getStatusIcon(app.status)}
                            <span className="ml-1.5">{getStatusLabel(app.status)}</span>
                          </Badge>
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
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-[#1e3a5f]">Upcoming Events</h2>
                      <p className="text-slate-500 text-sm mt-1">Your scheduled interviews and deadlines</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          event.type === "interview" 
                            ? "bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a]" 
                            : event.type === "call"
                            ? "bg-gradient-to-br from-orange-500 to-orange-600"
                            : "bg-gradient-to-br from-slate-500 to-slate-600"
                        }`}>
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800">{event.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">{event.date} • {event.time}</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white">
                          View
                        </Button>
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
                <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                  <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
                    All ({applications?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="interview" className="rounded-lg data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
                    Interviews ({applications?.filter((a: any) => a.status === "interview").length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="review" className="rounded-lg data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
                    Under Review ({applications?.filter((a: any) => a.status === "review").length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="applied" className="rounded-lg data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
                    Applied ({applications?.filter((a: any) => a.status === "applied" || a.status === "pending").length || 0})
                  </TabsTrigger>
                </TabsList>

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
                                  Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                    {applications?.filter((a: any) => a.status === "applied" || a.status === "pending").length ? (
                      applications.filter((a: any) => a.status === "applied" || a.status === "pending").map((app: any) => (
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

          {/* Messages Section */}
          {activeSection === "messages" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">Messages</h1>
                <p className="text-slate-500 mt-1">Communicate with employers and recruiters</p>
              </div>

              {messagesLoading ? (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">Loading messages...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center">
                  <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No messages yet</p>
                  <p className="text-slate-400 text-sm mt-2">When employers contact you, their messages will appear here</p>
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
                  {conversations.map((conversation, index) => {
                    const otherParticipant = conversation.participant1.id === user.id 
                      ? conversation.participant2 
                      : conversation.participant1;
                    const displayName = conversation.metadata?.sender_name || otherParticipant.full_name || otherParticipant.email;
                    const lastMessage = conversation.last_message || { content: 'No messages yet', created_at: conversation.created_at };
                    const unreadCount = conversation.unread_count || 0;
                    
                    return (
                      <div 
                        key={conversation.id} 
                        className={`p-5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          index !== conversations.length - 1 ? "border-b border-slate-100" : ""
                        } ${unreadCount > 0 ? "bg-[#1e3a5f]/5" : ""}`}
                        onClick={() => setLocation('/messages')}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">
                              {displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900">{displayName}</h3>
                                {conversation.metadata?.verified && (
                                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-slate-400">
                                {new Date(lastMessage.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {conversation.metadata?.company_name && (
                              <p className="text-sm text-slate-500 mt-0.5">{conversation.metadata.company_name}</p>
                            )}
                            {conversation.metadata?.sender_position && (
                              <p className="text-xs text-slate-400 mt-0.5">{conversation.metadata.sender_position}</p>
                            )}
                            <p className="text-sm text-slate-600 mt-2 truncate">{lastMessage.content}</p>
                            {unreadCount > 0 && (
                              <span className="inline-block mt-2 px-2 py-0.5 bg-[#1e3a5f] text-white text-xs rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">Your Applications</h2>
                <div className="space-y-4">
                  {mockFinancialApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          app.type.includes("Loan") ? "bg-[#1e3a5f]" : app.type.includes("Credit") ? "bg-orange-500" : "bg-green-500"
                        }`}>
                          {app.type.includes("Loan") ? <DollarSign className="w-6 h-6 text-white" /> : 
                           app.type.includes("Credit") ? <CreditCard className="w-6 h-6 text-white" /> : 
                           <FileCheck className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{app.type}</h3>
                          <p className="text-sm text-slate-500">Amount: {app.amount} • #{app.applicationNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={
                          app.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                          app.status === "processing" ? "bg-orange-50 text-orange-700 border-orange-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        }>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                        {app.status === "approved" && app.type.includes("Loan") && (
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                            onClick={() => {
                              setSelectedLoan({ ...app, amount: parseInt(app.amount.replace(/[^0-9]/g, '')) });
                              setShowWithdrawalForm(true);
                            }}
                          >
                            <Wallet className="w-4 h-4 mr-1" />
                            Withdraw
                          </Button>
                        )}
                        {app.status !== "approved" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        )}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1e3a5f]">Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-xl flex items-center justify-center border border-[#1e3a5f]/10">
                  <Building2 className="w-8 h-8 text-[#1e3a5f]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">{selectedApplication.job?.title || "Job Position"}</h3>
                  <p className="text-slate-500">{selectedApplication.company?.name || "Company"}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedApplication.job?.location || "Location"}
                    </span>
                    {selectedApplication.job?.salaryMin && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${(selectedApplication.job.salaryMin / 1000).toFixed(0)}K - ${(selectedApplication.job.salaryMax / 1000).toFixed(0)}K
                      </span>
                    )}
                  </div>
                </div>
                <Badge className={`${getStatusStyle(selectedApplication.status)} border font-medium px-3 py-1.5`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="ml-1.5">{getStatusLabel(selectedApplication.status)}</span>
                </Badge>
              </div>

              {/* Application Timeline */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-semibold text-slate-800 mb-4">Application Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Application Submitted</p>
                      <p className="text-sm text-slate-500">{new Date(selectedApplication.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  {selectedApplication.status === "review" && (
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
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Cover Letter</h4>
                  <div className="bg-slate-50 rounded-xl p-4 text-slate-600 text-sm">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              {/* Resume Used */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Resume Submitted</h4>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <FileText className="w-8 h-8 text-[#1e3a5f]" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700">{selectedApplication.resume?.name || "Resume.pdf"}</p>
                    <p className="text-sm text-slate-500">Submitted with application</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#1e3a5f]/20 text-[#1e3a5f]">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Recruiter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
