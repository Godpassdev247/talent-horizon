import { eq, and, like, or, desc, asc, sql, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  companies, InsertCompany,
  jobs, InsertJob,
  resumes, InsertResume,
  applications, InsertApplication,
  savedJobs, InsertSavedJob,
  jobAlerts, InsertJobAlert,
  workExperience, InsertWorkExperience,
  education, InsertEducation,
  userSkills, InsertUserSkill
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Export db for direct access (with schema for query builder)
export const db = {
  query: {
    users: {
      findFirst: async (options: { where: any }) => {
        const database = await getDb();
        if (!database) return null;
        const result = await database.select().from(users).where(options.where).limit(1);
        return result[0] || null;
      },
    },
  },
  insert: (table: any) => ({
    values: async (data: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");
      return database.insert(table).values(data);
    },
  }),
  update: (table: any) => ({
    set: (data: any) => ({
      where: async (condition: any) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");
        return database.update(table).set(data).where(condition);
      },
    }),
  }),
};

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER QUERIES ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
      email: user.email || `${user.openId}@placeholder.local`, // Email is required
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone", "location", "headline", "summary", "avatarUrl", "linkedinUrl", "websiteUrl"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      // Skip email assignment here since it's already set above
      if (field !== 'email') {
        (values as any)[field] = normalized;
      }
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.profileComplete !== undefined) {
      values.profileComplete = user.profileComplete;
      updateSet.profileComplete = user.profileComplete;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
}

// ============ COMPANY QUERIES ============

export async function getCompanies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companies).orderBy(desc(companies.createdAt));
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCompanyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCompany(data: InsertCompany) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(companies).values(data);
  return result[0].insertId;
}

// ============ JOB QUERIES ============

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  locationType?: string;
  department?: string;
  companyId?: number;
  featured?: boolean;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'salary' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export async function searchJobs(params: JobSearchParams = {}) {
  const db = await getDb();
  if (!db) return { jobs: [], total: 0 };

  const conditions = [];
  
  const statusValue = (params.status || 'active') as 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  conditions.push(eq(jobs.status, statusValue));

  if (params.keyword) {
    conditions.push(
      or(
        like(jobs.title, `%${params.keyword}%`),
        like(jobs.description, `%${params.keyword}%`)
      )
    );
  }

  if (params.location) {
    conditions.push(like(jobs.location, `%${params.location}%`));
  }

  if (params.jobType) {
    conditions.push(eq(jobs.jobType, params.jobType as any));
  }

  if (params.experienceLevel) {
    conditions.push(eq(jobs.experienceLevel, params.experienceLevel as any));
  }

  if (params.locationType) {
    conditions.push(eq(jobs.locationType, params.locationType as any));
  }

  if (params.salaryMin) {
    conditions.push(gte(jobs.salaryMin, params.salaryMin));
  }

  if (params.salaryMax) {
    conditions.push(lte(jobs.salaryMax, params.salaryMax));
  }

  if (params.department) {
    conditions.push(eq(jobs.department, params.department));
  }

  if (params.companyId) {
    conditions.push(eq(jobs.companyId, params.companyId));
  }

  if (params.featured !== undefined) {
    conditions.push(eq(jobs.featured, params.featured));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobs)
    .where(whereClause);
  const total = countResult[0]?.count || 0;

  let orderBy;
  if (params.sortBy === 'salary') {
    orderBy = params.sortOrder === 'asc' ? asc(jobs.salaryMax) : desc(jobs.salaryMax);
  } else if (params.sortBy === 'date') {
    orderBy = params.sortOrder === 'asc' ? asc(jobs.postedAt) : desc(jobs.postedAt);
  } else {
    orderBy = desc(jobs.postedAt);
  }

  const jobResults = await db
    .select()
    .from(jobs)
    .where(whereClause)
    .orderBy(desc(jobs.featured), orderBy)
    .limit(params.limit || 20)
    .offset(params.offset || 0);

  return { jobs: jobResults, total };
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getJobBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createJob(data: InsertJob) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(jobs).values(data);
  return result[0].insertId;
}

