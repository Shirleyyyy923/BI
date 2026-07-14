CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`student_name` text NOT NULL,
	`student_form` text NOT NULL,
	`test_level` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`percentage` integer NOT NULL,
	`band` text NOT NULL,
	`cefr` text NOT NULL,
	`placement` text NOT NULL,
	`grammar` integer NOT NULL,
	`vocabulary` integer NOT NULL,
	`reading` integer NOT NULL,
	`writing` integer NOT NULL,
	`speaking` integer NOT NULL,
	`answers_json` text NOT NULL,
	`submitted_at` text NOT NULL
);
