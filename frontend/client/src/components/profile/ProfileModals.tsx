/**
 * Profile Edit Modals - All modals for editing profile sections
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Save, Trash2, Plus, Upload, Camera, Check, AlertCircle,
  Building2, GraduationCap, Award, Briefcase, Globe, MapPin,
  Mail, Phone, Linkedin, Github, Twitter, Calendar, Clock,
  ChevronDown, ExternalLink, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProfileData } from "@/data/profileData";

// Modal wrapper component
interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveLabel?: string;
  showDelete?: boolean;
  onDelete?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModalWrapper = ({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  saveLabel = "Save",
  showDelete = false,
  onDelete,
  size = 'md'
}: ModalWrapperProps) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-[#1e3a5f]">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {children}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <div>
              {showDelete && onDelete && (
                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {onSave && (
                <Button
                  onClick={onSave}
                  className="bg-[#1e3a5f] hover:bg-[#2d5a8a] text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveLabel}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Form field components
const FormField = ({ label, required, children, error }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-sm text-red-500 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

const SelectField = ({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

// Edit Profile Modal (Basic Info)
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (updates: Partial<ProfileData>) => void;
}

export const EditProfileModal = ({ isOpen, onClose, profile, onSave }: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    title: profile.title,
    tagline: profile.tagline,
  });

  useEffect(() => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title,
      tagline: profile.tagline,
    });
  }, [profile, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Edit Profile" onSave={handleSave}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name" required>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
            />
          </FormField>
          <FormField label="Last Name" required>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
            />
          </FormField>
        </div>
        <FormField label="Professional Title" required>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Senior Full-Stack Developer"
          />
        </FormField>
        <FormField label="Tagline">
          <Input
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Building scalable web applications..."
          />
        </FormField>
      </div>
    </ModalWrapper>
  );
};

// Edit Summary Modal
interface EditSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  overview: ProfileData['overview'];
  onSave: (updates: Partial<ProfileData['overview']>) => void;
}

export const EditSummaryModal = ({ isOpen, onClose, overview, onSave }: EditSummaryModalProps) => {
  const [formData, setFormData] = useState({
    summary: overview.summary,
    expectedSalary: overview.expectedSalary,
    yearsOfExperience: overview.yearsOfExperience,
    availability: overview.availability,
  });

  useEffect(() => {
    setFormData({
      summary: overview.summary,
      expectedSalary: overview.expectedSalary,
      yearsOfExperience: overview.yearsOfExperience,
      availability: overview.availability,
    });
  }, [overview, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Edit Professional Summary" onSave={handleSave} size="lg">
      <div className="space-y-4">
        <FormField label="Professional Summary" required>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
            placeholder="Describe your professional background, expertise, and what you bring to the table..."
          />
        </FormField>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Expected Salary ($)">
            <Input
              type="number"
              value={formData.expectedSalary}
              onChange={(e) => setFormData({ ...formData, expectedSalary: Number(e.target.value) })}
              placeholder="180000"
            />
          </FormField>
          <FormField label="Years of Experience">
            <Input
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
              placeholder="8"
            />
          </FormField>
          <FormField label="Availability">
            <SelectField
              value={formData.availability}
              onChange={(value) => setFormData({ ...formData, availability: value as any })}
              options={[
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'open-to-offers', label: 'Open to Offers' },
                { value: 'not-available', label: 'Not Available' },
              ]}
            />
          </FormField>
        </div>
      </div>
    </ModalWrapper>
  );
};

// Add/Edit Skill Modal
interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: ProfileData['skills'][0];
  onSave: (skill: ProfileData['skills'][0]) => void;
  onDelete?: () => void;
}

export const SkillModal = ({ isOpen, onClose, skill, onSave, onDelete }: SkillModalProps) => {
  const [formData, setFormData] = useState({
    id: skill?.id || '',
    name: skill?.name || '',
    level: skill?.level || 'intermediate' as const,
    yearsOfExperience: skill?.yearsOfExperience || 1,
    endorsements: skill?.endorsements || 0,
    verified: skill?.verified || false,
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience,
        endorsements: skill.endorsements,
        verified: skill.verified,
      });
    } else {
      setFormData({
        id: '',
        name: '',
        level: 'intermediate',
        yearsOfExperience: 1,
        endorsements: 0,
        verified: false,
      });
    }
  }, [skill, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={skill ? "Edit Skill" : "Add Skill"}
      onSave={handleSave}
      showDelete={!!skill}
      onDelete={onDelete}
    >
      <div className="space-y-4">
        <FormField label="Skill Name" required>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., React.js, Python, AWS"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Proficiency Level" required>
            <SelectField
              value={formData.level}
              onChange={(value) => setFormData({ ...formData, level: value as any })}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
                { value: 'expert', label: 'Expert' },
              ]}
            />
          </FormField>
          <FormField label="Years of Experience">
            <Input
              type="number"
              min={0}
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
              placeholder="3"
            />
          </FormField>
        </div>
      </div>
    </ModalWrapper>
  );
};

// Add/Edit Experience Modal
interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: ProfileData['experience'][0];
  onSave: (experience: ProfileData['experience'][0]) => void;
  onDelete?: () => void;
}

export const ExperienceModal = ({ isOpen, onClose, experience, onSave, onDelete }: ExperienceModalProps) => {
  const [formData, setFormData] = useState({
    id: experience?.id || '',
    title: experience?.title || '',
    company: experience?.company || '',
    location: experience?.location || '',
    locationType: experience?.locationType || 'onsite' as const,
    employmentType: experience?.employmentType || 'full-time' as const,
    startDate: experience?.startDate || '',
    endDate: experience?.endDate || '',
    current: experience?.current || false,
    description: experience?.description || '',
    achievements: experience?.achievements || [''],
    skills: experience?.skills || [],
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (experience) {
      setFormData({
        id: experience.id,
        title: experience.title,
        company: experience.company,
        location: experience.location,
        locationType: experience.locationType,
        employmentType: experience.employmentType,
        startDate: experience.startDate,
        endDate: experience.endDate || '',
        current: experience.current,
        description: experience.description,
        achievements: experience.achievements.length > 0 ? experience.achievements : [''],
        skills: experience.skills,
      });
    } else {
      setFormData({
        id: '',
        title: '',
        company: '',
        location: '',
        locationType: 'onsite',
        employmentType: 'full-time',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [''],
        skills: [],
      });
    }
  }, [experience, isOpen]);

  const handleSave = () => {
    onSave({
      ...formData,
      endDate: formData.current ? null : formData.endDate,
      achievements: formData.achievements.filter(a => a.trim() !== ''),
    });
    onClose();
  };

  const addAchievement = () => {
    setFormData({ ...formData, achievements: [...formData.achievements, ''] });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const removeAchievement = (index: number) => {
    setFormData({ ...formData, achievements: formData.achievements.filter((_, i) => i !== index) });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={experience ? "Edit Experience" : "Add Experience"}
      onSave={handleSave}
      showDelete={!!experience}
      onDelete={onDelete}
      size="lg"
    >
      <div className="space-y-4">
        <FormField label="Job Title" required>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Senior Software Engineer"
          />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Company" required>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="TechCorp Inc."
            />
          </FormField>
          <FormField label="Location">
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="San Francisco, CA"
            />
          </FormField>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Employment Type">
            <SelectField
              value={formData.employmentType}
              onChange={(value) => setFormData({ ...formData, employmentType: value as any })}
              options={[
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'freelance', label: 'Freelance' },
                { value: 'internship', label: 'Internship' },
              ]}
            />
          </FormField>
          <FormField label="Location Type">
            <SelectField
              value={formData.locationType}
              onChange={(value) => setFormData({ ...formData, locationType: value as any })}
              options={[
                { value: 'onsite', label: 'On-site' },
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
              ]}
            />
          </FormField>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" required>
            <Input
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              placeholder="January 2022"
            />
          </FormField>
          <FormField label="End Date">
            <Input
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              placeholder="December 2023"
              disabled={formData.current}
            />
          </FormField>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="current"
            checked={formData.current}
            onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
          />
          <label htmlFor="current" className="text-sm text-slate-700">I currently work here</label>
        </div>
        
        <FormField label="Description">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
            placeholder="Describe your role and responsibilities..."
          />
        </FormField>
        
        <FormField label="Key Achievements">
          <div className="space-y-2">
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  placeholder="Describe an achievement..."
                />
                {formData.achievements.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeAchievement(index)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addAchievement}>
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
          </div>
        </FormField>
        
        <FormField label="Skills Used">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button variant="outline" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 pr-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 p-0.5 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FormField>
      </div>
    </ModalWrapper>
  );
};

// Add/Edit Education Modal
interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education?: ProfileData['education'][0];
  onSave: (education: ProfileData['education'][0]) => void;
  onDelete?: () => void;
}

export const EducationModal = ({ isOpen, onClose, education, onSave, onDelete }: EducationModalProps) => {
  const [formData, setFormData] = useState({
    id: education?.id || '',
    degree: education?.degree || '',
    fieldOfStudy: education?.fieldOfStudy || '',
    school: education?.school || '',
    location: education?.location || '',
    startYear: education?.startYear || new Date().getFullYear(),
    endYear: education?.endYear || null,
    current: education?.current || false,
    gpa: education?.gpa || '',
    honors: education?.honors || '',
    activities: education?.activities || [],
    description: education?.description || '',
  });

  const [activityInput, setActivityInput] = useState('');

  useEffect(() => {
    if (education) {
      setFormData({
        id: education.id,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        school: education.school,
        location: education.location,
        startYear: education.startYear,
        endYear: education.endYear,
        current: education.current,
        gpa: education.gpa || '',
        honors: education.honors || '',
        activities: education.activities || [],
        description: education.description || '',
      });
    } else {
      setFormData({
        id: '',
        degree: '',
        fieldOfStudy: '',
        school: '',
        location: '',
        startYear: new Date().getFullYear(),
        endYear: null,
        current: false,
        gpa: '',
        honors: '',
        activities: [],
        description: '',
      });
    }
  }, [education, isOpen]);

  const handleSave = () => {
    onSave({
      ...formData,
      endYear: formData.current ? null : formData.endYear,
    });
    onClose();
  };

  const addActivity = () => {
    if (activityInput.trim() && !formData.activities?.includes(activityInput.trim())) {
      setFormData({ ...formData, activities: [...(formData.activities || []), activityInput.trim()] });
      setActivityInput('');
    }
  };

  const removeActivity = (activity: string) => {
    setFormData({ ...formData, activities: formData.activities?.filter(a => a !== activity) });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={education ? "Edit Education" : "Add Education"}
      onSave={handleSave}
      showDelete={!!education}
      onDelete={onDelete}
      size="lg"
    >
      <div className="space-y-4">
        <FormField label="School" required>
          <Input
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            placeholder="Stanford University"
          />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Degree" required>
            <Input
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="Bachelor of Science"
            />
          </FormField>
          <FormField label="Field of Study" required>
            <Input
              value={formData.fieldOfStudy}
              onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
              placeholder="Computer Science"
            />
          </FormField>
        </div>
        
        <FormField label="Location">
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Stanford, CA"
          />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Year" required>
            <Input
              type="number"
              value={formData.startYear}
              onChange={(e) => setFormData({ ...formData, startYear: Number(e.target.value) })}
              placeholder="2015"
            />
          </FormField>
          <FormField label="End Year">
            <Input
              type="number"
              value={formData.endYear || ''}
              onChange={(e) => setFormData({ ...formData, endYear: e.target.value ? Number(e.target.value) : null })}
              placeholder="2019"
              disabled={formData.current}
            />
          </FormField>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="currentEdu"
            checked={formData.current}
            onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
          />
          <label htmlFor="currentEdu" className="text-sm text-slate-700">I'm currently studying here</label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="GPA">
            <Input
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="3.8/4.0"
            />
          </FormField>
          <FormField label="Honors">
            <Input
              value={formData.honors}
              onChange={(e) => setFormData({ ...formData, honors: e.target.value })}
              placeholder="Magna Cum Laude"
            />
          </FormField>
        </div>
        
        <FormField label="Activities & Societies">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                placeholder="Add an activity..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
              />
              <Button variant="outline" onClick={addActivity}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.activities?.map((activity, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 pr-1">
                  {activity}
                  <button
                    onClick={() => removeActivity(activity)}
                    className="ml-1 p-0.5 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FormField>
        
        <FormField label="Description">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
            placeholder="Describe your studies, thesis, or notable projects..."
          />
        </FormField>
      </div>
    </ModalWrapper>
  );
};

// Add/Edit Certification Modal
interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification?: ProfileData['certifications'][0];
  onSave: (certification: ProfileData['certifications'][0]) => void;
  onDelete?: () => void;
}

export const CertificationModal = ({ isOpen, onClose, certification, onSave, onDelete }: CertificationModalProps) => {
  const [formData, setFormData] = useState({
    id: certification?.id || '',
    name: certification?.name || '',
    issuer: certification?.issuer || '',
    issueDate: certification?.issueDate || '',
    expirationDate: certification?.expirationDate || '',
    credentialId: certification?.credentialId || '',
    credentialUrl: certification?.credentialUrl || '',
    verified: certification?.verified || false,
  });

  useEffect(() => {
    if (certification) {
      setFormData({
        id: certification.id,
        name: certification.name,
        issuer: certification.issuer,
        issueDate: certification.issueDate,
        expirationDate: certification.expirationDate || '',
        credentialId: certification.credentialId || '',
        credentialUrl: certification.credentialUrl || '',
        verified: certification.verified,
      });
    } else {
      setFormData({
        id: '',
        name: '',
        issuer: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        credentialUrl: '',
        verified: false,
      });
    }
  }, [certification, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={certification ? "Edit Certification" : "Add Certification"}
      onSave={handleSave}
      showDelete={!!certification}
      onDelete={onDelete}
    >
      <div className="space-y-4">
        <FormField label="Certification Name" required>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="AWS Solutions Architect Professional"
          />
        </FormField>
        
        <FormField label="Issuing Organization" required>
          <Input
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            placeholder="Amazon Web Services"
          />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Issue Date" required>
            <Input
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              placeholder="March 2024"
            />
          </FormField>
          <FormField label="Expiration Date">
            <Input
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              placeholder="March 2027"
            />
          </FormField>
        </div>
        
        <FormField label="Credential ID">
          <Input
            value={formData.credentialId}
            onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
            placeholder="AWS-SAP-2024-12345"
          />
        </FormField>
        
        <FormField label="Credential URL">
          <Input
            value={formData.credentialUrl}
            onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
            placeholder="https://aws.amazon.com/verification/12345"
          />
        </FormField>
      </div>
    </ModalWrapper>
  );
};

// Add/Edit Portfolio Project Modal
interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProfileData['portfolio'][0];
  onSave: (project: ProfileData['portfolio'][0]) => void;
  onDelete?: () => void;
}

export const PortfolioModal = ({ isOpen, onClose, project, onSave, onDelete }: PortfolioModalProps) => {
  const [formData, setFormData] = useState({
    id: project?.id || '',
    title: project?.title || '',
    description: project?.description || '',
    thumbnail: project?.thumbnail || '',
    images: project?.images || [],
    projectUrl: project?.projectUrl || '',
    githubUrl: project?.githubUrl || '',
    category: project?.category || '',
    skills: project?.skills || [],
    completedDate: project?.completedDate || '',
    client: project?.client || '',
    testimonial: project?.testimonial || '',
    featured: project?.featured || false,
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        title: project.title,
        description: project.description,
        thumbnail: project.thumbnail,
        images: project.images,
        projectUrl: project.projectUrl || '',
        githubUrl: project.githubUrl || '',
        category: project.category,
        skills: project.skills,
        completedDate: project.completedDate,
        client: project.client || '',
        testimonial: project.testimonial || '',
        featured: project.featured,
      });
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        thumbnail: '',
        images: [],
        projectUrl: '',
        githubUrl: '',
        category: '',
        skills: [],
        completedDate: '',
        client: '',
        testimonial: '',
        featured: false,
      });
    }
  }, [project, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={project ? "Edit Project" : "Add Project"}
      onSave={handleSave}
      showDelete={!!project}
      onDelete={onDelete}
      size="lg"
    >
      <div className="space-y-4">
        <FormField label="Project Title" required>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="E-Commerce Platform Redesign"
          />
        </FormField>
        
        <FormField label="Description" required>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
            placeholder="Describe the project, your role, and the impact..."
          />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <SelectField
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              options={[
                { value: 'Web Application', label: 'Web Application' },
                { value: 'Mobile Application', label: 'Mobile Application' },
                { value: 'Data Visualization', label: 'Data Visualization' },
                { value: 'AI/ML Application', label: 'AI/ML Application' },
                { value: 'E-commerce', label: 'E-commerce' },
                { value: 'SaaS', label: 'SaaS' },
                { value: 'Other', label: 'Other' },
              ]}
              placeholder="Select category"
            />
          </FormField>
          <FormField label="Completion Date">
            <Input
              value={formData.completedDate}
              onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
              placeholder="October 2023"
            />
          </FormField>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Project URL">
            <Input
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </FormField>
          <FormField label="GitHub URL">
            <Input
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/user/repo"
            />
          </FormField>
        </div>
        
        <FormField label="Client (Optional)">
          <Input
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            placeholder="Client name or company"
          />
        </FormField>
        
        <FormField label="Technologies Used">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a technology..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button variant="outline" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 pr-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 p-0.5 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FormField>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
          />
          <label htmlFor="featured" className="text-sm text-slate-700">Feature this project on my profile</label>
        </div>
      </div>
    </ModalWrapper>
  );
};

// Add/Edit Language Modal
interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: ProfileData['languages'][0];
  languageIndex?: number;
  onSave: (language: ProfileData['languages'][0]) => void;
  onDelete?: () => void;
}

export const LanguageModal = ({ isOpen, onClose, language, onSave, onDelete }: LanguageModalProps) => {
  const [formData, setFormData] = useState({
    language: language?.language || '',
    proficiency: language?.proficiency || 'conversational' as const,
  });

  useEffect(() => {
    if (language) {
      setFormData({
        language: language.language,
        proficiency: language.proficiency,
      });
    } else {
      setFormData({
        language: '',
        proficiency: 'conversational',
      });
    }
  }, [language, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={language ? "Edit Language" : "Add Language"}
      onSave={handleSave}
      showDelete={!!language}
      onDelete={onDelete}
      size="sm"
    >
      <div className="space-y-4">
        <FormField label="Language" required>
          <Input
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            placeholder="e.g., Spanish, French, Mandarin"
          />
        </FormField>
        
        <FormField label="Proficiency Level" required>
          <SelectField
            value={formData.proficiency}
            onChange={(value) => setFormData({ ...formData, proficiency: value as any })}
            options={[
              { value: 'basic', label: 'Basic' },
              { value: 'conversational', label: 'Conversational' },
              { value: 'fluent', label: 'Fluent' },
              { value: 'native', label: 'Native or Bilingual' },
            ]}
          />
        </FormField>
      </div>
    </ModalWrapper>
  );
};

// Edit Contact Modal
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ProfileData['contact'];
  onSave: (contact: Partial<ProfileData['contact']>) => void;
}

export const ContactModal = ({ isOpen, onClose, contact, onSave }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    email: contact.email,
    phone: contact.phone,
    linkedin: contact.linkedin,
    github: contact.github,
    portfolio: contact.portfolio,
    twitter: contact.twitter,
  });

  useEffect(() => {
    setFormData({
      email: contact.email,
      phone: contact.phone,
      linkedin: contact.linkedin,
      github: contact.github,
      portfolio: contact.portfolio,
      twitter: contact.twitter,
    });
  }, [contact, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Edit Contact Information" onSave={handleSave}>
      <div className="space-y-4">
        <FormField label="Email" required>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </FormField>
        
        <FormField label="Phone">
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </FormField>
        
        <FormField label="LinkedIn">
          <Input
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
          />
        </FormField>
        
        <FormField label="GitHub">
          <Input
            value={formData.github}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            placeholder="github.com/johndoe"
          />
        </FormField>
        
        <FormField label="Portfolio Website">
          <Input
            value={formData.portfolio}
            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
            placeholder="johndoe.dev"
          />
        </FormField>
        
        <FormField label="Twitter">
          <Input
            value={formData.twitter}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            placeholder="@johndoe"
          />
        </FormField>
      </div>
    </ModalWrapper>
  );
};

// Edit Preferences Modal
interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ProfileData['preferences'];
  onSave: (preferences: Partial<ProfileData['preferences']>) => void;
}

export const PreferencesModal = ({ isOpen, onClose, preferences, onSave }: PreferencesModalProps) => {
  const [formData, setFormData] = useState({
    openToWork: preferences.openToWork,
    openToFreelance: preferences.openToFreelance,
    openToContract: preferences.openToContract,
    remotePreference: preferences.remotePreference,
    noticePeriod: preferences.noticePeriod,
    desiredSalary: {
      min: preferences.desiredSalary.min,
      max: preferences.desiredSalary.max,
      currency: preferences.desiredSalary.currency,
      period: preferences.desiredSalary.period,
    },
    desiredJobTypes: preferences.desiredJobTypes,
    desiredLocations: preferences.desiredLocations,
    industries: preferences.industries,
  });

  const [jobTypeInput, setJobTypeInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [industryInput, setIndustryInput] = useState('');

  useEffect(() => {
    setFormData({
      openToWork: preferences.openToWork,
      openToFreelance: preferences.openToFreelance,
      openToContract: preferences.openToContract,
      remotePreference: preferences.remotePreference,
      noticePeriod: preferences.noticePeriod,
      desiredSalary: {
        min: preferences.desiredSalary.min,
        max: preferences.desiredSalary.max,
        currency: preferences.desiredSalary.currency,
        period: preferences.desiredSalary.period,
      },
      desiredJobTypes: preferences.desiredJobTypes,
      desiredLocations: preferences.desiredLocations,
      industries: preferences.industries,
    });
  }, [preferences, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const addItem = (field: 'desiredJobTypes' | 'desiredLocations' | 'industries', value: string, setter: (v: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter('');
    }
  };

  const removeItem = (field: 'desiredJobTypes' | 'desiredLocations' | 'industries', value: string) => {
    setFormData({ ...formData, [field]: formData[field].filter(i => i !== value) });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Edit Employment Preferences" onSave={handleSave} size="lg">
      <div className="space-y-6">
        {/* Work Status */}
        <div className="space-y-3">
          <h3 className="font-medium text-slate-800">Work Status</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={formData.openToWork}
                onChange={(e) => setFormData({ ...formData, openToWork: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
              />
              <span className="text-slate-700">Open to full-time opportunities</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={formData.openToFreelance}
                onChange={(e) => setFormData({ ...formData, openToFreelance: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
              />
              <span className="text-slate-700">Open to freelance projects</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={formData.openToContract}
                onChange={(e) => setFormData({ ...formData, openToContract: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
              />
              <span className="text-slate-700">Open to contract work</span>
            </label>
          </div>
        </div>
        
        {/* Salary Expectations */}
        <div className="space-y-3">
          <h3 className="font-medium text-slate-800">Salary Expectations</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Minimum">
              <Input
                type="number"
                value={formData.desiredSalary.min}
                onChange={(e) => setFormData({
                  ...formData,
                  desiredSalary: { ...formData.desiredSalary, min: Number(e.target.value) }
                })}
                placeholder="180000"
              />
            </FormField>
            <FormField label="Maximum">
              <Input
                type="number"
                value={formData.desiredSalary.max}
                onChange={(e) => setFormData({
                  ...formData,
                  desiredSalary: { ...formData.desiredSalary, max: Number(e.target.value) }
                })}
                placeholder="250000"
              />
            </FormField>
            <FormField label="Period">
              <SelectField
                value={formData.desiredSalary.period}
                onChange={(value) => setFormData({
                  ...formData,
                  desiredSalary: { ...formData.desiredSalary, period: value as any }
                })}
                options={[
                  { value: 'hourly', label: 'Per Hour' },
                  { value: 'monthly', label: 'Per Month' },
                  { value: 'yearly', label: 'Per Year' },
                ]}
              />
            </FormField>
          </div>
        </div>
        
        {/* Remote Preference */}
        <FormField label="Remote Preference">
          <SelectField
            value={formData.remotePreference}
            onChange={(value) => setFormData({ ...formData, remotePreference: value as any })}
            options={[
              { value: 'remote-only', label: 'Remote Only' },
              { value: 'hybrid', label: 'Hybrid' },
              { value: 'onsite', label: 'On-site' },
              { value: 'flexible', label: 'Flexible' },
            ]}
          />
        </FormField>
        
        {/* Notice Period */}
        <FormField label="Notice Period">
          <Input
            value={formData.noticePeriod}
            onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
            placeholder="2 weeks"
          />
        </FormField>
        
        {/* Preferred Locations */}
        <FormField label="Preferred Locations">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Add a location..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('desiredLocations', locationInput, setLocationInput))}
              />
              <Button variant="outline" onClick={() => addItem('desiredLocations', locationInput, setLocationInput)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.desiredLocations.map((loc, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 pr-1">
                  {loc}
                  <button
                    onClick={() => removeItem('desiredLocations', loc)}
                    className="ml-1 p-0.5 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FormField>
        
        {/* Target Industries */}
        <FormField label="Target Industries">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                placeholder="Add an industry..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('industries', industryInput, setIndustryInput))}
              />
              <Button variant="outline" onClick={() => addItem('industries', industryInput, setIndustryInput)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.industries.map((ind, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 pr-1">
                  {ind}
                  <button
                    onClick={() => removeItem('industries', ind)}
                    className="ml-1 p-0.5 hover:bg-slate-200 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FormField>
      </div>
    </ModalWrapper>
  );
};

// Success Toast Component
export const SuccessToast = ({ message, isVisible, onClose }: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
        >
          <Check className="w-5 h-5" />
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
