/**
 * Profile Context - State management for user profile
 * Handles all profile data and CRUD operations
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProfileData, mockProfileData } from '@/data/profileData';

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  updateOverview: (overview: Partial<ProfileData['overview']>) => void;
  updateLocation: (location: Partial<ProfileData['location']>) => void;
  updateContact: (contact: Partial<ProfileData['contact']>) => void;
  
  // Skills
  addSkill: (skill: ProfileData['skills'][0]) => void;
  updateSkill: (skillId: string, updates: Partial<ProfileData['skills'][0]>) => void;
  deleteSkill: (skillId: string) => void;
  
  // Experience
  addExperience: (experience: ProfileData['experience'][0]) => void;
  updateExperience: (expId: string, updates: Partial<ProfileData['experience'][0]>) => void;
  deleteExperience: (expId: string) => void;
  
  // Education
  addEducation: (education: ProfileData['education'][0]) => void;
  updateEducation: (eduId: string, updates: Partial<ProfileData['education'][0]>) => void;
  deleteEducation: (eduId: string) => void;
  
  // Certifications
  addCertification: (certification: ProfileData['certifications'][0]) => void;
  updateCertification: (certId: string, updates: Partial<ProfileData['certifications'][0]>) => void;
  deleteCertification: (certId: string) => void;
  
  // Portfolio
  addPortfolioProject: (project: ProfileData['portfolio'][0]) => void;
  updatePortfolioProject: (projectId: string, updates: Partial<ProfileData['portfolio'][0]>) => void;
  deletePortfolioProject: (projectId: string) => void;
  
  // Languages
  addLanguage: (language: ProfileData['languages'][0]) => void;
  updateLanguage: (index: number, updates: Partial<ProfileData['languages'][0]>) => void;
  deleteLanguage: (index: number) => void;
  
  // Preferences
  updatePreferences: (preferences: Partial<ProfileData['preferences']>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(mockProfileData);
  
  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };
  
  const updateOverview = (overview: Partial<ProfileData['overview']>) => {
    setProfile(prev => ({
      ...prev,
      overview: { ...prev.overview, ...overview }
    }));
  };
  
  const updateLocation = (location: Partial<ProfileData['location']>) => {
    setProfile(prev => ({
      ...prev,
      location: { ...prev.location, ...location }
    }));
  };
  
  const updateContact = (contact: Partial<ProfileData['contact']>) => {
    setProfile(prev => ({
      ...prev,
      contact: { ...prev.contact, ...contact }
    }));
  };
  
  // Skills CRUD
  const addSkill = (skill: ProfileData['skills'][0]) => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: `sk${Date.now()}` }]
    }));
  };
  
  const updateSkill = (skillId: string, updates: Partial<ProfileData['skills'][0]>) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === skillId ? { ...s, ...updates } : s)
    }));
  };
  
  const deleteSkill = (skillId: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId)
    }));
  };
  
  // Experience CRUD
  const addExperience = (experience: ProfileData['experience'][0]) => {
    setProfile(prev => ({
      ...prev,
      experience: [{ ...experience, id: `exp${Date.now()}` }, ...prev.experience]
    }));
  };
  
  const updateExperience = (expId: string, updates: Partial<ProfileData['experience'][0]>) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === expId ? { ...e, ...updates } : e)
    }));
  };
  
  const deleteExperience = (expId: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== expId)
    }));
  };
  
  // Education CRUD
  const addEducation = (education: ProfileData['education'][0]) => {
    setProfile(prev => ({
      ...prev,
      education: [{ ...education, id: `edu${Date.now()}` }, ...prev.education]
    }));
  };
  
  const updateEducation = (eduId: string, updates: Partial<ProfileData['education'][0]>) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === eduId ? { ...e, ...updates } : e)
    }));
  };
  
  const deleteEducation = (eduId: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== eduId)
    }));
  };
  
  // Certifications CRUD
  const addCertification = (certification: ProfileData['certifications'][0]) => {
    setProfile(prev => ({
      ...prev,
      certifications: [{ ...certification, id: `cert${Date.now()}` }, ...prev.certifications]
    }));
  };
  
  const updateCertification = (certId: string, updates: Partial<ProfileData['certifications'][0]>) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === certId ? { ...c, ...updates } : c)
    }));
  };
  
  const deleteCertification = (certId: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== certId)
    }));
  };
  
  // Portfolio CRUD
  const addPortfolioProject = (project: ProfileData['portfolio'][0]) => {
    setProfile(prev => ({
      ...prev,
      portfolio: [{ ...project, id: `proj${Date.now()}` }, ...prev.portfolio]
    }));
  };
  
  const updatePortfolioProject = (projectId: string, updates: Partial<ProfileData['portfolio'][0]>) => {
    setProfile(prev => ({
      ...prev,
      portfolio: prev.portfolio.map(p => p.id === projectId ? { ...p, ...updates } : p)
    }));
  };
  
  const deletePortfolioProject = (projectId: string) => {
    setProfile(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(p => p.id !== projectId)
    }));
  };
  
  // Languages CRUD
  const addLanguage = (language: ProfileData['languages'][0]) => {
    setProfile(prev => ({
      ...prev,
      languages: [...prev.languages, language]
    }));
  };
  
  const updateLanguage = (index: number, updates: Partial<ProfileData['languages'][0]>) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.map((l, i) => i === index ? { ...l, ...updates } : l)
    }));
  };
  
  const deleteLanguage = (index: number) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };
  
  // Preferences
  const updatePreferences = (preferences: Partial<ProfileData['preferences']>) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }));
  };
  
  return (
    <ProfileContext.Provider value={{
      profile,
      updateProfile,
      updateOverview,
      updateLocation,
      updateContact,
      addSkill,
      updateSkill,
      deleteSkill,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      addCertification,
      updateCertification,
      deleteCertification,
      addPortfolioProject,
      updatePortfolioProject,
      deletePortfolioProject,
      addLanguage,
      updateLanguage,
      deleteLanguage,
      updatePreferences,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
