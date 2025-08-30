PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_email_table` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`user_id` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_email_table`("id", "email", "password", "user_id", "createdAt", "updatedAt") SELECT "id", "email", "password", "user_id", "createdAt", "updatedAt" FROM `user_email_table`;--> statement-breakpoint
DROP TABLE `user_email_table`;--> statement-breakpoint
ALTER TABLE `__new_user_email_table` RENAME TO `user_email_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_table_email_unique` ON `user_email_table` (`email`);