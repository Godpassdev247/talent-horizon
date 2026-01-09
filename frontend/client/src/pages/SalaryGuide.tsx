/**
 * Salary Guide Page - Industry salary information
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, DollarSign, TrendingUp, MapPin, Briefcase,
  ChevronDown, Filter, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const salaryData = [
  { title: "Software Engineer", avgSalary: 125000, minSalary: 85000, maxSalary: 180000, growth: "+8%", category: "Technology" },
  { title: "Senior Software Engineer", avgSalary: 165000, minSalary: 130000, maxSalary: 220000, growth: "+10%", category: "Technology" },
  { title: "Product Manager", avgSalary: 145000, minSalary: 100000, maxSalary: 200000, growth: "+12%", category: "Product" },
  { title: "Data Scientist", avgSalary: 140000, minSalary: 95000, maxSalary: 190000, growth: "+15%", category: "Data" },
  { title: "UX Designer", avgSalary: 110000, minSalary: 75000, maxSalary: 155000, growth: "+9%", category: "Design" },
  { title: "DevOps Engineer", avgSalary: 135000, minSalary: 100000, maxSalary: 180000, growth: "+11%", category: "Technology" },
  { title: "Marketing Manager", avgSalary: 95000, minSalary: 65000, maxSalary: 140000, growth: "+6%", category: "Marketing" },
  { title: "Financial Analyst", avgSalary: 85000, minSalary: 60000, maxSalary: 120000, growth: "+5%", category: "Finance" },
  { title: "HR Manager", avgSalary: 90000, minSalary: 65000, maxSalary: 130000, growth: "+4%", category: "Human Resources" },
  { title: "Sales Manager", avgSalary: 105000, minSalary: 70000, maxSalary: 160000, growth: "+7%", category: "Sales" },
  { title: "Project Manager", avgSalary: 100000, minSalary: 70000, maxSalary: 145000, growth: "+6%", category: "Management" },
  { title: "Machine Learning Engineer", avgSalary: 175000, minSalary: 130000, maxSalary: 250000, growth: "+20%", category: "Technology" },
];

const categories = ["All", "Technology", "Product", "Data", "Design", "Marketing", "Finance", "Human Resources", "Sales", "Management"];

export default function SalaryGuide() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("avgSalary");

  const filteredData = salaryData
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "avgSalary") return b.avgSalary - a.avgSalary;
      if (sortBy === "growth") return parseFloat(b.growth) - parseFloat(a.growth);
      return a.title.localeCompare(b.title);
    });

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-navy py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Salary <span className="text-orange">Guide</span> 2026
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Comprehensive salary data to help you negotiate better and make informed career decisions.
            </p>
            <div className="bg-white rounded-xl p-3 shadow-lg max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search job titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-0 bg-slate-50 focus-visible:ring-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-navy mb-1">$125K</div>
              <p className="text-sm text-slate-500">Average Tech Salary</p>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-orange mb-1">+12%</div>
              <p className="text-sm text-slate-500">YoY Growth</p>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-navy mb-1">500+</div>
              <p className="text-sm text-slate-500">Job Titles Analyzed</p>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-navy mb-1">50K+</div>
              <p className="text-sm text-slate-500">Data Points</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avgSalary">Highest Salary</SelectItem>
                <SelectItem value="growth">Highest Growth</SelectItem>
                <SelectItem value="title">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-slate-500">
              Showing {filteredData.length} of {salaryData.length} positions
            </div>
          </div>

          {/* Salary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-orange/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-navy text-lg mb-1">
                      {item.title}
                    </h3>
                    <span className="text-sm text-slate-500">{item.category}</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-600 text-sm font-medium bg-slate-100 px-2 py-1 rounded">
                    <TrendingUp className="w-3 h-3" />
                    {item.growth}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display text-2xl font-bold text-navy">
                      {formatSalary(item.avgSalary)}
                    </span>
                    <span className="text-sm text-slate-500">/year</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    Range: {formatSalary(item.minSalary)} - {formatSalary(item.maxSalary)}
                  </div>
                </div>

                {/* Salary Bar */}
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange to-orange-dark rounded-full"
                    style={{ 
                      width: `${((item.avgSalary - 50000) / (250000 - 50000)) * 100}%` 
                    }}
                  />
                </div>

                <Button variant="ghost" className="w-full mt-4 text-orange hover:text-orange-dark hover:bg-orange/5">
                  View Jobs
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-navy mb-2">No results found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-navy py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Browse thousands of jobs with competitive salaries from top companies.
          </p>
          <Button className="bg-orange hover:bg-orange-dark text-white text-lg h-12 px-8">
            Browse Jobs
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
