import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      const workExp = await db.getUserWorkExperience(ctx.user.id);
      const edu = await db.getUserEducation(ctx.user.id);
      const skills = await db.getUserSkills(ctx.user.id);
      return { user, workExperience: workExp, education: edu, skills };
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        headline: z.string().optional(),
        summary: z.string().optional(),
        linkedinUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
      return db.getDashboardStats(ctx.user.id);
    }),

    addWorkExperience: protectedProcedure
      .input(z.object({
        companyName: z.string(),
        title: z.string(),
        location: z.string().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.addWorkExperience({
          userId: ctx.user.id,
          companyName: input.companyName,
          title: input.title,
          location: input.location,
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          current: input.current,
          description: input.description,
        });
        return { id };
      }),

    deleteWorkExperience: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteWorkExperience(input.id, ctx.user.id);
        return { success: true };
      }),

    addEducation: protectedProcedure
      .input(z.object({
        institution: z.string(),
        degree: z.string().optional(),
        fieldOfStudy: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.addEducation({
          userId: ctx.user.id,
          institution: input.institution,
          degree: input.degree,
          fieldOfStudy: input.fieldOfStudy,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          current: input.current,
          description: input.description,
        });
        return { id };
      }),

    deleteEducation: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteEducation(input.id, ctx.user.id);
        return { success: true };
      }),

    addSkill: protectedProcedure
      .input(z.object({
        name: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.addUserSkill({
          userId: ctx.user.id,
          name: input.name,
          level: input.level,
        });
        return { id };
      }),

    deleteSkill: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteUserSkill(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  jobs: router({
    search: publicProcedure
      .input(z.object({
        keyword: z.string().optional(),
        location: z.string().optional(),
        jobType: z.string().optional(),
        experienceLevel: z.string().optional(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        locationType: z.string().optional(),
        department: z.string().optional(),
        sortBy: z.enum(["date", "salary", "relevance"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.searchJobs(input || {});
      }),

    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getFeaturedJobs(input?.limit || 6);
      }),

    getRecent: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getRecentJobs(input?.limit || 10);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const job = await db.getJobById(input.id);
        if (!job) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Job not found" });
        }
        await db.incrementJobViewCount(input.id);
        const company = await db.getCompanyById(job.companyId);
        return { job, company };
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const job = await db.getJobBySlug(input.slug);
        if (!job) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Job not found" });
        }
        await db.incrementJobViewCount(job.id);
        const company = await db.getCompanyById(job.companyId);
        return { job, company };
      }),

    hasApplied: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.hasUserApplied(ctx.user.id, input.jobId);
      }),

    isSaved: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.isJobSaved(ctx.user.id, input.jobId);
      }),
  }),

  companies: router({
    getAll: publicProcedure.query(async () => {
      return db.getCompanies();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const company = await db.getCompanyById(input.id);
        if (!company) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });
        }
        return company;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const company = await db.getCompanyBySlug(input.slug);
        if (!company) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });
        }
        const { jobs } = await db.searchJobs({ companyId: company.id, limit: 10 });
        return { company, jobs };
      }),
  }),

  resumes: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserResumes(ctx.user.id);
    }),

    upload: protectedProcedure
      .input(z.object({
        name: z.string(),
        fileData: z.string(),
        fileType: z.string(),
        fileName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.fileData, "base64");
        const fileKey = `resumes/${ctx.user.id}/${nanoid()}-${input.fileName}`;
        
        const { url } = await storagePut(fileKey, buffer, input.fileType);
        
        const id = await db.createResume({
          userId: ctx.user.id,
          name: input.name,
          fileUrl: url,
          fileKey: fileKey,
          fileType: input.fileType,
          fileSize: buffer.length,
        });
        
        return { id, url };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteResume(input.id, ctx.user.id);
        return { success: true };
      }),

    setDefault: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.setDefaultResume(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  applications: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const apps = await db.getUserApplications(ctx.user.id);
      const enriched = await Promise.all(apps.map(async (app) => {
        const job = await db.getJobById(app.jobId);
        const company = job ? await db.getCompanyById(job.companyId) : null;
        return { ...app, job, company };
      }));
      return enriched;
    }),

    create: protectedProcedure
      .input(z.object({
        jobId: z.number(),
        resumeId: z.number().optional(),
        coverLetter: z.string().optional(),
        screeningAnswers: z.record(z.string(), z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const id = await db.createApplication({
            jobId: input.jobId,
            userId: ctx.user.id,
            resumeId: input.resumeId,
            coverLetter: input.coverLetter,
            screeningAnswers: input.screeningAnswers,
          });
          return { id, success: true };
        } catch (error: any) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message || "Failed to submit application",
          });
        }
      }),

    withdraw: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const app = await db.getApplicationById(input.id);
        if (!app || app.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
        }
        await db.updateApplicationStatus(input.id, "withdrawn");
        return { success: true };
      }),
  }),

  savedJobs: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const saved = await db.getUserSavedJobs(ctx.user.id);
      const enriched = await Promise.all(saved.map(async (s) => {
        const job = await db.getJobById(s.jobId);
        const company = job ? await db.getCompanyById(job.companyId) : null;
        return { ...s, job, company };
      }));
      return enriched;
    }),

    save: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.saveJob(ctx.user.id, input.jobId);
        return { success: true };
      }),

    unsave: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.unsaveJob(ctx.user.id, input.jobId);
        return { success: true };
      }),
  }),

  jobAlerts: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserJobAlerts(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        keywords: z.string().optional(),
        location: z.string().optional(),
        jobType: z.string().optional(),
        salaryMin: z.number().optional(),
        frequency: z.enum(["daily", "weekly", "instant"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createJobAlert({
          userId: ctx.user.id,
          name: input.name,
          keywords: input.keywords,
          location: input.location,
          jobType: input.jobType,
          salaryMin: input.salaryMin,
          frequency: input.frequency,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        keywords: z.string().optional(),
        location: z.string().optional(),
        jobType: z.string().optional(),
        salaryMin: z.number().optional(),
        frequency: z.enum(["daily", "weekly", "instant"]).optional(),
        active: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateJobAlert(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteJobAlert(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  seed: router({
    init: publicProcedure.mutation(async () => {
      await db.seedInitialData();
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