export async function updateJob(id: number, data: Partial<InsertJob>) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobs).set({ ...data, updatedAt: new Date() }).where(eq(jobs.id, id));
}

export async function incrementJobViewCount(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobs).set({ viewCount: sql`${jobs.viewCount} + 1` }).where(eq(jobs.id, id));
}

export async function getFeaturedJobs(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(jobs)
    .where(and(eq(jobs.featured, true), eq(jobs.status, 'active')))
    .orderBy(desc(jobs.postedAt))
    .limit(limit);
}

export async function getRecentJobs(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(jobs)
    .where(eq(jobs.status, 'active'))
    .orderBy(desc(jobs.postedAt))
    .limit(limit);
}

// ============ RESUME QUERIES ============

export async function getUserResumes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.createdAt));
}

export async function getResumeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(resumes).where(eq(resumes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createResume(data: InsertResume) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(resumes).values(data);
  return result[0].insertId;
}

export async function deleteResume(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(resumes).where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
}

export async function setDefaultResume(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(resumes).set({ isDefault: false }).where(eq(resumes.userId, userId));
  await db.update(resumes).set({ isDefault: true }).where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
}

// ============ APPLICATION QUERIES ============

export async function getUserApplications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(applications).where(eq(applications.userId, userId)).orderBy(desc(applications.appliedAt));
}

export async function getJobApplications(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.appliedAt));
}

export async function getApplicationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createApplication(data: InsertApplication) {
  const db = await getDb();
  if (!db) return undefined;
  
  const existing = await db
    .select()
    .from(applications)
    .where(and(eq(applications.jobId, data.jobId), eq(applications.userId, data.userId)))
    .limit(1);
  
  if (existing.length > 0) {
    throw new Error("You have already applied to this job");
  }
  
  const result = await db.insert(applications).values(data);
  
  await db.update(jobs).set({ applicationCount: sql`${jobs.applicationCount} + 1` }).where(eq(jobs.id, data.jobId));
  
  return result[0].insertId;
}

export async function updateApplicationStatus(id: number, status: string, notes?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(applications).set({ status: status as any, notes, updatedAt: new Date() }).where(eq(applications.id, id));
}

export async function hasUserApplied(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(applications)
    .where(and(eq(applications.userId, userId), eq(applications.jobId, jobId)))
    .limit(1);
  return result.length > 0;
}

// ============ SAVED JOBS QUERIES ============

export async function getUserSavedJobs(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savedJobs).where(eq(savedJobs.userId, userId)).orderBy(desc(savedJobs.savedAt));
}

export async function saveJob(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db
    .select()
    .from(savedJobs)
    .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)))
    .limit(1);
  
  if (existing.length > 0) return;
  
  await db.insert(savedJobs).values({ userId, jobId });
}

export async function unsaveJob(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(savedJobs).where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
}

export async function isJobSaved(userId: number, jobId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(savedJobs)
    .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)))
    .limit(1);
  return result.length > 0;
}

// ============ JOB ALERTS QUERIES ============

export async function getUserJobAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobAlerts).where(eq(jobAlerts.userId, userId)).orderBy(desc(jobAlerts.createdAt));
}

export async function createJobAlert(data: InsertJobAlert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(jobAlerts).values(data);
  return result[0].insertId;
}

export async function updateJobAlert(id: number, userId: number, data: Partial<InsertJobAlert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(jobAlerts).set({ ...data, updatedAt: new Date() }).where(and(eq(jobAlerts.id, id), eq(jobAlerts.userId, userId)));
}

export async function deleteJobAlert(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(jobAlerts).where(and(eq(jobAlerts.id, id), eq(jobAlerts.userId, userId)));
}

// ============ WORK EXPERIENCE QUERIES ============

export async function getUserWorkExperience(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workExperience).where(eq(workExperience.userId, userId)).orderBy(desc(workExperience.startDate));
}

