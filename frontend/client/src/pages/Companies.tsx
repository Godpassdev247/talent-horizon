/**
 * Companies Page - Browse all companies
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Search, Building2, MapPin, Users, Briefcase, 
  Filter, Star, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";

const industries = ["All Industries", "Technology", "Finance", "Healthcare", "Manufacturing", "Retail", "Consulting"];
const sizes = ["All Sizes", "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedSize, setSelectedSize] = useState("All Sizes");

  const { data: companies, isLoading } = trpc.companies.getAll.useQuery();

  const filteredCompanies = companies?.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === "All Industries" || company.industry === selectedIndustry;
    const matchesSize = selectedSize === "All Sizes" || company.size === selectedSize;
    return matchesSearch && matchesIndustry && matchesSize;
  }) || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-navy py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Explore <span className="text-orange">Companies</span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Discover top employers and find the perfect company culture for your career.
            </p>
            <div className="bg-white rounded-xl p-3 shadow-lg max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-0 bg-slate-50 focus-visible:ring-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full md:w-48">
                <Users className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map(size => (
                  <SelectItem key={size} value={size}>{size === "All Sizes" ? size : `${size} employees`}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-slate-500">
              {filteredCompanies.length} companies found
            </div>
          </div>

          {/* Companies Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-16 bg-slate-200 rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 rounded w-20" />
                    <div className="h-6 bg-slate-200 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/companies/${company.slug}`}>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-orange/20 transition-all cursor-pointer group h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange/10 transition-colors">
                          {company.logoUrl ? (
                            <img src={company.logoUrl} alt={company.name} className="w-10 h-10 object-contain" />
                          ) : (
                            <Building2 className="w-8 h-8 text-slate-400 group-hover:text-orange transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-navy text-lg group-hover:text-orange transition-colors truncate">
                            {company.name}
                          </h3>
                          <p className="text-sm text-slate-500">{company.industry}</p>
                        </div>
                        {company.verified && (
                          <Badge className="bg-slate-100 text-slate-600 border-0">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {company.description || "A great place to work and grow your career."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {company.location && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {company.location}
                          </span>
                        )}
                        {company.size && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Users className="w-3 h-3" />
                            {company.size} employees
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-sm text-orange font-medium flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          View Open Positions
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-navy mb-2">No companies found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
