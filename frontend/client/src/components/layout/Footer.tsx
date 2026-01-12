/**
 * Footer Component - Executive Precision Design System
 * Comprehensive footer with links, contact info, and newsletter signup
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  services: [
    { label: "Executive Search", href: "/services#executive-search" },
    { label: "Direct Hire", href: "/services#direct-hire" },
    { label: "RPO Solutions", href: "/services#rpo" },
    { label: "Contract Staffing", href: "/services#contract" },
  ],
  industries: [
    { label: "Technology", href: "/services#technology" },
    { label: "Finance", href: "/services#finance" },
    { label: "Healthcare", href: "/services#healthcare" },
    { label: "Manufacturing", href: "/services#manufacturing" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Salary Guide", href: "/salary-guide" },
    { label: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">
                Stay Updated with Industry Insights
              </h3>
              <p className="text-white/70">
                Get the latest recruitment trends and career advice delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 w-full lg:w-80"
              />
              <Button className="bg-orange hover:bg-orange-dark text-white whitespace-nowrap">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="flex items-center gap-3 mb-6 cursor-pointer">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                  <img src="/logo-header.png" alt="Talent Horizon" className="w-full h-full object-contain rounded-lg" />
                </div>
                <span className="font-display font-bold text-xl">
                  Talent<span className="text-orange">Horizon</span>
                </span>
              </div>
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              World-class executive recruitment and talent acquisition. We connect 
              exceptional leaders with organizations ready to grow.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@talenthorizon.com" className="flex items-center gap-3 text-white/70 hover:text-orange transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@talenthorizon.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-white/70 hover:text-orange transition-colors">
                <Phone className="w-5 h-5" />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span>123 Business Avenue<br />New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-white/70 hover:text-orange transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Industries</h4>
            <ul className="space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-white/70 hover:text-orange transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-white/70 hover:text-orange transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-white/70 hover:text-orange transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Talent Horizon. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy">
                <span className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
              <Link href="/terms">
                <span className="text-white/50 hover:text-white text-sm transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-orange hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