export async function addWorkExperience(data: InsertWorkExperience) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(workExperience).values(data);
  return result[0].insertId;
}

export async function updateWorkExperience(id: number, userId: number, data: Partial<InsertWorkExperience>) {
  const db = await getDb();
  if (!db) return;
  await db.update(workExperience).set(data).where(and(eq(workExperience.id, id), eq(workExperience.userId, userId)));
}

export async function deleteWorkExperience(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(workExperience).where(and(eq(workExperience.id, id), eq(workExperience.userId, userId)));
}

// ============ EDUCATION QUERIES ============

export async function getUserEducation(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(education).where(eq(education.userId, userId)).orderBy(desc(education.startDate));
}

export async function addEducation(data: InsertEducation) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(education).values(data);
  return result[0].insertId;
}

export async function updateEducation(id: number, userId: number, data: Partial<InsertEducation>) {
  const db = await getDb();
  if (!db) return;
  await db.update(education).set(data).where(and(eq(education.id, id), eq(education.userId, userId)));
}

export async function deleteEducation(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(education).where(and(eq(education.id, id), eq(education.userId, userId)));
}

// ============ USER SKILLS QUERIES ============

export async function getUserSkills(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userSkills).where(eq(userSkills.userId, userId)).orderBy(asc(userSkills.name));
}

export async function addUserSkill(data: InsertUserSkill) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(userSkills).values(data);
  return result[0].insertId;
}

export async function deleteUserSkill(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(userSkills).where(and(eq(userSkills.id, id), eq(userSkills.userId, userId)));
}

// ============ STATS QUERIES ============

