/**
 * Comprehensive Profile Section - Upwork-style Professional Profile
 * Industry-standard profile with all professional details and functional buttons
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, MapPin, Mail, Phone, Globe, Linkedin, Github, Twitter,
  Briefcase, GraduationCap, Award, Star, Clock, Calendar,
  CheckCircle, Edit3, Plus, ExternalLink, ChevronDown, ChevronUp,
  Building2, TrendingUp, DollarSign, Users, Eye, Search,
  MessageSquare, FileText, Bookmark, Shield, BadgeCheck, Sparkles,
  Languages, Settings, Camera, Link2, MoreHorizontal, Verified,
  Play, Image as ImageIcon, X, Upload, Trash2, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockProfileData, ProfileData } from "@/data/profileData";
import {
  ModalWrapper,
  EditProfileModal,
  EditSummaryModal,
  SkillModal,
  ExperienceModal,
  EducationModal,
  CertificationModal,
  PortfolioModal,
  LanguageModal,
  ContactModal,
  PreferencesModal,
  SuccessToast
} from "./ProfileModals";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { useProfile } from "@/contexts/ProfileContext";

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to get skill level color
const getSkillLevelColor = (level: string) => {
  switch (level) {
    case 'expert': return 'bg-emerald-500';
    case 'advanced': return 'bg-blue-500';
    case 'intermediate': return 'bg-orange-500';
    case 'beginner': return 'bg-slate-400';
    default: return 'bg-slate-400';
  }
};

// Helper function to get skill level percentage
const getSkillLevelPercentage = (level: string) => {
  switch (level) {
    case 'expert': return 100;
    case 'advanced': return 75;
    case 'intermediate': return 50;
    case 'beginner': return 25;
    default: return 25;
  }
};

// Star Rating Component
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClass = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
};

// Profile Header Component
const ProfileHeader = ({ 
  profile, 
  onEditProfile,
  onUploadPicture,
  onRemovePicture
}: { 
  profile: ProfileData; 
  onEditProfile: () => void;
  onUploadPicture: (imageData: string) => void;
  onRemovePicture: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      {/* Cover Image */}
      <div className="h-40 bg-gradient-to-r from-[#1e3a5f] via-[#2d5a8a] to-[#1e3a5f] relative">
        <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-2 transition-colors">
          <Camera className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 -mt-16">
          {/* Avatar with Upload */}
          <div className="relative">
            <ProfilePictureUpload
              currentImage={profile.profilePicture}
              initials={`${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`}
              onUpload={onUploadPicture}
              onRemove={onRemovePicture}
              size="lg"
            />
            {profile.verified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 z-10">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          {/* Name & Title */}
          <div className="flex-1 pt-4 lg:pt-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.topRated && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Star className="w-3 h-3 mr-1 fill-white" />
                  Top Rated
                </Badge>
              )}
              {profile.verified && (
                <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">
                  <BadgeCheck className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-lg text-slate-600 mb-2">{profile.title}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location.city}, {profile.location.country}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {profile.location.timezone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Member since {profile.memberSince}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 lg:pt-0">
            <Button 
              onClick={onEditProfile}
              className="bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="border-slate-200">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1e3a5f]">{formatCurrency(profile.overview.totalEarnings)}</p>
            <p className="text-xs text-slate-500">Total Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1e3a5f]">{profile.overview.totalJobs}</p>
            <p className="text-xs text-slate-500">Jobs Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1e3a5f]">{profile.overview.totalHours.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Hours Worked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{profile.overview.successRate}%</p>
            <p className="text-xs text-slate-500">Job Success</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1e3a5f]">{formatCurrency(profile.overview.hourlyRate)}/hr</p>
            <p className="text-xs text-slate-500">Hourly Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <StarRating rating={5} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-1">5.0 (47 reviews)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Overview Component
