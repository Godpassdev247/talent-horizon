/**
 * Header Component - Executive Precision Design System
 * Sticky navigation with authentication and premium hover effects
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Mail, Phone, User, LogOut, Settings, Briefcase, Heart, Bell, FileText, DollarSign, CreditCard, Receipt, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const navLinks = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "For Employers", href: "/employers" },
  { 
    label: "Financial", 
    href: "/financial",
    submenu: [
      { label: "Apply for Loan", href: "/financial/loan", icon: DollarSign },
      { label: "Credit Card Debt Clear", href: "/financial/credit-card-debt", icon: CreditCard },
      { label: "Tax Refund Filing", href: "/financial/tax-refund", icon: Receipt },
    ]
  },
  { 
    label: "Resources", 
    href: "/resources",
    submenu: [
      { label: "Career Advice", href: "/resources/career-advice" },
      { label: "Salary Guide", href: "/resources/salary-guide" },
      { label: "Resume Tips", href: "/resources/resume-tips" },
      { label: "Interview Prep", href: "/resources/interview-prep" },
    ]
  },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [location] = useLocation();
  const { user, isAuthenticated, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-navy text-white text-sm hidden lg:block">
        <div className="container flex justify-between items-center py-2">
          <div className="flex items-center gap-6">
            <a href="mailto:careers@talenthorizon.com" className="flex items-center gap-2 hover:text-orange transition-colors">
              <Mail className="w-4 h-4" />
              <span>careers@talenthorizon.com</span>
            </a>
            <a href="tel:+18005551234" className="flex items-center gap-2 hover:text-orange transition-colors">
              <Phone className="w-4 h-4" />
              <span>1-800-555-1234</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/70">Looking to hire?</span>
            <Link href="/employers" className="text-orange hover:underline font-medium">
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg" 
            : "bg-white"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <motion.div 
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange to-orange-dark rounded-lg flex items-center justify-center">
                  <span className="text-white font-display font-bold text-xl">T</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xl text-navy leading-tight">
                    Talent<span className="text-orange">Horizon</span>
                  </span>
                  <span className="text-xs text-slate-500 hidden sm:block">Find Your Dream Career</span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.submenu && setActiveSubmenu(link.label)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link href={link.href}>
                    <motion.span
                      className={`flex items-center gap-1 px-4 py-2 font-medium transition-colors cursor-pointer ${
                        location === link.href || location.startsWith(link.href + "/")
                          ? "text-orange"
                          : "text-navy hover:text-orange"
                      }`}
                      whileHover={{ y: -1 }}
                    >
                      {link.label}
                      {link.submenu && <ChevronDown className="w-4 h-4" />}
                    </motion.span>
                  </Link>

                  {/* Submenu */}
                  <AnimatePresence>
                    {link.submenu && activeSubmenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 mt-1"
                      >
                        {link.submenu.map((sublink) => (
                          <Link key={sublink.label} href={sublink.href}>
                            <span className="flex items-center gap-3 px-4 py-3 text-navy hover:bg-gray-50 hover:text-orange transition-colors cursor-pointer">
                              {'icon' in sublink && sublink.icon && <sublink.icon className="w-4 h-4 text-slate-400" />}
                              {sublink.label}
                            </span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 bg-navy rounded-full flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                      <div className="text-left hidden xl:block">
                        <p className="text-sm font-medium text-navy">{user.name || "User"}</p>
                        <p className="text-xs text-slate-500">Job Seeker</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium text-navy">{user.name || "User"}</p>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <span className="flex items-center gap-2 cursor-pointer w-full">
                          <User className="w-4 h-4" />
                          Dashboard
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/applications">
                        <span className="flex items-center gap-2 cursor-pointer w-full">
                          <Briefcase className="w-4 h-4" />
                          My Applications
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/saved">
                        <span className="flex items-center gap-2 cursor-pointer w-full">
                          <Heart className="w-4 h-4" />
                          Saved Jobs
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/resumes">
                        <span className="flex items-center gap-2 cursor-pointer w-full">
                          <FileText className="w-4 h-4" />
                          My Resumes
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/alerts">
                        <span className="flex items-center gap-2 cursor-pointer w-full">
                          <Bell className="w-4 h-4" />
                          Job Alerts
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/financial">
                        <span className="flex items-center gap-2 cursor-pointer w-full">
                          <Building2 className="w-4 h-4" />
                          Financial Services
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <span className="flex items-center gap-2 cursor-pointer w-full">
                          <Settings className="w-4 h-4" />
                          Settings
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                      Sign In
                    </Button>
                  </a>
                  <a href={getLoginUrl()}>
                    <Button className="bg-orange hover:bg-orange-dark text-white">
                      Get Started
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-navy"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="container py-4 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link href={link.href}>
                      <span className="block py-3 px-4 font-medium text-navy hover:bg-gray-50 rounded-lg cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                    {link.submenu && (
                      <div className="pl-4 space-y-1">
                        {link.submenu.map((sublink) => (
                          <Link key={sublink.label} href={sublink.href}>
                            <span className="flex items-center gap-2 py-2 px-4 text-sm text-slate-600 hover:text-orange cursor-pointer">
                              {'icon' in sublink && sublink.icon && <sublink.icon className="w-4 h-4 text-slate-400" />}
                              {sublink.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 space-y-2 border-t border-gray-100">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">My Account</div>
                      <Link href="/dashboard">
                        <Button variant="outline" className="w-full justify-start bg-navy/5 border-navy/20 text-navy">
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <span className="flex items-center gap-2 py-2 px-4 text-sm text-slate-600 hover:text-orange cursor-pointer">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          My Applications
                        </span>
                      </Link>
                      <Link href="/dashboard">
                        <span className="flex items-center gap-2 py-2 px-4 text-sm text-slate-600 hover:text-orange cursor-pointer">
                          <Heart className="w-4 h-4 text-slate-400" />
                          Saved Jobs
                        </span>
                      </Link>
                      <Link href="/dashboard">
                        <span className="flex items-center gap-2 py-2 px-4 text-sm text-slate-600 hover:text-orange cursor-pointer">
                          <FileText className="w-4 h-4 text-slate-400" />
                          My Resumes
                        </span>
                      </Link>
                      <Link href="/dashboard">
                        <span className="flex items-center gap-2 py-2 px-4 text-sm text-slate-600 hover:text-orange cursor-pointer">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          Financial Services
                        </span>
                      </Link>
                      <Link href="/dashboard">
                        <span className="flex items-center gap-2 py-2 px-4 text-sm text-slate-600 hover:text-orange cursor-pointer">
                          <Settings className="w-4 h-4 text-slate-400" />
                          Settings
                        </span>
                      </Link>
                      <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <a href={getLoginUrl()}>
                        <Button variant="outline" className="w-full border-navy text-navy">
                          Sign In
                        </Button>
                      </a>
                      <a href={getLoginUrl()}>
                        <Button className="w-full bg-orange hover:bg-orange-dark text-white">
                          Get Started
                        </Button>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
