/**
 * Login Page - Executive Precision Design System
 * User authentication page
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('frontendToken');
    if (token) {
      // Already logged in, redirect to dashboard
      window.location.replace('/dashboard');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Try frontend tRPC auth first
      const frontendResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const frontendData = await frontendResponse.json();
      
      if (frontendResponse.ok && frontendData.token) {
        // Store frontend token for tRPC calls
        localStorage.setItem('frontendToken', frontendData.token);
        
        // Store user info
        if (frontendData.user) {
          localStorage.setItem('user', JSON.stringify(frontendData.user));
        }
        
        console.log('Login successful, token stored');
        toast.success("Login successful! Redirecting to dashboard...");
        
        // Set redirecting state to show loading
        setIsRedirecting(true);
        
        // Use window.location.replace for a hard redirect
        setTimeout(() => {
          window.location.replace('/dashboard');
        }, 300);
        return;
      }
      
      // If frontend auth failed, show error
      toast.error(frontendData.error || "Invalid email or password");
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please check your connection.");
    } finally {
      if (!isRedirecting) {
        setIsLoading(false);
      }
    }
  };

  // Show loading screen when redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange mx-auto mb-4" />
          <p className="text-lg text-slate-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 mb-8 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-orange to-orange-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">T</span>
              </div>
              <span className="font-display font-bold text-xl text-navy">
                Talent<span className="text-orange">Horizon</span>
              </span>
            </div>
          </Link>

          <h1 className="font-display text-3xl font-bold text-navy mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 mb-8">
            Sign in to access your dashboard and manage your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-orange hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-gray-300" />
              <Label htmlFor="remember" className="text-sm font-normal text-slate-600">
                Remember me for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              size="lg"
              className="w-full bg-orange hover:bg-orange-dark text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-600 mt-8">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-orange font-medium hover:underline cursor-pointer">
                Create one now
              </span>
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img 
            src="/images/career-growth.jpg" 
            alt="Career growth" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy/90 to-navy/70" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-lg">
            <h2 className="font-display text-3xl font-bold mb-4">
              Your Career Journey Starts Here
            </h2>
            <p className="text-white/80 text-lg">
              Access exclusive job opportunities, track your applications, 
              and connect with top employers through your personalized dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
