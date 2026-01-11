/**
 * Jobs Page - Advanced Job Search with Filters
 */

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { 
  Search, MapPin, Filter, X, ChevronDown, Briefcase,
  SlidersHorizontal, Grid, List, ArrowUpDown
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import { trpc } from "@/lib/trpc";

const jobTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];

const experienceLevels = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "executive", label: "Executive" },
];

const locationTypes = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

const salaryRanges = [
  { value: "0-50000", label: "Under $50K", min: 0, max: 50000 },
  { value: "50000-100000", label: "$50K - $100K", min: 50000, max: 100000 },
  { value: "100000-150000", label: "$100K - $150K", min: 100000, max: 150000 },
  { value: "150000-200000", label: "$150K - $200K", min: 150000, max: 200000 },
  { value: "200000+", label: "$200K+", min: 200000, max: undefined },
];

export default function Jobs() {
  const searchParams = useSearch();
  const [, navigate] = useLocation();
  
  // Parse URL params
  const params = new URLSearchParams(searchParams);
  const initialKeyword = params.get("q") || "";
  const initialLocation = params.get("location") || "";
  
  // Search state
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocationInput] = useState(initialLocation);
  const [jobType, setJobType] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [locationType, setLocationType] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "salary" | "relevance">("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const { toast } = useToast();

  // Build query params
  const queryParams = {
    keyword: keyword || undefined,
    location: location || undefined,
    jobType: jobType || undefined,
    experienceLevel: experienceLevel || undefined,
    locationType: locationType || undefined,
    salaryMin: salaryRange ? salaryRanges.find(r => r.value === salaryRange)?.min : undefined,
    salaryMax: salaryRange ? salaryRanges.find(r => r.value === salaryRange)?.max : undefined,
    sortBy,
    limit: 20,
  };

  // Fetch jobs
  const { data, isLoading, refetch } = trpc.jobs.search.useQuery(queryParams);

  // Load saved jobs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedJobIds(parsed.map((j: any) => j.id));
      } catch (e) {
        console.error('Error parsing saved jobs:', e);
      }
    }
  }, []);

  // Handle save/unsave job
  const handleSaveJob = (jobId: number) => {
    const saved = localStorage.getItem('savedJobs');
    let savedJobs: any[] = [];
    try {
      savedJobs = saved ? JSON.parse(saved) : [];
    } catch (e) {
      savedJobs = [];
    }

    const isAlreadySaved = savedJobs.some((j: any) => j.id === jobId);
    
    if (isAlreadySaved) {
      // Remove from saved
      savedJobs = savedJobs.filter((j: any) => j.id !== jobId);
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
      toast({
        title: "Job removed",
        description: "Job has been removed from your saved list.",
      });
    } else {
      // Add to saved - find the job data
      const job = data?.jobs?.find(j => j.id === jobId);
      if (job) {
        savedJobs.push({
          id: job.id,
          title: job.title,
          companyName: job.companyName,
          location: job.location,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          salaryType: job.salaryType,
          jobType: job.jobType,
          locationType: job.locationType,
          savedAt: new Date().toISOString(),
        });
        setSavedJobIds(prev => [...prev, jobId]);
        toast({
          title: "Job saved!",
          description: "Job has been added to your saved list.",
        });
      }
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  };

  // Active filters count
  const activeFiltersCount = [jobType, experienceLevel, locationType, salaryRange].filter(Boolean).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (keyword) newParams.set("q", keyword);
    if (location) newParams.set("location", location);
    navigate(`/jobs?${newParams.toString()}`);
    refetch();
  };

  const clearFilters = () => {
    setJobType("");
    setExperienceLevel("");
    setLocationType("");
    setSalaryRange("");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Job Type */}
      <div>
        <Label className="text-sm font-semibold text-navy mb-3 block">Job Type</Label>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={jobType === type.value}
                onCheckedChange={(checked) => setJobType(checked ? type.value : "")}
              />
              <label htmlFor={`type-${type.value}`} className="text-sm text-slate-600 cursor-pointer">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <Label className="text-sm font-semibold text-navy mb-3 block">Experience Level</Label>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <div key={level.value} className="flex items-center gap-2">
              <Checkbox
                id={`level-${level.value}`}
                checked={experienceLevel === level.value}
                onCheckedChange={(checked) => setExperienceLevel(checked ? level.value : "")}
              />
              <label htmlFor={`level-${level.value}`} className="text-sm text-slate-600 cursor-pointer">
                {level.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Location Type */}
      <div>
        <Label className="text-sm font-semibold text-navy mb-3 block">Work Location</Label>
        <div className="space-y-2">
          {locationTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <Checkbox
                id={`loc-${type.value}`}
                checked={locationType === type.value}
                onCheckedChange={(checked) => setLocationType(checked ? type.value : "")}
              />
              <label htmlFor={`loc-${type.value}`} className="text-sm text-slate-600 cursor-pointer">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <Label className="text-sm font-semibold text-navy mb-3 block">Salary Range</Label>
        <div className="space-y-2">
          {salaryRanges.map((range) => (
            <div key={range.value} className="flex items-center gap-2">
              <Checkbox
                id={`salary-${range.value}`}
                checked={salaryRange === range.value}
                onCheckedChange={(checked) => setSalaryRange(checked ? range.value : "")}
              />
              <label htmlFor={`salary-${range.value}`} className="text-sm text-slate-600 cursor-pointer">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Search Header */}
      <div className="bg-navy py-8">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-white mb-6">
            Find Your Perfect Job
          </h1>
          <form onSubmit={handleSearch} className="bg-white rounded-xl p-3 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-12 h-12 border-0 bg-slate-50 focus-visible:ring-0"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="pl-12 h-12 border-0 bg-slate-50 focus-visible:ring-0"
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-orange hover:bg-orange-dark text-white">
                Search Jobs
              </Button>
            </div>
          </form>
        </div>
      </div>

      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-navy">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="bg-orange/10 text-orange">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Jobs Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-slate-600">
                    {isLoading ? (
                      "Searching..."
                    ) : (
                      <>
                        <span className="font-semibold text-navy">{data?.total || 0}</span> jobs found
                        {keyword && <> for "<span className="font-medium">{keyword}</span>"</>}
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-2 bg-orange text-white">{activeFiltersCount}</Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger className="w-40">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Most Recent</SelectItem>
                      <SelectItem value="salary">Highest Salary</SelectItem>
                      <SelectItem value="relevance">Relevance</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="hidden sm:flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-navy text-white" : "bg-white text-slate-600"}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-navy text-white" : "bg-white text-slate-600"}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {jobType && (
                    <Badge variant="secondary" className="gap-1">
                      {jobTypes.find(t => t.value === jobType)?.label}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setJobType("")} />
                    </Badge>
                  )}
                  {experienceLevel && (
                    <Badge variant="secondary" className="gap-1">
                      {experienceLevels.find(l => l.value === experienceLevel)?.label}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setExperienceLevel("")} />
                    </Badge>
                  )}
                  {locationType && (
                    <Badge variant="secondary" className="gap-1">
                      {locationTypes.find(l => l.value === locationType)?.label}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setLocationType("")} />
                    </Badge>
                  )}
                  {salaryRange && (
                    <Badge variant="secondary" className="gap-1">
                      {salaryRanges.find(r => r.value === salaryRange)?.label}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSalaryRange("")} />
                    </Badge>
                  )}
                </div>
              )}

              {/* Jobs Grid/List */}
              {isLoading ? (
                <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                      <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : data?.jobs && data.jobs.length > 0 ? (
                <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
                  {data.jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <JobCard 
                      job={job} 
                      showSaveButton 
                      onSave={handleSaveJob}
                      isSaved={savedJobIds.includes(job.id)}
                    />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl">
                  <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-navy mb-2">
                    No jobs found
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Try adjusting your search criteria or clearing some filters.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
