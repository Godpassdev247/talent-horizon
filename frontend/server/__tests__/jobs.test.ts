import { describe, it, expect, beforeAll } from "vitest";
import * as dbModule from "../db";

describe("Jobs Database Module", () => {
  describe("Database exports", () => {
    it("should export getDb function", () => {
      expect(dbModule.getDb).toBeDefined();
      expect(typeof dbModule.getDb).toBe("function");
    });

    it("should export upsertUser function", () => {
      expect(dbModule.upsertUser).toBeDefined();
      expect(typeof dbModule.upsertUser).toBe("function");
    });

    it("should export searchJobs function", () => {
      expect(dbModule.searchJobs).toBeDefined();
      expect(typeof dbModule.searchJobs).toBe("function");
    });

    it("should export getJobById function", () => {
      expect(dbModule.getJobById).toBeDefined();
      expect(typeof dbModule.getJobById).toBe("function");
    });

    it("should export createJob function", () => {
      expect(dbModule.createJob).toBeDefined();
      expect(typeof dbModule.createJob).toBe("function");
    });

    it("should export createApplication function", () => {
      expect(dbModule.createApplication).toBeDefined();
      expect(typeof dbModule.createApplication).toBe("function");
    });

    it("should export getUserApplications function", () => {
      expect(dbModule.getUserApplications).toBeDefined();
      expect(typeof dbModule.getUserApplications).toBe("function");
    });

    it("should export createResume function", () => {
      expect(dbModule.createResume).toBeDefined();
      expect(typeof dbModule.createResume).toBe("function");
    });

    it("should export getUserResumes function", () => {
      expect(dbModule.getUserResumes).toBeDefined();
      expect(typeof dbModule.getUserResumes).toBe("function");
    });

    it("should export saveJob function", () => {
      expect(dbModule.saveJob).toBeDefined();
      expect(typeof dbModule.saveJob).toBe("function");
    });

    it("should export unsaveJob function", () => {
      expect(dbModule.unsaveJob).toBeDefined();
      expect(typeof dbModule.unsaveJob).toBe("function");
    });

    it("should export getUserSavedJobs function", () => {
      expect(dbModule.getUserSavedJobs).toBeDefined();
      expect(typeof dbModule.getUserSavedJobs).toBe("function");
    });
  });

  describe("searchJobs function", () => {
    it("should return jobs array and total count", async () => {
      const result = await dbModule.searchJobs({});
      expect(result).toBeDefined();
      expect(result).toHaveProperty("jobs");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.jobs)).toBe(true);
      expect(typeof result.total).toBe("number");
    });

    it("should respect limit parameter", async () => {
      const result = await dbModule.searchJobs({ limit: 3 });
      expect(result.jobs.length).toBeLessThanOrEqual(3);
    });

    it("should handle keyword search", async () => {
      const result = await dbModule.searchJobs({ keyword: "Engineer" });
      expect(result).toBeDefined();
      expect(Array.isArray(result.jobs)).toBe(true);
    });

    it("should handle location filter", async () => {
      const result = await dbModule.searchJobs({ location: "San Francisco" });
      expect(result).toBeDefined();
      expect(Array.isArray(result.jobs)).toBe(true);
    });

    it("should handle job type filter", async () => {
      const result = await dbModule.searchJobs({ jobType: "full-time" });
      expect(result).toBeDefined();
      expect(Array.isArray(result.jobs)).toBe(true);
    });
  });

  describe("getJobById function", () => {
    it("should return null or undefined for non-existent job", async () => {
      const job = await dbModule.getJobById(999999);
      expect(job == null).toBe(true); // null or undefined
    });

    it("should return job details when job exists", async () => {
      // First get a job from search
      const searchResult = await dbModule.searchJobs({ limit: 1 });
      if (searchResult.jobs.length > 0) {
        const jobId = searchResult.jobs[0].id;
        const job = await dbModule.getJobById(jobId);
        expect(job).toBeDefined();
        expect(job?.id).toBe(jobId);
        expect(job).toHaveProperty("title");
        expect(job).toHaveProperty("location");
      }
    });
  });
});
