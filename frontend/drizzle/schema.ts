import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(), // Optional for local auth
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }), // Hashed password for local auth
  loginMethod: varchar("loginMethod", { length: 64 }).default("local"),
  role: mysqlEnum("role", ["user", "admin", "employer"]).default("user").notNull(),
  // Profile fields
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  headline: varchar("headline", { length: 255 }),
  summary: text("summary"),
  avatarUrl: text("avatarUrl"),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  profileComplete: boolean("profileComplete").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Companies table for employer profiles
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  size: mysqlEnum("size", ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]),
  website: varchar("website", { length: 500 }),
  logoUrl: text("logoUrl"),
  coverImageUrl: text("coverImageUrl"),
  location: varchar("location", { length: 255 }),
  foundedYear: int("foundedYear"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Jobs table for job listings
 */
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  benefits: text("benefits"),
  department: varchar("department", { length: 100 }),
  location: varchar("location", { length: 255 }).notNull(),
  locationType: mysqlEnum("locationType", ["remote", "onsite", "hybrid"]).default("onsite"),
  jobType: mysqlEnum("jobType", ["full-time", "part-time", "contract", "internship", "temporary"]).default("full-time"),
  experienceLevel: mysqlEnum("experienceLevel", ["entry", "mid", "senior", "executive"]).default("mid"),
  salaryMin: int("salaryMin"),
  salaryMax: int("salaryMax"),
  salaryType: mysqlEnum("salaryType", ["hourly", "annual"]).default("annual"),
  showSalary: boolean("showSalary").default(true),
  skills: json("skills").$type<string[]>(),
  featured: boolean("featured").default(false),
  urgent: boolean("urgent").default(false),
  status: mysqlEnum("status", ["draft", "active", "paused", "closed", "filled"]).default("active"),
  applicationDeadline: timestamp("applicationDeadline"),
  viewCount: int("viewCount").default(0),
  applicationCount: int("applicationCount").default(0),
  postedAt: timestamp("postedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Resumes table for user CV uploads
 */
export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileType: varchar("fileType", { length: 50 }),
  fileSize: int("fileSize"),
  isDefault: boolean("isDefault").default(false),
  parsedData: json("parsedData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;

/**
 * Applications table for job applications
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  userId: int("userId").notNull(),
  resumeId: int("resumeId"),
  coverLetter: text("coverLetter"),
  status: mysqlEnum("status", ["submitted", "reviewing", "shortlisted", "interview", "offer", "hired", "rejected", "withdrawn"]).default("submitted"),
  screeningAnswers: json("screeningAnswers"),
  notes: text("notes"),
  rating: int("rating"),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Saved jobs table
 */
export const savedJobs = mysqlTable("saved_jobs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  jobId: int("jobId").notNull(),
  savedAt: timestamp("savedAt").defaultNow().notNull(),
});

export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = typeof savedJobs.$inferInsert;

/**
 * Job alerts table
 */
export const jobAlerts = mysqlTable("job_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  keywords: varchar("keywords", { length: 500 }),
  location: varchar("location", { length: 255 }),
  jobType: varchar("jobType", { length: 100 }),
  salaryMin: int("salaryMin"),
  frequency: mysqlEnum("frequency", ["daily", "weekly", "instant"]).default("daily"),
  active: boolean("active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JobAlert = typeof jobAlerts.$inferSelect;
export type InsertJobAlert = typeof jobAlerts.$inferInsert;

/**
 * Work experience table for user profiles
 */
export const workExperience = mysqlTable("work_experience", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  current: boolean("current").default(false),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WorkExperience = typeof workExperience.$inferSelect;
export type InsertWorkExperience = typeof workExperience.$inferInsert;

/**
 * Education table for user profiles
 */
export const education = mysqlTable("education", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 255 }),
  fieldOfStudy: varchar("fieldOfStudy", { length: 255 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  current: boolean("current").default(false),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Education = typeof education.$inferSelect;
export type InsertEducation = typeof education.$inferInsert;

/**
 * Skills table for user profiles
 */
export const userSkills = mysqlTable("user_skills", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced", "expert"]).default("intermediate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserSkill = typeof userSkills.$inferSelect;
export type InsertUserSkill = typeof userSkills.$inferInsert;


/**
 * Messages table for user-to-user and admin-to-user messaging
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: varchar("conversationId", { length: 100 }).notNull(),
  senderId: int("senderId").notNull(),
  senderName: varchar("senderName", { length: 255 }),
  senderTitle: varchar("senderTitle", { length: 255 }),
  senderAvatarUrl: varchar("senderAvatarUrl", { length: 500 }),
  recipientId: int("recipientId").notNull(),
  applicationId: int("applicationId"), // Optional link to job application
  jobId: int("jobId"), // Optional link to job
  companyId: int("companyId"), // Optional link to company
  subject: varchar("subject", { length: 500 }),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  isArchived: boolean("isArchived").default(false),
  parentId: int("parentId"), // For threaded replies
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
