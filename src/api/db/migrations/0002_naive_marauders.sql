CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"content" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"author_id" integer,
	"deleted_at" timestamp with time zone,
	"visibility" varchar(16) DEFAULT 'private',
	"share_id" varchar(32)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"status" varchar(32),
	"created_at" timestamp with time zone DEFAULT now(),
	"owner_id" integer
);
