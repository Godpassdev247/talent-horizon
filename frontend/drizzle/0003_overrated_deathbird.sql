CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`senderName` varchar(255),
	`senderTitle` varchar(255),
	`recipientId` int NOT NULL,
	`applicationId` int,
	`jobId` int,
	`companyId` int,
	`subject` varchar(500),
	`content` text NOT NULL,
	`isRead` boolean DEFAULT false,
	`isArchived` boolean DEFAULT false,
	`parentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
