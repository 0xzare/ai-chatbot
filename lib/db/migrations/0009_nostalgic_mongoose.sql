CREATE TABLE IF NOT EXISTS "Keyword" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"keyword" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MessageKeyword" (
	"messageId" uuid NOT NULL,
	"keywordId" uuid NOT NULL,
	CONSTRAINT "MessageKeyword_messageId_keywordId_pk" PRIMARY KEY("messageId","keywordId")
);
--> statement-breakpoint
ALTER TABLE "Message_v2" ADD COLUMN "zone" text;--> statement-breakpoint
ALTER TABLE "Message_v2" ADD COLUMN "latitude" numeric;--> statement-breakpoint
ALTER TABLE "Message_v2" ADD COLUMN "longitude" numeric;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MessageKeyword" ADD CONSTRAINT "MessageKeyword_messageId_Message_v2_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."Message_v2"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MessageKeyword" ADD CONSTRAINT "MessageKeyword_keywordId_Keyword_id_fk" FOREIGN KEY ("keywordId") REFERENCES "public"."Keyword"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