export async function getDashboardStats(userId: number) {
  const db = await getDb();
  if (!db) return { applications: 0, savedJobs: 0, profileViews: 0, interviews: 0 };

  const [appCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(eq(applications.userId, userId));

  const [savedCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(savedJobs)
    .where(eq(savedJobs.userId, userId));

  const [interviewCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(and(eq(applications.userId, userId), eq(applications.status, 'interview')));

  return {
    applications: appCount?.count || 0,
    savedJobs: savedCount?.count || 0,
    profileViews: Math.floor(Math.random() * 50) + 10,
    interviews: interviewCount?.count || 0,
  };
}

// ============ SEED DATA ============

export async function seedInitialData() {
  const db = await getDb();
  if (!db) return;

  const existingCompanies = await db.select().from(companies).limit(1);
  if (existingCompanies.length > 0) return;

  const companyData: InsertCompany[] = [
    { name: "TechVentures Inc.", slug: "techventures", industry: "Technology", size: "201-500", location: "San Francisco, CA", description: "Leading technology company specializing in cloud infrastructure and enterprise solutions.", verified: true },
    { name: "Global Finance Corp", slug: "global-finance", industry: "Finance", size: "1000+", location: "New York, NY", description: "Premier financial services firm providing investment banking, asset management, and advisory services.", verified: true },
    { name: "HealthFirst Systems", slug: "healthfirst", industry: "Healthcare", size: "501-1000", location: "Boston, MA", description: "Innovative healthcare technology company transforming patient care through digital solutions.", verified: true },
    { name: "Innovation Labs", slug: "innovation-labs", industry: "Technology", size: "51-200", location: "Austin, TX", description: "Cutting-edge R&D company focused on AI and machine learning applications.", verified: true },
    { name: "SaaS Solutions Ltd.", slug: "saas-solutions", industry: "Technology", size: "201-500", location: "Seattle, WA", description: "Enterprise SaaS platform helping businesses streamline operations and boost productivity.", verified: true },
    { name: "Consumer Brands Co.", slug: "consumer-brands", industry: "Retail", size: "1000+", location: "Chicago, IL", description: "Leading consumer goods company with a portfolio of iconic brands.", verified: true },
    { name: "AI Innovations", slug: "ai-innovations", industry: "Technology", size: "51-200", location: "Remote", description: "Pioneering AI research company developing next-generation machine learning solutions.", verified: true },
    { name: "PayTech Solutions", slug: "paytech", industry: "Finance", size: "201-500", location: "San Jose, CA", description: "Fintech company revolutionizing digital payments and financial services.", verified: true },
  ];

  for (const company of companyData) {
    await db.insert(companies).values(company);
  }

  const allCompanies = await db.select().from(companies);
  const companyMap = new Map(allCompanies.map(c => [c.slug, c.id]));

  const jobData: InsertJob[] = [
    {
      companyId: companyMap.get("techventures")!,
      title: "Senior Software Engineer",
      slug: "senior-software-engineer-techventures",
      description: "We are looking for a Senior Software Engineer to join our cloud infrastructure team. You will be responsible for designing and implementing scalable systems that power our enterprise solutions.",
      requirements: "5+ years of experience in software development. Strong proficiency in Python, Go, or Java. Experience with cloud platforms (AWS, GCP, or Azure). Knowledge of microservices architecture and distributed systems.",
      benefits: "Competitive salary and equity package. Comprehensive health, dental, and vision insurance. 401(k) with company match. Unlimited PTO. Remote work flexibility.",
      department: "Engineering",
      location: "San Francisco, CA",
      locationType: "hybrid",
      jobType: "full-time",
      experienceLevel: "senior",
      salaryMin: 150000,
      salaryMax: 200000,
      salaryType: "annual",
      skills: ["Python", "Go", "AWS", "Kubernetes", "PostgreSQL"],
      featured: true,
      status: "active",
    },
    {
      companyId: companyMap.get("global-finance")!,
      title: "Chief Financial Officer",
      slug: "cfo-global-finance",
      description: "Global Finance Corp is seeking an experienced CFO to lead our financial strategy and operations. This executive role will drive financial planning, risk management, and investor relations.",
      requirements: "15+ years of progressive finance experience. Previous CFO or VP Finance experience at a public company. CPA and/or MBA preferred. Strong knowledge of GAAP and financial regulations.",
      benefits: "Executive compensation package. Performance bonuses. Equity participation. Executive health benefits.",
      department: "Executive",
      location: "New York, NY",
      locationType: "onsite",
      jobType: "full-time",
      experienceLevel: "executive",
      salaryMin: 300000,
      salaryMax: 450000,
      salaryType: "annual",
      skills: ["Financial Strategy", "M&A", "Investor Relations", "Risk Management"],
      featured: true,
      status: "active",
    },
    {
      companyId: companyMap.get("saas-solutions")!,
      title: "Sales Director - Enterprise",
      slug: "sales-director-enterprise",
      description: "Lead our enterprise sales team and drive revenue growth by building relationships with Fortune 1000 accounts. This role combines strategic leadership with hands-on selling.",
      requirements: "8+ years of enterprise software sales experience. 3+ years of sales leadership experience. Proven track record of exceeding quota. Experience selling to C-level executives.",
      benefits: "Base salary plus uncapped commission. Stock options. President's Club eligibility. Full benefits package.",
      department: "Sales",
      location: "Austin, TX",
      locationType: "hybrid",
      jobType: "full-time",
      experienceLevel: "senior",
      salaryMin: 160000,
      salaryMax: 220000,
      salaryType: "annual",
      skills: ["Enterprise Sales", "Team Leadership", "SaaS", "Salesforce", "Negotiation"],
      featured: true,
      status: "active",
    },
    {
      companyId: companyMap.get("consumer-brands")!,
      title: "VP of Marketing",
      slug: "vp-marketing-consumer-brands",
      description: "We're looking for a visionary VP of Marketing to lead our brand strategy and drive growth across our portfolio of consumer products.",
      requirements: "12+ years of marketing experience in consumer goods. 5+ years in senior leadership roles. Strong track record of brand building and growth. Experience with digital marketing and e-commerce.",
      benefits: "Competitive executive compensation. Annual bonus program. Comprehensive benefits. Product discounts.",
      department: "Marketing",
      location: "Chicago, IL",
      locationType: "onsite",
      jobType: "full-time",
      experienceLevel: "executive",
      salaryMin: 180000,
      salaryMax: 250000,
      salaryType: "annual",
      skills: ["Brand Strategy", "Digital Marketing", "Team Leadership", "Consumer Insights"],
      featured: false,
      status: "active",
    },
    {
      companyId: companyMap.get("healthfirst")!,
      title: "Director of Human Resources",
      slug: "hr-director-healthfirst",
      description: "Lead our HR function and shape the employee experience at HealthFirst Systems. This role will drive talent acquisition, development, and organizational culture.",
      requirements: "10+ years of HR experience, with 5+ in leadership roles. Experience in healthcare or technology industries. SHRM-SCP or SPHR certification preferred.",
      benefits: "Competitive salary. Health, dental, and vision insurance. 401(k) with match. Paid parental leave.",
      department: "Human Resources",
      location: "Boston, MA",
      locationType: "hybrid",
      jobType: "full-time",
      experienceLevel: "senior",
      salaryMin: 140000,
      salaryMax: 180000,
      salaryType: "annual",
      skills: ["Talent Acquisition", "Employee Relations", "Compensation", "HRIS", "Compliance"],
      featured: false,
      status: "active",
    },
    {
      companyId: companyMap.get("ai-innovations")!,
      title: "Data Science Lead",
      slug: "data-science-lead-ai",
      description: "Join our cutting-edge AI research team as a Data Science Lead. You'll drive innovation in machine learning and lead a team of talented data scientists.",
      requirements: "PhD or MS in Computer Science, Statistics, or related field. 6+ years of experience in data science/ML. 2+ years of team leadership experience.",
      benefits: "Competitive compensation. Equity participation. Flexible remote work. Conference attendance budget.",
      department: "Data Science",
      location: "Remote",
      locationType: "remote",
      jobType: "full-time",
      experienceLevel: "senior",
      salaryMin: 170000,
      salaryMax: 230000,
      salaryType: "annual",
      skills: ["Machine Learning", "Python", "Deep Learning", "TensorFlow", "PyTorch", "NLP"],
      featured: false,
      status: "active",
    },
    {
      companyId: companyMap.get("paytech")!,
      title: "Product Manager - Fintech",
      slug: "product-manager-fintech",
      description: "Drive product strategy and execution for our digital payments platform. You'll work at the intersection of finance, technology, and user experience.",
      requirements: "5+ years of product management experience. Experience in fintech or payments industry. Strong analytical and problem-solving skills.",
      benefits: "Competitive salary and bonus. Stock options. Health and wellness benefits. Flexible PTO.",
      department: "Product",
      location: "San Jose, CA",
      locationType: "hybrid",
      jobType: "full-time",
      experienceLevel: "mid",
      salaryMin: 140000,
      salaryMax: 180000,
      salaryType: "annual",
      skills: ["Product Strategy", "Fintech", "Agile", "Data Analysis", "User Research"],
      featured: false,
      status: "active",
    },
    {
      companyId: companyMap.get("innovation-labs")!,
      title: "Operations Manager",
      slug: "operations-manager-innovation",
      description: "Oversee daily operations and drive operational excellence at Innovation Labs. This role is critical to scaling our business efficiently.",
      requirements: "7+ years of operations experience. Experience in technology or startup environments. Strong project management skills.",
      benefits: "Competitive salary. Equity package. Health benefits. Flexible work arrangements.",
      department: "Operations",
      location: "Austin, TX",
      locationType: "onsite",
      jobType: "full-time",
      experienceLevel: "mid",
      salaryMin: 95000,
      salaryMax: 120000,
      salaryType: "annual",
      skills: ["Operations Management", "Process Improvement", "Project Management", "Vendor Management"],
      featured: false,
      status: "active",
    },
  ];

  for (const job of jobData) {
    await db.insert(jobs).values(job);
  }

  console.log("[Database] Seed data inserted successfully");
}