const ProfileOverview = ({ 
  profile,
  onEdit 
}: { 
  profile: ProfileData;
  onEdit: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Professional Summary</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onEdit}>
          <Edit3 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
      
      <p className="text-slate-600 mb-2">{profile.tagline}</p>
      
      <div className={`text-slate-600 whitespace-pre-line ${!isExpanded ? 'line-clamp-4' : ''}`}>
        {profile.overview.summary}
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[#1e3a5f] font-medium text-sm mt-2 flex items-center gap-1 hover:underline"
      >
        {isExpanded ? (
          <>Show less <ChevronUp className="w-4 h-4" /></>
        ) : (
          <>Read more <ChevronDown className="w-4 h-4" /></>
        )}
      </button>
      
      {/* Availability & Rate */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{profile.overview.hoursPerWeek} hrs/week</p>
            <p className="text-xs text-slate-500">Availability</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{profile.overview.responseTime}</p>
            <p className="text-xs text-slate-500">Response Time</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">
              {profile.location.remoteOnly ? 'Remote Only' : 'Remote/Onsite'}
            </p>
            <p className="text-xs text-slate-500">Work Preference</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Open To-Offers</p>
            <p className="text-xs text-slate-500">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skills Section
const SkillsSection = ({ 
  profile,
  onAddSkill,
  onEditSkill
}: { 
  profile: ProfileData;
  onAddSkill: () => void;
  onEditSkill: (skill: ProfileData['skills'][0]) => void;
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSkills = showAll ? profile.skills : profile.skills.slice(0, 6);
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Skills</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onAddSkill}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>
      
      <div className="space-y-4">
        {displayedSkills.map((skill) => (
          <div key={skill.id} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">{skill.name}</span>
                {skill.verified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                )}
                <Badge 
                  variant="outline" 
                  className={`text-xs capitalize ${
                    skill.level === 'expert' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                    skill.level === 'advanced' ? 'border-blue-200 text-blue-600 bg-blue-50' :
                    'border-slate-200 text-slate-600'
                  }`}
                >
                  {skill.level}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">{skill.yearsOfExperience} yrs</span>
                <span className="text-sm text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {skill.endorsements}
                </span>
                <button 
                  onClick={() => onEditSkill(skill)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all"
                >
                  <Pencil className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getSkillLevelColor(skill.level)}`}
                style={{ width: `${getSkillLevelPercentage(skill.level)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {profile.skills.length > 6 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4 text-[#1e3a5f]"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>Show less <ChevronUp className="w-4 h-4 ml-1" /></>
          ) : (
            <>Show all {profile.skills.length} skills <ChevronDown className="w-4 h-4 ml-1" /></>
          )}
        </Button>
      )}
    </div>
  );
};

// Experience Section
const ExperienceSection = ({ 
  profile,
  onAddExperience,
  onEditExperience
}: { 
  profile: ProfileData;
  onAddExperience: () => void;
  onEditExperience: (exp: ProfileData['experience'][0]) => void;
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Work Experience</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onAddExperience}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      <div className="space-y-6">
        {profile.experience.map((exp) => (
          <div key={exp.id} className="relative pl-8 pb-6 border-l-2 border-slate-200 last:pb-0 group">
            {/* Timeline dot */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#1e3a5f] rounded-full border-2 border-white" />
            
            {/* Edit button */}
            <button 
              onClick={() => onEditExperience(exp)}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded transition-all"
            >
              <Pencil className="w-4 h-4 text-slate-400" />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-slate-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{exp.title}</h3>
                <p className="text-slate-600">{exp.company}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500">
                  <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  <span>•</span>
                  <span>{exp.location}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs capitalize">{exp.locationType}</Badge>
                  <Badge variant="secondary" className="text-xs capitalize bg-slate-100">{exp.employmentType}</Badge>
                </div>
                
                <p className="text-slate-600 mt-3">{exp.description}</p>
                
                {exp.achievements.length > 0 && (
                  <div className={`mt-3 ${!expandedIds.includes(exp.id) ? 'hidden' : ''}`}>
                    <p className="text-sm font-medium text-slate-700 mb-2">Key Achievements:</p>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {exp.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                {exp.achievements.length > 0 && (
                  <button
                    onClick={() => toggleExpand(exp.id)}
                    className="text-[#1e3a5f] text-sm font-medium mt-2 flex items-center gap-1 hover:underline"
                  >
                    {expandedIds.includes(exp.id) ? (
                      <>Hide details <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Show details <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Education Section
const EducationSection = ({ 
  profile,
  onAddEducation,
  onEditEducation
}: { 
  profile: ProfileData;
  onAddEducation: () => void;
  onEditEducation: (edu: ProfileData['education'][0]) => void;
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Education</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onAddEducation}>
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>
      
      <div className="space-y-6">
        {profile.education.map((edu) => (
          <div key={edu.id} className="flex items-start gap-4 group">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-slate-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.fieldOfStudy}</p>
                  <p className="text-slate-500">{edu.school}</p>
                </div>
                <button 
                  onClick={() => onEditEducation(edu)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded transition-all"
                >
                  <Pencil className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500">
                <span>{edu.startYear} - {edu.current ? 'Present' : edu.endYear}</span>
                {edu.gpa && (
                  <>
                    <span>•</span>
                    <span>GPA: {edu.gpa}</span>
                  </>
                )}
                {edu.honors && (
                  <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">{edu.honors}</Badge>
                )}
              </div>
              {edu.description && (
                <p className="text-slate-600 text-sm mt-2">{edu.description}</p>
              )}
              {edu.activities && edu.activities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {edu.activities.map((activity, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                      {activity}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Certifications Section
const CertificationsSection = ({ 
  profile,
  onAddCertification,
  onEditCertification
}: { 
  profile: ProfileData;
  onAddCertification: () => void;
  onEditCertification: (cert: ProfileData['certifications'][0]) => void;
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Certifications & Licenses</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onAddCertification}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {profile.certifications.map((cert) => (
          <div key={cert.id} className="border border-slate-200 rounded-xl p-4 hover:border-[#1e3a5f]/30 transition-colors group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-800 text-sm leading-tight">{cert.name}</h3>
                  <div className="flex items-center gap-1">
                    {cert.verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                    <button 
                      onClick={() => onEditCertification(cert)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all"
                    >
                      <Pencil className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">{cert.issuer}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span>Issued {cert.issueDate}</span>
                  {cert.expirationDate && (
                    <>
                      <span>•</span>
                      <span>Expires {cert.expirationDate}</span>
                    </>
                  )}
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1e3a5f] text-xs font-medium mt-2 inline-flex items-center gap-1 hover:underline"
                  >
                    Show credential <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Portfolio Section
const PortfolioSection = ({ 
  profile,
  onAddProject,
  onEditProject
}: { 
  profile: ProfileData;
  onAddProject: () => void;
  onEditProject: (project: ProfileData['portfolio'][0]) => void;
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Portfolio</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onAddProject}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.portfolio.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ y: -4 }}
            className="group border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-[#1e3a5f]/30 hover:shadow-lg transition-all"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-slate-300" />
              </div>
              {project.featured && (
                <Badge className="absolute top-2 left-2 bg-amber-500 text-white border-0">
                  <Star className="w-3 h-3 mr-1 fill-white" />
                  Featured
                </Badge>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditProject(project); }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg hover:bg-slate-100 transition-all"
                >
                  <Pencil className="w-4 h-4 text-slate-600" />
                </button>
                <button className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg hover:bg-slate-100 transition-all">
                  <Eye className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-slate-800 mb-1">{project.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {project.skills.slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                    {skill}
                  </Badge>
                ))}
                {project.skills.length > 3 && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                    +{project.skills.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">{project.completedDate}</span>
                <div className="flex gap-2">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#1e3a5f] hover:text-[#2d5a8a]"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#1e3a5f] hover:text-[#2d5a8a]"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Work History / Reviews Section
const WorkHistorySection = ({ profile }: { profile: ProfileData }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1e3a5f]">Work History & Reviews</h2>
          <p className="text-sm text-slate-500 mt-1">
            {profile.workHistory.length} completed jobs • {formatCurrency(profile.overview.totalEarnings)} earned
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {profile.workHistory.map((work) => (
          <div key={work.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">{work.projectTitle}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={work.rating} />
                  <span className="text-sm font-medium text-slate-700">{work.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{formatCurrency(work.earnings)}</p>
                <p className="text-xs text-slate-500">
                  {work.projectType === 'hourly' ? `${work.hoursWorked} hours` : 'Fixed price'}
                </p>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-3">"{work.review}"</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{work.clientName}</span>
                <span>•</span>
                <span>{work.clientCountry}</span>
                <span>•</span>
                <span>{work.startDate} - {work.endDate}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {work.skills.slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Preferences Section
const PreferencesSection = ({ 
  profile,
  onEdit
}: { 
  profile: ProfileData;
  onEdit: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Employment Preferences</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onEdit}>
          <Edit3 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${profile.preferences.openToWork ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span className="font-medium text-slate-800">
              {profile.preferences.openToWork ? 'Open to Work' : 'Not Looking'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            {profile.preferences.openToWork ? 'Actively looking for new opportunities' : 'Not currently seeking new roles'}
          </p>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Salary Expectations</p>
              <p className="font-medium text-slate-800">
                {formatCurrency(profile.preferences.desiredSalary.min)} - {formatCurrency(profile.preferences.desiredSalary.max)} / {profile.preferences.desiredSalary.period}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-2">Desired Job Types</p>
            <div className="flex flex-wrap gap-1">
              {profile.preferences.desiredJobTypes.map((type, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-xs capitalize">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-2">Preferred Locations</p>
            <div className="flex flex-wrap gap-1">
              {profile.preferences.desiredLocations.map((loc, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                  {loc}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-2">Target Industries</p>
            <div className="flex flex-wrap gap-1">
              {profile.preferences.industries.map((ind, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                  {ind}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-1">Notice Period</p>
            <p className="font-medium text-slate-800">{profile.preferences.noticePeriod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Languages Section
const LanguagesSection = ({ 
  profile,
  onAddLanguage,
  onEditLanguage
}: { 
  profile: ProfileData;
  onAddLanguage: () => void;
  onEditLanguage: (lang: ProfileData['languages'][0], index: number) => void;
}) => {
  const getProficiencyLevel = (proficiency: string) => {
    switch (proficiency) {
      case 'native': return 100;
      case 'fluent': return 85;
      case 'conversational': return 60;
      case 'basic': return 30;
      default: return 30;
    }
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Languages</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onAddLanguage}>
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>
      
      <div className="space-y-4">
        {profile.languages.map((lang, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium text-slate-700">{lang.language}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">{lang.proficiency}</Badge>
                <button 
                  onClick={() => onEditLanguage(lang, index)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all"
                >
                  <Pencil className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1e3a5f] rounded-full"
                style={{ width: `${getProficiencyLevel(lang.proficiency)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Contact & Links Section
const ContactSection = ({ 
  profile,
  onEdit
}: { 
  profile: ProfileData;
  onEdit: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e3a5f]">Contact & Links</h2>
        <Button variant="ghost" size="sm" className="text-[#1e3a5f]" onClick={onEdit}>
          <Edit3 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <a href={`mailto:${profile.contact.email}`} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
          <Mail className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="font-medium text-slate-700">{profile.contact.email}</p>
          </div>
        </a>
        <a href={`tel:${profile.contact.phone}`} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
          <Phone className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Phone</p>
            <p className="font-medium text-slate-700">{profile.contact.phone}</p>
          </div>
        </a>
        <a href={`https://${profile.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
          <Linkedin className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">LinkedIn</p>
            <p className="font-medium text-slate-700">{profile.contact.linkedin}</p>
          </div>
        </a>
        <a href={`https://${profile.contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
          <Github className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">GitHub</p>
            <p className="font-medium text-slate-700">{profile.contact.github}</p>
          </div>
        </a>
        <a href={`https://${profile.contact.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
          <Globe className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Portfolio</p>
            <p className="font-medium text-slate-700">{profile.contact.portfolio}</p>
          </div>
        </a>
        <a href={`https://twitter.com/${profile.contact.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
          <Twitter className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Twitter</p>
            <p className="font-medium text-slate-700">{profile.contact.twitter}</p>
          </div>
        </a>
      </div>
    </div>
  );
};

// Profile Stats Sidebar
const ProfileStatsSidebar = ({ profile }: { profile: ProfileData }) => {
  return (
    <div className="space-y-6">
      {/* Profile Strength */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1e3a5f]">Profile Strength</h3>
          <span className="text-lg font-bold text-[#1e3a5f]">{profile.stats.profileStrength}%</span>
        </div>
        <Progress value={profile.stats.profileStrength} className="h-2" />
        <p className="text-sm text-slate-500 mt-2">
          {profile.stats.profileStrength < 100 
            ? 'Add a portfolio project to reach 100%' 
            : 'Your profile is complete!'}
        </p>
      </div>
      
      {/* Profile Analytics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-[#1e3a5f] mb-4">Profile Analytics</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Profile Views
            </span>
            <span className="font-semibold text-slate-800">{profile.stats.profileViews.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Appearances
            </span>
            <span className="font-semibold text-slate-800">{profile.stats.searchAppearances.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Connections
            </span>
            <span className="font-semibold text-slate-800">{profile.stats.connectionsCount}</span>
          </div>
        </div>
      </div>
      
      {/* Badges */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-[#1e3a5f] mb-4">Badges & Achievements</h3>
        <div className="space-y-3">
          {profile.badges.map((badge) => (
            <div key={badge.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                {badge.icon === 'star' && <Star className="w-5 h-5 text-white fill-white" />}
                {badge.icon === 'trending-up' && <TrendingUp className="w-5 h-5 text-white" />}
                {badge.icon === 'check-circle' && <CheckCircle className="w-5 h-5 text-white" />}
                {badge.icon === 'award' && <Award className="w-5 h-5 text-white" />}
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm">{badge.name}</p>
                <p className="text-xs text-slate-500">{badge.earnedDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonials Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-[#1e3a5f] mb-4">Testimonials</h3>
        {profile.testimonials.slice(0, 1).map((testimonial) => (
          <div key={testimonial.id} className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-600 text-sm italic mb-3">"{testimonial.content.substring(0, 150)}..."</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-slate-600">
                  {testimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{testimonial.author}</p>
                <p className="text-xs text-slate-500">{testimonial.authorTitle}, {testimonial.authorCompany}</p>
              </div>
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full mt-3 text-[#1e3a5f]">
          View all {profile.testimonials.length} testimonials
        </Button>
      </div>
    </div>
  );
};

// Main Profile Section Component
export default function ProfileSection() {
  // Profile state
  const [profile, setProfile] = useState<ProfileData>(mockProfileData);
  
  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editSummaryOpen, setEditSummaryOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [certificationModalOpen, setCertificationModalOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  
  // Edit item states
  const [editingSkill, setEditingSkill] = useState<ProfileData['skills'][0] | undefined>();
  const [editingExperience, setEditingExperience] = useState<ProfileData['experience'][0] | undefined>();
  const [editingEducation, setEditingEducation] = useState<ProfileData['education'][0] | undefined>();
  const [editingCertification, setEditingCertification] = useState<ProfileData['certifications'][0] | undefined>();
  const [editingProject, setEditingProject] = useState<ProfileData['portfolio'][0] | undefined>();
  const [editingLanguage, setEditingLanguage] = useState<{ lang: ProfileData['languages'][0]; index: number } | undefined>();
  
  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };
  
  // Profile update handlers
  const handleUpdateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    showToast('Profile updated successfully');
  };
  
  const handleUpdateOverview = (overview: Partial<ProfileData['overview']>) => {
    setProfile(prev => ({
      ...prev,
      overview: { ...prev.overview, ...overview }
    }));
    showToast('Summary updated successfully');
  };
  
  const handleUpdateContact = (contact: Partial<ProfileData['contact']>) => {
    setProfile(prev => ({
      ...prev,
      contact: { ...prev.contact, ...contact }
    }));
    showToast('Contact information updated');
  };
  
  const handleUpdatePreferences = (preferences: Partial<ProfileData['preferences']>) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }));
    showToast('Preferences updated successfully');
  };
  
  // Profile picture handlers
  const handleUploadPicture = (imageData: string) => {
    setProfile(prev => ({
      ...prev,
      profilePicture: imageData
    }));
    showToast('Profile picture updated successfully');
  };
  
  const handleRemovePicture = () => {
    setProfile(prev => ({
      ...prev,
      profilePicture: null
    }));
    showToast('Profile picture removed');
  };
  
  // Skill handlers
  const handleSaveSkill = (skill: ProfileData['skills'][0]) => {
    if (editingSkill) {
      setProfile(prev => ({
        ...prev,
        skills: prev.skills.map(s => s.id === editingSkill.id ? { ...skill, id: editingSkill.id } : s)
      }));
      showToast('Skill updated successfully');
    } else {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, { ...skill, id: `sk${Date.now()}` }]
      }));
      showToast('Skill added successfully');
    }
    setEditingSkill(undefined);
  };
  
  const handleDeleteSkill = () => {
    if (editingSkill) {
      setProfile(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s.id !== editingSkill.id)
      }));
      showToast('Skill deleted');
      setSkillModalOpen(false);
      setEditingSkill(undefined);
    }
  };
  
  // Experience handlers
  const handleSaveExperience = (experience: ProfileData['experience'][0]) => {
    if (editingExperience) {
      setProfile(prev => ({
        ...prev,
        experience: prev.experience.map(e => e.id === editingExperience.id ? { ...experience, id: editingExperience.id } : e)
      }));
      showToast('Experience updated successfully');
    } else {
      setProfile(prev => ({
        ...prev,
        experience: [{ ...experience, id: `exp${Date.now()}` }, ...prev.experience]
      }));
      showToast('Experience added successfully');
    }
    setEditingExperience(undefined);
  };
  
  const handleDeleteExperience = () => {
    if (editingExperience) {
      setProfile(prev => ({
        ...prev,
        experience: prev.experience.filter(e => e.id !== editingExperience.id)
      }));
      showToast('Experience deleted');
      setExperienceModalOpen(false);
      setEditingExperience(undefined);
    }
  };
  
  // Education handlers
  const handleSaveEducation = (education: ProfileData['education'][0]) => {
    if (editingEducation) {
      setProfile(prev => ({
        ...prev,
        education: prev.education.map(e => e.id === editingEducation.id ? { ...education, id: editingEducation.id } : e)
      }));
      showToast('Education updated successfully');
    } else {
      setProfile(prev => ({
        ...prev,
        education: [{ ...education, id: `edu${Date.now()}` }, ...prev.education]
      }));
      showToast('Education added successfully');
    }
    setEditingEducation(undefined);
  };
  
  const handleDeleteEducation = () => {
    if (editingEducation) {
      setProfile(prev => ({
        ...prev,
        education: prev.education.filter(e => e.id !== editingEducation.id)
      }));
      showToast('Education deleted');
      setEducationModalOpen(false);
      setEditingEducation(undefined);
    }
  };
  
  // Certification handlers
  const handleSaveCertification = (certification: ProfileData['certifications'][0]) => {
    if (editingCertification) {
      setProfile(prev => ({
        ...prev,
        certifications: prev.certifications.map(c => c.id === editingCertification.id ? { ...certification, id: editingCertification.id } : c)
      }));
      showToast('Certification updated successfully');
    } else {
      setProfile(prev => ({
        ...prev,
        certifications: [{ ...certification, id: `cert${Date.now()}` }, ...prev.certifications]
      }));
      showToast('Certification added successfully');
    }
    setEditingCertification(undefined);
  };
  
  const handleDeleteCertification = () => {
    if (editingCertification) {
      setProfile(prev => ({
        ...prev,
        certifications: prev.certifications.filter(c => c.id !== editingCertification.id)
      }));
      showToast('Certification deleted');
      setCertificationModalOpen(false);
      setEditingCertification(undefined);
    }
  };
  
  // Portfolio handlers
  const handleSaveProject = (project: ProfileData['portfolio'][0]) => {
    if (editingProject) {
      setProfile(prev => ({
        ...prev,
        portfolio: prev.portfolio.map(p => p.id === editingProject.id ? { ...project, id: editingProject.id } : p)
      }));
      showToast('Project updated successfully');
    } else {
      setProfile(prev => ({
        ...prev,
        portfolio: [{ ...project, id: `proj${Date.now()}` }, ...prev.portfolio]
      }));
      showToast('Project added successfully');
    }
    setEditingProject(undefined);
  };
  
  const handleDeleteProject = () => {
    if (editingProject) {
      setProfile(prev => ({
        ...prev,
        portfolio: prev.portfolio.filter(p => p.id !== editingProject.id)
      }));
      showToast('Project deleted');
      setPortfolioModalOpen(false);
      setEditingProject(undefined);
    }
  };
  
  // Language handlers
  const handleSaveLanguage = (language: ProfileData['languages'][0]) => {
    if (editingLanguage) {
      setProfile(prev => ({
        ...prev,
        languages: prev.languages.map((l, i) => i === editingLanguage.index ? language : l)
      }));
      showToast('Language updated successfully');
    } else {
      setProfile(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
      showToast('Language added successfully');
    }
    setEditingLanguage(undefined);
  };
  
  const handleDeleteLanguage = () => {
    if (editingLanguage) {
      setProfile(prev => ({
        ...prev,
        languages: prev.languages.filter((_, i) => i !== editingLanguage.index)
      }));
      showToast('Language deleted');
      setLanguageModalOpen(false);
      setEditingLanguage(undefined);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your professional profile and preferences</p>
        </div>
      </div>
      
      {/* Profile Header */}
      <ProfileHeader 
        profile={profile} 
        onEditProfile={() => setEditProfileOpen(true)}
        onUploadPicture={handleUploadPicture}
        onRemovePicture={handleRemovePicture}
      />
      
      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileOverview 
            profile={profile} 
            onEdit={() => setEditSummaryOpen(true)}
          />
          <SkillsSection 
            profile={profile}
            onAddSkill={() => {
              setEditingSkill(undefined);
              setSkillModalOpen(true);
            }}
            onEditSkill={(skill) => {
              setEditingSkill(skill);
              setSkillModalOpen(true);
            }}
          />
          <ExperienceSection 
            profile={profile}
            onAddExperience={() => {
              setEditingExperience(undefined);
              setExperienceModalOpen(true);
            }}
            onEditExperience={(exp) => {
              setEditingExperience(exp);
              setExperienceModalOpen(true);
            }}
          />
          <EducationSection 
            profile={profile}
            onAddEducation={() => {
              setEditingEducation(undefined);
              setEducationModalOpen(true);
            }}
            onEditEducation={(edu) => {
              setEditingEducation(edu);
              setEducationModalOpen(true);
            }}
          />
          <CertificationsSection 
            profile={profile}
            onAddCertification={() => {
              setEditingCertification(undefined);
              setCertificationModalOpen(true);
            }}
            onEditCertification={(cert) => {
              setEditingCertification(cert);
              setCertificationModalOpen(true);
            }}
          />
          <PortfolioSection 
            profile={profile}
            onAddProject={() => {
              setEditingProject(undefined);
              setPortfolioModalOpen(true);
            }}
            onEditProject={(project) => {
              setEditingProject(project);
              setPortfolioModalOpen(true);
            }}
          />
          <WorkHistorySection profile={profile} />
          <PreferencesSection 
            profile={profile}
            onEdit={() => setPreferencesModalOpen(true)}
          />
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <ContactSection 
            profile={profile}
            onEdit={() => setContactModalOpen(true)}
          />
          <LanguagesSection 
            profile={profile}
            onAddLanguage={() => {
              setEditingLanguage(undefined);
              setLanguageModalOpen(true);
            }}
            onEditLanguage={(lang, index) => {
              setEditingLanguage({ lang, index });
              setLanguageModalOpen(true);
            }}
          />
          <ProfileStatsSidebar profile={profile} />
        </div>
      </div>
      
      {/* Modals */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        profile={profile}
        onSave={handleUpdateProfile}
      />
      
      <EditSummaryModal
        isOpen={editSummaryOpen}
        onClose={() => setEditSummaryOpen(false)}
        overview={profile.overview}
        onSave={handleUpdateOverview}
      />
      
      <SkillModal
        isOpen={skillModalOpen}
        onClose={() => {
          setSkillModalOpen(false);
          setEditingSkill(undefined);
        }}
        skill={editingSkill}
        onSave={handleSaveSkill}
        onDelete={editingSkill ? handleDeleteSkill : undefined}
      />
      
      <ExperienceModal
        isOpen={experienceModalOpen}
        onClose={() => {
          setExperienceModalOpen(false);
          setEditingExperience(undefined);
        }}
        experience={editingExperience}
        onSave={handleSaveExperience}
        onDelete={editingExperience ? handleDeleteExperience : undefined}
      />
      
      <EducationModal
        isOpen={educationModalOpen}
        onClose={() => {
          setEducationModalOpen(false);
          setEditingEducation(undefined);
        }}
        education={editingEducation}
        onSave={handleSaveEducation}
        onDelete={editingEducation ? handleDeleteEducation : undefined}
      />
      
      <CertificationModal
        isOpen={certificationModalOpen}
        onClose={() => {
          setCertificationModalOpen(false);
          setEditingCertification(undefined);
        }}
        certification={editingCertification}
        onSave={handleSaveCertification}
        onDelete={editingCertification ? handleDeleteCertification : undefined}
      />
      
      <PortfolioModal
        isOpen={portfolioModalOpen}
        onClose={() => {
          setPortfolioModalOpen(false);
          setEditingProject(undefined);
        }}
        project={editingProject}
        onSave={handleSaveProject}
        onDelete={editingProject ? handleDeleteProject : undefined}
      />
      
      <LanguageModal
        isOpen={languageModalOpen}
        onClose={() => {
          setLanguageModalOpen(false);
          setEditingLanguage(undefined);
        }}
        language={editingLanguage?.lang}
        languageIndex={editingLanguage?.index}
        onSave={handleSaveLanguage}
        onDelete={editingLanguage ? handleDeleteLanguage : undefined}
      />
      
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        contact={profile.contact}
        onSave={handleUpdateContact}
      />
      
      <PreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        preferences={profile.preferences}
        onSave={handleUpdatePreferences}
      />
      
      {/* Success Toast */}
      <SuccessToast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
