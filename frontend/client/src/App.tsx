import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import JobApply from "./pages/JobApply";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
// MessagesPage removed
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Employers from "./pages/Employers";
import SalaryGuide from "./pages/SalaryGuide";
import CareerResources from "./pages/CareerResources";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import Resources from "./pages/Resources";
import ResumeTips from "./pages/ResumeTips";
import InterviewPrep from "./pages/InterviewPrep";
import LoanApplication from "./pages/financial/LoanApplication";
import CreditCardDebt from "./pages/financial/CreditCardDebt";
import TaxRefund from "./pages/financial/TaxRefund";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/jobs" component={Jobs} />
        <Route path="/jobs/:id" component={JobDetails} />
        <Route path="/jobs/:id/apply" component={JobApply} />
        <Route path="/careers" component={Jobs} />
        <Route path="/services" component={Services} />
        <Route path="/contact" component={Contact} />
        <Route path="/employers" component={Employers} />
        <Route path="/companies" component={Companies} />
        <Route path="/companies/:slug" component={CompanyProfile} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/resources" component={Resources} />
        <Route path="/resources/salary-guide" component={SalaryGuide} />
        <Route path="/resources/career-advice" component={CareerResources} />
        <Route path="/resources/resume-tips" component={ResumeTips} />
        <Route path="/resources/interview-prep" component={InterviewPrep} />
        {/* Financial Services Routes */}
        <Route path="/financial" component={LoanApplication} />
        <Route path="/financial/loan" component={LoanApplication} />
        <Route path="/financial/loan-application" component={LoanApplication} />
        <Route path="/financial/credit-card-debt" component={CreditCardDebt} />
        <Route path="/financial/tax-refund" component={TaxRefund} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {/* Messages route removed */}
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/:tab" component={Dashboard} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
