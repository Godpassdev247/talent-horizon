import { Link } from "wouter";
import { MapPin, Clock, Building2, DollarSign, Bookmark, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "../../../../drizzle/schema";

interface JobCardProps {
  job: Job;
  showSaveButton?: boolean;
  onSave?: (jobId: number) => void;
  isSaved?: boolean;
}

export default function JobCard({ job, showSaveButton = false, onSave, isSaved = false }: JobCardProps) {
  const formatSalary = (min?: number | null, max?: number | null, type?: string | null) => {
    if (!min && !max) return null;
    const format = (n: number) => {
      if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
      return `$${n}`;
    };
    if (min && max) {
      return `${format(min)} - ${format(max)}${type === 'hourly' ? '/hr' : '/yr'}`;
    }
    if (min) return `From ${format(min)}${type === 'hourly' ? '/hr' : '/yr'}`;
    if (max) return `Up to ${format(max)}${type === 'hourly' ? '/hr' : '/yr'}`;
    return null;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const jobTypeColors: Record<string, string> = {
    "full-time": "bg-slate-100 text-slate-700",
    "part-time": "bg-slate-100 text-slate-600",
    "contract": "bg-slate-100 text-slate-600",
    "internship": "bg-slate-100 text-slate-500",
    "temporary": "bg-slate-100 text-slate-500",
  };

  const locationTypeColors: Record<string, string> = {
    "remote": "bg-slate-200 text-slate-700",
    "onsite": "bg-slate-100 text-slate-600",
    "hybrid": "bg-slate-150 text-slate-600",
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryType);

  return (
    <div className="group bg-white rounded-xl p-6 border border-slate-100 hover:border-orange/30 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <Link href={`/jobs/${job.id}`}>
              <h3 className="font-display font-semibold text-navy text-lg hover:text-orange transition-colors cursor-pointer line-clamp-1">
                {job.title}
              </h3>
            </Link>
            <p className="text-slate-500 text-sm">{job.department || "General"}</p>
          </div>
        </div>
        {showSaveButton && (
          <button
            onClick={() => onSave?.(job.id)}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? "bg-orange/10 text-orange" 
                : "hover:bg-slate-100 text-slate-400"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.jobType && (
          <Badge variant="secondary" className={jobTypeColors[job.jobType] || "bg-slate-100"}>
            {job.jobType.replace("-", " ")}
          </Badge>
        )}
        {job.locationType && (
          <Badge variant="secondary" className={locationTypeColors[job.locationType] || "bg-slate-100"}>
            {job.locationType}
          </Badge>
        )}
        {job.experienceLevel && (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            {job.experienceLevel}
          </Badge>
        )}
        {job.featured && (
          <Badge className="bg-orange text-white">Featured</Badge>
        )}
        {job.urgent && (
          <Badge className="bg-slate-700 text-white">Urgent</Badge>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        {salary && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium text-navy">{salary}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{getTimeAgo(job.postedAt)}</span>
        </div>
      </div>

      {job.skills && (
        <div className="flex flex-wrap gap-1 mb-4">
          {(typeof job.skills === 'string' ? JSON.parse(job.skills) : job.skills).slice(0, 3).map((skill: string) => (
            <span
              key={skill}
              className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded"
            >
              {skill}
            </span>
          ))}
          {(typeof job.skills === 'string' ? JSON.parse(job.skills) : job.skills).length > 3 && (
            <span className="px-2 py-1 text-slate-400 text-xs">
              +{(typeof job.skills === 'string' ? JSON.parse(job.skills) : job.skills).length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <Link href={`/jobs/${job.id}`} className="flex-1">
          <Button variant="outline" className="w-full border-orange text-orange hover:bg-orange hover:text-white">
            View Details
          </Button>
        </Link>
        <Link href={`/jobs/${job.id}/apply`}>
          <Button className="bg-orange hover:bg-orange-dark text-white">
            Apply Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
