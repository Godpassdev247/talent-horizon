CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`userId` int NOT NULL,
	`resumeId` int,
	`coverLetter` text,
	`status` enum('submitted','reviewing','shortlisted','interview','offer','hired','rejected','withdrawn') DEFAULT 'submitted',
	`screeningAnswers` json,
	`notes` text,
	`rating` int,
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`industry` varchar(100),
	`size` enum('1-10','11-50','51-200','201-500','501-1000','1000+'),
	`website` varchar(500),
	`logoUrl` text,
	`coverImageUrl` text,
	`location` varchar(255),
	`foundedYear` int,
	`verified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `companies_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`institution` varchar(255) NOT NULL,
	`degree` varchar(255),
	`fieldOfStudy` varchar(255),
	`startDate` timestamp,
	`endDate` timestamp,
	`current` boolean DEFAULT false,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `education_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`keywords` varchar(500),
	`location` varchar(255),
	`jobType` varchar(100),
	`salaryMin` int,
	`frequency` enum('daily','weekly','instant') DEFAULT 'daily',
	`active` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`requirements` text,
	`benefits` text,
	`department` varchar(100),
	`location` varchar(255) NOT NULL,
	`locationType` enum('remote','onsite','hybrid') DEFAULT 'onsite',
	`jobType` enum('full-time','part-time','contract','internship','temporary') DEFAULT 'full-time',
	`experienceLevel` enum('entry','mid','senior','executive') DEFAULT 'mid',
	`salaryMin` int,
	`salaryMax` int,
	`salaryType` enum('hourly','annual') DEFAULT 'annual',
	`showSalary` boolean DEFAULT true,
	`skills` json,
	`featured` boolean DEFAULT false,
	`urgent` boolean DEFAULT false,
	`status` enum('draft','active','paused','closed','filled') DEFAULT 'active',
	`applicationDeadline` timestamp,
	`viewCount` int DEFAULT 0,
	`applicationCount` int DEFAULT 0,
	`postedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileType` varchar(50),
	`fileSize` int,
	`isDefault` boolean DEFAULT false,
	`parsedData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resumes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`jobId` int NOT NULL,
	`savedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`level` enum('beginner','intermediate','advanced','expert') DEFAULT 'intermediate',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `work_experience` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`location` varchar(255),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`current` boolean DEFAULT false,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `work_experience_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','employer') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `headline` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `summary` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `linkedinUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `websiteUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `profileComplete` boolean DEFAULT false;